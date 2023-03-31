<?php
namespace App\Files\Upload;

use Illuminate\Support\Facades\Storage;

class ImageUpload {

    protected $directory;

    public function upload($image)
    {
        return $this->store($image);
        
    }

    protected function store($image)
    {
        return Storage::disk('public')->put($this->directory, $image);
    }
}