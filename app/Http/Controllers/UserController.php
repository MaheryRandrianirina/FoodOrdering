<?php

namespace App\Http\Controllers;

use App\Actions\ProfilePhotoActionsTrait;
use App\Models\Recipe;
use App\Files\Upload\UserImageUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    use ProfilePhotoActionsTrait;

    public function renderLoginView()
    {
        return view('login');
    }

    public function renderRegisterView()
    {
        return view('register');
    }
    
    public function showProfilePhoto(){
        $profile_photo = $this->getAuthenticatedUserProfilePhoto();

        return view("image", ['profile_photo' => $profile_photo]);
    }

    public function editProfilePhoto(Request $request, int $id)
    {
        if($request->isMethod('GET')){
            return view("modify-image", ['id' => $id]);
        }elseif($request->isMethod('POST')){

            $request->validate([
                'image' => ['required']
            ]);
            
            $this->deleteLastProfilePhoto($id);
            
            $path = (new UserImageUpload())->upload($request->image);
            $this->insertNewProfilePhoto($path , $request, $id);

            echo json_encode(['success' => "Nouvelle photo de profil ajoutée !"]);
        }
        
    }

    public function showAuthenticatedUserWishes()
    {
        $wishes = Auth::user()->wishes;
        $bagages = $this->bagageToUserInterface();
        $recipes = $this->getRecipesWichCorrespondsTo($wishes);
        $bagages['recipes'] = $recipes;
        $bagages['title'] = 'Liste des souhaits';
        
        return view('wishes', $bagages);
    }

    private function getRecipesWichCorrespondsTo($wishes): array
    {
        $recipes = [];
        foreach($wishes as $wish){
            $recipes[] = Recipe::find($wish->recipe_id);
        }

        return $recipes;
    }

}
