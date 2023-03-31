@extends('layouts.admin')

@section('content')

@if($errors->any())
    <?php $error = $errors->messages() ?>
@endif
<div class="container new_recipe_form_container" style="margin-left: auto;">
    <form action="{{ route('post.new') }}" method="POST" enctype="multipart/form-data">
        @csrf
        @include('post.admin.form')
        <button type="submit" class="add-button">Créer <i class="fas fa-check"></i></button>
    </form>    
</div>
    
@endsection