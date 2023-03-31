<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe_user extends Model
{
    use HasFactory;

    protected $table = 'recipe_user';
    
    protected $fillable = [
        'user_id',
        'recipe_id',
        'address',
        'quantity',
        'delivered'
    ];
}
