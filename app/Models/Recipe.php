<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'price', 
        'unity', 
        'description', 
        'slug', 
        'selled',
        'admin_id',
        'created_at',
        'updated_at'
    ];
        
    /**
     * categories
     *
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }

    public function admin()
    {
        return $this->belongsTo(User::class);
    }

    public function user()
    {
        return $this->belongsToMany(User::class);
    }
}
