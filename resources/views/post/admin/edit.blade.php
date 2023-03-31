@extends('layouts.admin')

@section('content')

@if($errors->any())
    <?php $err = $errors->messages() ?>
@endif
<div class="container edit_recipe_form_container">
    <form action="{{ route('post.edit', ['id' => (int)$recipe->id ]) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @include('post.admin.form')
        <button type="submit" class="add-button">Terminer <i class="fas fa-check"></i></button>
    </form>    
</div>
    
@endsection