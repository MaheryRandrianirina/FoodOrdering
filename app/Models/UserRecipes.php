<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRecipes extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'recipe_id',
        'address',
        'quantity',
        'delivered'
    ];
}
