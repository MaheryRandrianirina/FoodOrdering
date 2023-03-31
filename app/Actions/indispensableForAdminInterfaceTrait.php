<?php

namespace App\Actions;

use App\Models\Category;

trait indispensableForAdminInterfaceTrait {

    /**
     * retourne les données indispensable pour l'interface admin
     * @return array
     */
    private function indispensableForAdminInterface(): array
    {
        $profilePhoto = $this->getAuthenticatedUserProfilePhoto();
        $categories = Category::all();

        return [
            'profilePhoto' => $profilePhoto,
            'categories' => $categories
        ];
    }
}