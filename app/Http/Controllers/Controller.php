<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Recipe;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;

class Controller extends BaseController
{

    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * récupère les éléments indispensables tant pour l'administrateur 
     * que le simple utilisateur. Ces éléments seront envoyés à la vue home
     *
     * @return array
     */
    protected function bagageToUserInterface(): array
    {
        $categories = Category::all();
        if(Auth::user() !== null){
            return $this->getBagagesForAuthenticatedUser($categories);
        }

        return [
            'categories' => $categories,
            'layout' => 'layouts.app'
        ];
    }

    private function getBagagesForAuthenticatedUser($categories): array
    {
        $userImage = Auth::user()->image;
        $profilePhoto = $this->getAuthenticatedUserProfilePhoto();
        $authenticatedUserWishesPerRecipe = $this->getAuthenticatedUserWishesPerRecipe();
        
        return [
            'categories' => $categories,
            'userImage' => $userImage,
            'profilePhoto' => $profilePhoto,
            'authenticatedUserWishesPerRecipe' => $authenticatedUserWishesPerRecipe,
            'layout' => Auth::user()->is_admin === 1 ? 'layouts.admin' : 'layouts.app'
        ];
    }

    /**
     * @return profilePhoto | null
     */
    protected function getAuthenticatedUserProfilePhoto()
    {
        if(Auth::user() !== null){
            return Auth::user()->image;
        }
        return null;
    }

    private function getAuthenticatedUserWishesPerRecipe(): ?array
    {
        $wishes = Auth::user()->wishes;
        $wishesPerRecipe = [];

        foreach($wishes as $wish){
            $wishesPerRecipe[$wish->recipe_id] = $wish;
        }

        return $wishesPerRecipe;
    }
}
