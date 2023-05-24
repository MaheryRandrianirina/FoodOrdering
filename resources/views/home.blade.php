<?php use App\Http\Controllers\PostController; ?>
@extends($layout)

@section('content')
<div class="home container">
    @if(session()->get('success'))
    <p class="payment-success">{{ session()->get('success') }}</p>
    @endif
    @if($categories->isNotEmpty())
        @foreach($categories as $category)
        <?php
        $recipes = PostController::findByCategoryId($category->id);
        ?>
            @if(!empty($recipes))  
            <div class="category_name">
                <p>{{ $category->name }}</p>
                <a href="{{ route('category.show', ['slug' => $category->slug, 'id' => $category->id]) }}" class="reveal">Voir tout <span class="reveal_arrow">&RightArrow;</span></a>
            </div>
            <div class="owl-carousel owl-theme">
                @include('partials.recipes')
            </div>
            @include('partials.hidden-category-infos')
            @endif
        @endforeach
    @else
    <div class="empty_recipes">
        <p>Il n'y a pas encore de plats !</p>
        <div class="fas fa-exclamation-triangle"></div>
    </div>
    @endif
</div>
@endsection