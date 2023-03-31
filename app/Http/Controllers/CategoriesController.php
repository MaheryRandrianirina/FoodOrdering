<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoriesController extends Controller
{

    private $recipesWhichCorrespondsToCategoryInfos = [];
    private $category_slug;
    private $category_id;
    private $category_name;

    public function showRecipesWhichCorrespondsTo(string $category_slug, int $category_id)
    {
        $this->category_slug = $category_slug;
        $this->category_id = $category_id;
        $recipes = Recipe::all();
        $bagages = $this->bagageToUserInterface();

        foreach($recipes as $recipe){
            $this->addToRecipesArrayCorrespondantsRecipe($recipe);  
        }

        $bagages['recipes'] = $this->recipesWhichCorrespondsToCategoryInfos;
        $bagages['categoryName'] = $this->category_name;
        $bagages['layout'] = Auth::hasUser() && Auth::user()->is_admin === 1 ? 'layouts.admin' : 'layouts.app';
        return view('categories.show', $bagages);
    }

    private function addToRecipesArrayCorrespondantsRecipe($recipe)
    {
        foreach($recipe->categories as $category){
            if($category->slug === $this->category_slug && $category->id === $this->category_id){
                $this->recipesWhichCorrespondsToCategoryInfos[] = $recipe;
                $this->category_name = $category->name;
            }
        }
    }
}
