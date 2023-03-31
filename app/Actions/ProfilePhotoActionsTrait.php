<?php

namespace App\Actions;

use App\Files\FileManager;
use App\Models\UserImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

trait ProfilePhotoActionsTrait {

    private function insertNewProfilePhoto(string $path, Request $request, int $user_id)
    {
        UserImage::create([
            'file' => $path,
            'extension' => $request->file('image')->extension(),
            'user_id' => $user_id,
            'is_profile_photo' => 1
        ]);
    }

    private function deleteLastProfilePhoto(int $user_id): void
    {
        $userImages = UserImage::where('user_id', $user_id)->get();
        
        foreach($userImages as $userImage){
            FileManager::remove('public', $userImage->file);
            $userImage->delete();
        }
    }

    private function setLastProfilePhotoToFalse(int $user_id): void
    {
        $userImages = UserImage::where('user_id', $user_id);
            
        foreach($userImages as $userImage){
            $userImage->update(['is_profile_photo' => 0]);
        }
    }
}