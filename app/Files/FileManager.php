<?php

namespace App\Files;

use Illuminate\Support\Facades\Storage;

class FileManager {

    public static function remove(string $disk, string $path): void
    {
        if(Storage::disk($disk)->exists($path)){
            Storage::disk($disk)->delete($path);
        } 
    }
}