<?php

namespace App\Http\Controllers;

use App\Actions\indispensableForAdminInterfaceTrait;
use App\Files\Upload\RecipeImageUpload;
use App\Models\Category;
use App\Models\Category_recipe;
use App\Models\Image;
use App\Models\Recipe;
use App\Models\Wishes;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    use indispensableForAdminInterfaceTrait;
    
    private $searchedRecipes = [];
    
    public function renderPostCreationView()
    {
        $indispensable = $this->indispensableForAdminInterface();

        return view('post.admin.new', $indispensable);  
    }

    /**
     * crée un nouveau plat puis redirige vers le dashboard
     */
    public function create(Request $request)
    {
        $this->recipeRequestValidation($request);
        $recipe = $this->insertRecipeToDatabase($request);

        $category = Category::where('name', $request->category)->first();

        if($recipe){
            $recipe->categories()->attach($category->id);
            $this->uploadRecipeImage($request, $recipe);
        }

        return redirect(RouteServiceProvider::DASHBOARD);
    }

    private function recipeRequestValidation(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string'],
            'slug' => ['required', 'string'],
            'category' => ['required', 'string'],
            'description' => ['required', 'string'],
            'image1' => ['required', 'file'],
            'price' => ['required', 'int'],
            'unity' => ['required', 'string']
        ]);
    }
    private function insertRecipeToDatabase(Request $request)
    {

        return Recipe::create([
            'name' => $request->name,
            'price' => $request->price,
            'unity' => $request->unity,
            'description' => $request->description,
            'slug' => $request->slug,
            'admin_id' => Auth::user()->id
        ]);
    }

    private function uploadRecipeImage(Request $request, $recipe)
    {
        $recipeImageUpload = new RecipeImageUpload();
        $image1 = $recipeImageUpload->upload($request->image1);

        if(!is_null($request->image2)){
            $image2 = $recipeImageUpload->upload($request->image2);
            
            $this->insertImageIntoDatabase([
                [
                    'image' => $image1, 
                    'extension' => $request->image1->extension(), 
                    'recipe_id' => $recipe->id
                ],
                [
                    'image' => $image2, 
                    'extension' => $request->image2->extension(), 
                    'recipe_id' => $recipe->id
                ]
            ]);
            
        }else{
            
            $this->insertImageIntoDatabase([
                [
                    'image' => $image1, 
                    'extension' => $request->image1->extension(), 
                    'recipe_id' => $recipe->id
                ]
            ]);
        }
        
    }

    private function insertImageIntoDatabase(array $imagesInfos): void
    {
        foreach($imagesInfos as $imageInfo)
        {
            $this->imageCreate($imageInfo['image'], $imageInfo['extension'], $imageInfo['recipe_id']);
        }
    }
    
    public function renderEditRecipeForm(Request $request, string $slug, int $id)
    {
        if($request->isMethod('GET')){
            return $this->renderViewByCorrectingSlugIfNotExact($slug, $id);
        }
    }

    /**
     * reappelle la methode renderEditRecipeForm si le slug ne correspond pas à ce qui devrait l'être
     */
    private function renderViewByCorrectingSlugIfNotExact(string $slug, int $id)
    {
        $recipe = Recipe::find($id);
        $profilePhoto = $this->getAuthenticatedUserProfilePhoto();
        $categories = Category::all();

        if($slug === $recipe->slug){
            return view("post.admin.edit", [
                'recipe' => $recipe, 
                'profilePhoto' => $profilePhoto,
                'categories' => $categories
            ]);
        }else{
            $url = route("admin.post.edit", ['slug' => $recipe->slug, "id" => $id]);
            return redirect($url);
        }
    }
    
    /**
     * édite un élément
     *
     * @param  Request $request
     * @param  int $id
     * @return void
     */
    public function editRecipeAction(Request $request, int $id)
    {     
        if($request->isMethod('POST')){
            $this->updateRecipe($request, $id);
            $request->session()->flash('success', 'L\'édition a été un succès !');

            return redirect(RouteServiceProvider::DASHBOARD);
        }
    }
    
    /**
     * supprime un élément
     *
     * @param Request $request
     * @param  mixed $request
     * @return void
     */
    public function delete(int $id)
    {
        $recipe = Recipe::find($id);
        
        if(!is_null($recipe)){
            $recipe->delete();
            echo json_encode(['success' => "Plat supprimé avec succes!"]);
        }else{
           abort(404); 
        }
    }
    
    public function findSearchedRecipe(Request $request)
    {
        $request->validate([
            'q' => ['required', 'string']
        ]);
        
        $layout = '';

        //Eviter les doublons
        $recipes = $this->getSearchedRecipesWithoutLining($request->q);

        $profilePhoto = $this->getAuthenticatedUserProfilePhoto();

        if($this->authUserIsAdmin()){
            $layout = 'layouts.admin';
        }elseif($this->authUserIsNotAdmin()){
            $layout = 'layouts.app';
        }else{
            $layout = 'layouts.app';
        }
        
        return view('post.search-results', compact('recipes', 'layout', 'profilePhoto'));
    }

    private function getSearchedRecipesWithoutLining(string $searchInputValue)
    {
        $resultsInDifferentSTable = $this->findResultsBySameKeyInDifferentsTablesByColumn($searchInputValue, [
            ['name' => Recipe::class],
            ['description' => Recipe::class],
            ['name' => Category::class]
        ]);

        if(
            array_key_exists('categoriesByName', $resultsInDifferentSTable) 
            && !$resultsInDifferentSTable['categoriesByName']->isEmpty()
        ){
            $this->iterateOverCategoriesToSetSearchedRecipes($resultsInDifferentSTable);
        }else{
            $this->pushRecipesByNameIntoSearchedRecipes($resultsInDifferentSTable['recipesByName']);
            $this->pushRecipesByDescriptionIfNotYetIntoSearchedRecipes($resultsInDifferentSTable['recipesByDescription']);
        }

        return $this->searchedRecipes;
    }

    private function authUserIsAdmin(): bool
    {
        return Auth::user() && Auth::user()->is_admin === 1;
    }

    private function authUserIsNotAdmin(): bool
    {
        return Auth::user() && Auth::user()->is_admin === 0;
    }

    private function findResultsBySameKeyInDifferentsTablesByColumn(string $key, array $differentsTablesKeyedByColumn): array
    {
        $results = [];
        foreach($differentsTablesKeyedByColumn as $columnAndTable){
            
            foreach($columnAndTable as $column => $table){
                $arrayKey = $table !== Category::class ? 'recipesBy' . ucfirst($column) :  'categoriesBy' . ucfirst($column);
                $results[$arrayKey] = $table::where($column, 'like', "%" . $key . "%")->get();
            }
        }
        
        return $results;
    }

    private function iterateOverCategoriesToSetSearchedRecipes(array $resultsInDifferentSTable)
    {
        foreach($resultsInDifferentSTable['categoriesByName'] as $category){
            $this->iterateOverCategoryRecipesResultsByCategoryId($resultsInDifferentSTable, $category->id);
        }
    }

    private function iterateOverCategoryRecipesResultsByCategoryId(array $resultsInDifferentSTable, int $category_id)
    {
        $category_recipes = Category_recipe::where('category_id', $category_id)->get();

        foreach($category_recipes as $category_recipe){
            $this->pushRecipesWhichBelongToCategoryOrNotIntoSearchedRecipesBy($category_recipe, $resultsInDifferentSTable['recipesByName']);
            $this->pushRecipesWhichBelongToCategoryOrNotIntoSearchedRecipesBy($category_recipe, $resultsInDifferentSTable['recipesByDescription']);
        }
    }

    private function pushRecipesWhichBelongToCategoryOrNotIntoSearchedRecipesBy($category_recipe, $recipesByColumn)
    {
        foreach($recipesByColumn as $recipe){
            if($recipe->id !== $category_recipe->recipe_id){
                $this->searchedRecipes[] =  Recipe::find($category_recipe->recipe_id);
                $this->searchedRecipes[] = $recipe;
            }else{
                $this->searchedRecipes[] = $recipe;
            }
        }
    }

    private function pushRecipesByNameIntoSearchedRecipes($recipesByName): void
    {
        foreach($recipesByName as $recipe){
            $this->searchedRecipes[] = $recipe;
        }
    }

    private function pushRecipesByDescriptionIfNotYetIntoSearchedRecipes($recipesByDescription): void
    {
        foreach($recipesByDescription as $recipe){
            if(!in_array($recipe, $this->searchedRecipes)){
                $this->searchedRecipes[] = $recipe;
            }  
        }
    }
    
    /**
     * récupère tous les enregistrements pour les mettre dans le localStorage du navigateur
     */
    public function getNecessaryDataForUserSearchAutosuggestion()
    {
        $recipes = Recipe::all();
        $categories = Category::all();

        $results = [];

        foreach($recipes as $recipe){
            $results[] = $recipe->name;
            $results[] = $recipe->description;
        }

        foreach($categories as $category){
            $results[] = $category->name;
        }
        
        echo json_encode($results);
    }
    
    /**
     * ajoute un plat dans la liste des souhaits
     *
     * @param  mixed $request
     * @return void
     */
    public function AddToWish(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer']
        ]);
        
        if(!$this->recipeAlreadyInWishes((int)$request->id)){
            Wishes::create([
                'recipe_id' => $request->id,
                'user_id' => Auth::user()->id
            ]);

            echo json_encode(['message' => 'ajouté à la liste des souhaits']);
        }else{
            $this->deleteRecipeFromWishes((int)$request->id);
            echo json_encode(['message' => 'retiré de la liste des souhaits']);
        }
        die();   
    }

    private function recipeAlreadyInWishes(int $requestRecipeId): bool
    {
        foreach(Auth::user()->wishes as $wish){
            if($wish->recipe_id === $requestRecipeId && $wish->user_id === (int)Auth::user()->id){
                return true;
            }
        }
        return false;
    }

    private function deleteRecipeFromWishes(int $requestRecipeId): void
    {
        $wishes = Wishes::where([
            'recipe_id' => $requestRecipeId,
            'user_id' => Auth::user()->id
        ])->get();
        
        foreach($wishes as $wish){
            $wish->delete();
        }
    }

    public static function findByCategoryId(int $category_id)
    {
        $recipes = Recipe::all();
        $searchedRecipes = [];

        foreach($recipes as $recipe){
            foreach($recipe->categories as $category){
                if($category->id === $category_id){
                    $searchedRecipes[] = $recipe;
                }
            }
        }
        
        return $searchedRecipes;
    }

    private function updateRecipe(Request $request, int $id)
    {
        $this->validationIcCaseOfNewOrUpdateRecipe($request, false);
        $recipe = Recipe::find($id);
        
        $recipe->update([
            'name' => $request->name,
            'price' => $request->price,
            'unity' => $request->unity,
            'description' => $request->description,
            'slug' => $request->slug,
            'updated_at' => date("Y-m-d H:i:s")
        ]);
        
        $category = Category::where('name', $request->category)->first();
        foreach($recipe->categories as $c){
            if($category !== null){
                if($c->id !== $category->id){
                    $recipe->categories()->detach($c->id);
                    $recipe->categories()->attach($category->id);
                }
            }
            
        } 

        if($request->image1 !== null){
            $image1 = Storage::disk('public')->put('searchedRecipes', $request->image1);

            if(!is_null($request->image2)){

                $image2 = Storage::disk('public')->put('searchedRecipes', $request->image2);
    
                if(count($recipe->images) === 1){
                    foreach($recipe->images as $image){
                        $this->imageUpdate($image, $image1, $request->image1->extension(), $recipe->id);
                    }
                    $this->imageCreate($image2, $request->image1->extension(), $recipe->id);
    
                }else{
                    foreach($recipe->images as $image){
                        $this->imageUpdate($image, $image1, $request->image1->extension(), $recipe->id);
                        $image1 = $image2;
                    }
                }
            }else{
                if(count($recipe->images) === 1){
                    foreach($recipe->images as $image){
                        $this->imageUpdate($image, $image1, $request->image1->extension(), $recipe->id);
                    }
                }else{
                    foreach($recipe->images as $image){
                        $this->imageUpdate($image, $image1, $request->image1->extension(), $recipe->id);
    
                        return;
                    }
                }
            } 
        }   
    }

    private function imageCreate(string $path, string $extension, int $recipeId)
    {
        Image::create([
            'file' => $path,
            'extension' => $extension,
            'recipe_id' => $recipeId
        ]);
    }
    
    /**
     * met à jour les images d'une recette
     *
     * @param  mixed $imageModel
     * @param  string $path
     * @param  string $extension
     * @param  int $id
     */
    private function imageUpdate($imageModel, string $path, string $extension, int $id)
    {
        return $imageModel->update([
            'file' => $path,
            'extension' => $extension,
            'recipe_id' => $id
        ]);
    }

    private function validationIcCaseOfNewOrUpdateRecipe(Request $request, bool $new = true): array
    {
        if($new){
            $toBeValidate = [
                'name' => ['required', 'string', 'min:3', 'max:255'],
                'slug' => ['required', 'string', 'min:3', 'max:255'],
                'category' => ['required', 'string'],
                'price' => ['required', 'integer'],
                'image1' => ['required'],
                'description' => ['required', 'string'] 
            ];
        }else{
            $toBeValidate = [
                'name' => ['required', 'string', 'min:3', 'max:255'],
                'slug' => ['required', 'string', 'min:3', 'max:255'],
                'category' => ['required', 'string'],
                'price' => ['required', 'integer'],
                'description' => ['required', 'string'] 
            ];
        }
        
        
        if(!is_null($request->unity)){
            $toBeValidate['unity'] = ['string'];
        }

        return $request->validate($toBeValidate);
    }
}
