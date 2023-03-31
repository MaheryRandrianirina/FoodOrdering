@foreach($recipes as $category => $recipe)
<div class="box">  
    <div class="box-body">      
        @foreach($recipe->images as $image)
            <img src="{{ Storage::url($image->file) }}" class="card-img-top" alt="{{ $recipe->name }}">
            <p class="recipe_price">{{ $recipe->price }} {{ $recipe->unity }}</p>
        @endforeach  
    </div>
    <div class="box-description">
        <p class="recipe_name">{{ $recipe->name }}</p>
        <p class="recipe_description">{{ $recipe->description }}</p>
    </div>
    <div class="buttons actions">
        @csrf
        @if(!Auth::user())
        <a href="{{ route('user.payment', ['id' => $recipe->id]) }}" class="button add">Acheter</a>
        @elseif(Auth::user() && Auth::user()->is_admin === 0)
        <a href="{{ route('user.payment', ['id' => $recipe->id]) }}" class="button add">Acheter</a>
        <p class="heart-icon">
            <input type="hidden" name="recipe_id" value="{{ $recipe->id }}">
            @if(!empty($authenticatedUserWishesPerRecipe))
                @if(isset($authenticatedUserWishesPerRecipe[$recipe->id]))
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill='#fea702'></path></svg>
                @else
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                @endif
            @else 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            @endif
        </p>
        @elseif(Auth::user() && Auth::user()->is_admin === 1)
        <a href="{{ route('admin.post.delete', ['id' => $recipe->id]) }}" class="button delete">Supprimer</a>
        <a href="{{ route('admin.post.edit', ['slug' => $recipe->slug, 'id' => $recipe->id]) }}" class="button modify">Modifier <i class="fas fa-edit"></i></a>
        @endif
    </div>
</div>
@endforeach