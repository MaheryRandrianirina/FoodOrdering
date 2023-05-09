<?php
use App\Http\Controllers\PostController;
?>
@extends('layouts.admin')

@section('header')
@include('partials.admin-navbar')
@endsection
@section('content')
<div class="container">
    <div class="admin-actions-bar">
        @if(Auth::user()->is_superadmin)
        <div class="infos_for_actions_menu">
            <a href="{{ route('admin.list') }}" class="admin_list_link">Liste des administrateurs</a>
        </div>
        @endif
        @if(session()->get('success'))
        <div class="alert alert-success">{{ session()->get('success') }}</div>
        @endif
    </div> 
    @if($categories->isNotEmpty())
    <div class="recipes">
            @foreach($categories as $category)
            <?php
            $recipes = PostController::findByCategoryId($category->id);
            ?>
                @if(!empty($recipes)) 
                <div class="category_name">
                    <p>{{ $category->name }}</p>
                    <a href="{{ route('category.show', ['slug' => $category->slug, 'id' => $category->id]) }}" class="reveal">Voir tout <span class="reveal_arrow">&RightArrow;</span></a>
                </div>
                <div id="Carousel">
                    @include('partials.recipes')
                </div>
                @include('partials.hidden-category-infos')
                @endif
            @endforeach
    </div>
    @else
        <div class="empty_recipes">
            <p>Il n'y a pas encore de plats !</p>  
            <i class="fas fa-exclamation-triangle"></i>
        </div>
    @endif
</div>
@endsection()