@extends($layout)

@section('header')

@if(auth()->user() && auth()->user()->is_admin === 1)
    @include('partials.admin-navbar') <!-- MBOLA HATAO DYNAMIQUE ARAKY NY UTILISATEUR -->
@else
    @include('partials.navbar')
@endif

@endsection

@section('content')
<div class="container">
    <div class="search_results">
        <h3>RESULTATS DE LA RECHERCHE</h3>
        @if(!empty($recipes))
            @include('partials.recipes')
        @else
        <div class="empty-result">AUCUN RESULTATS TROUVES</div>
        @endif
    </div>
    
</div>
@endsection