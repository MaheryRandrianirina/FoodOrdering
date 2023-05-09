<?php
namespace App\Files\Upload;

use Illuminate\Support\Facades\Storage;

class ImageUpload {

    protected $directory;

    public function upload($image): string
    {
        return $this->store($image);
        
    }

    protected function store($image): string
    {
        $link = Storage::disk('public')->put($this->directory, $image);
        return $link;
    }
}