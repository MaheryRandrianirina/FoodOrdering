@extends('layouts.not-logged')

@section('content')
<div class="form-container">
    @if($errors->any())
        <?php $err = $errors->messages(); ?>
    @endif
    <form action="{{ route('login') }}" method="POST">
        @csrf
        <div class="no-account">Pas encore de compte ? <a href="{{ route('register')}}">S'inscrire</a></div>
        
        <div class="pseudo">
            <label for="pseudo">Nom d'utilisateur</label>
            <div class="pseudo_input">
                <i class="fas fa-user"></i><input type="text" id="pseudo" name="name">
            </div>
            
            @if(isset($err) && $err['name'][0])
                <x-SmallComponent value="{{ $err['name'][0] }}" />
            @endif
        </div>
        <div class="pwd">
            <label for="password">Mot de passe</label>
            <div class="password_input">
                <i class="fas fa-lock"></i><input type="password" id="password" name="password">
            </div>
            
            @if(isset($err) && $err['password'][0])
                <x-SmallComponent value="{{ $err['password'][0] }}" />
            @endif
        </div>
        <div class="remember-me">
            <input type="checkbox" name="remember"><span>Se souvenir de moi</span>
        </div>
        <button type="submit" class="add-button">Se connecter</button>
    </form>
</div>
@endsection()