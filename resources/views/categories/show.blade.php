@extends($layout)

@section('content')
<div class="container">
    <div class="category_name in_show_category">
        <p>{{ $categoryName }}</p>
    </div>
    <div class="category_recipes">
    @include('partials.recipes')
    </div>
</div>
@endsection