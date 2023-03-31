@extends('layouts.app')
@section('content')

<div class="container">
    @if($recipes)
        @include('partials.recipes')
    @else
    <div class="empty-basket">
        <i class="fas fa-shopping-basket"></i>
        <p>Votre panier est encore vide</p>
    </div>
    @endif
</div>
@endsection()