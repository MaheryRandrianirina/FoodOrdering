<?php

namespace App\Files\Upload;

use App\Models\UserImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecipeImageUpload extends ImageUpload {

    protected $directory = 'recipes';
}