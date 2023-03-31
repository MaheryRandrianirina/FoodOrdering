<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CommandController;
use App\Http\Controllers\PayementController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [AppController::class, 'renderHomeView'])->name('home');
Route::get('/get-all', [PostController::class, 'getNecessaryDataForUserSearchAutosuggestion']);
Route::get('/change-route', [AppController::class, 'redirectToAdminDashboardOrHome'])->name('app.change.route');
Route::get('/posts', [PostController::class, 'getNecessaryDataForUserSearchAutosuggestion'])->name('posts.all');
Route::get('/category/{slug}-{id}', [CategoriesController::class, 'showRecipesWhichCorrespondsTo'])->name('category.show')->where([
    'slug' => '[a-zA-Z\-?]+',
    'id' => '[0-9]+'
]);

Route::post('/recipe/search', [PostController::class, 'findSearchedRecipe'])->name('recipe.search');

Route::middleware(['auth'])->group(function(){
    Route::get('/user/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::get("/profile-photo/show", [UserController::class, 'showProfilePhoto'])->name('profile.photo.show');
    Route::get("/profile-photo/edit/{id}", [UserController::class, 'editProfilePhoto'])->name('profile.photo.edit')->where(['id' => '[0-9]+']);
    Route::post("/profile-photo/edit/{id}", [UserController::class, 'editProfilePhoto'])->where(['id' => '[0-9]+']);
    
});

Route::middleware(['auth','simpleUser'])->group(function(){
    Route::get('/user/wishes', [UserController::class, 'showAuthenticatedUserWishes']);
    Route::get('/user/payment/{id}', [AppController::class, 'renderPaymentForm'])
        ->name('user.payment')
        ->where(['id' => '[0-9]+']);

    Route::post('/payment', [PayementController::class, 'store'])
        ->name('payment.process');

    Route::post('/recipe/wish', [PostController::class, 'AddToWish']);
});

Route::middleware(['admin'])->group(function(){
    Route::get('/admin/dashboard', [AdminController::class, 'renderAdminDashboardView'])->name('app.admin.dashboard');
    Route::get('/admin/post/new', [PostController::class, 'renderPostCreationView'])->name('post.new');
    Route::get('/admin/commands', [AdminController::class, 'renderUserCommandsView'])->name('commands');
    Route::post('/command/delivered/{id}', [CommandController::class, 'delivered'])
        ->where(['id' => '[0-9]+']);

    Route::post('/admin/post/new', [PostController::class, 'create']);

    Route::get('/post/edit/{slug}-{id}', [PostController::class, 'renderEditRecipeForm'])->name('admin.post.edit')->where([
        "slug" => '[a-zA-Z\-?]+', 
        'id' => '[0-9]+'
    ]);

    Route::post('/post/edit/{id}', [PostController::class, 'editRecipeAction'])->name('post.edit')->where([ 
        'id' => '[0-9]+'
    ]);
    
    Route::post('/post/delete/{id}', [PostController::class, 'delete'])
        ->name('admin.post.delete')
        ->where([
        'id' => '[0-9]+'
    ]);
});

Route::middleware(['superAdmin'])->group(function(){
    Route::get('/admin/list', [AdminController::class, 'renderAdminListView'])->name('admin.list');
    Route::get('/admin/create', [AdminController::class, 'createAdmin'])->name('admin.create');
    Route::post('/admin/create', [RegisteredUserController::class, 'storeNewAdmin'])->name('admin.create');
    Route::post('/admin/delete/{id}', [AdminController::class, 'deleteAdmin'])
        ->name('admin.delete')
        ->where([
            "id" => "[0-9]+"
        ]);

});

require __DIR__.'/auth.php';