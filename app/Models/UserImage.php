<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'file',
        'extension',
        'user_id',
        'created_at',
        'updated_at',
        'is_profile_photo'
    ];

    public function user()
    {
        $this->belongsTo(User::class);
    }
}
