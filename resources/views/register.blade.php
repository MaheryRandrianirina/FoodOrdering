@extends('layouts.not-logged')

@section('content')
<div class="form-register-container">
    @if($errors->any())
    <?php $err = $errors->messages() ?>
    @endif
    <form action="{{ route('register') }}" method="POST" class="register">
        @csrf
        <div class="pseudo">
            <label for="pseudo">Pseudo</label>
            <input type="text" id="pseudo" name="name" required>
            @if(isset($err) && isset($err['name'][0]))
                <x-SmallComponent value="{{ $err['name'][0] }}" />
            @endif
        </div>

        <div class="email">
            <label for="email">Adresse mail</label>
            <input type="email" id="email" name="email" required>
            @if(isset($err) && isset($err['email'][0]))
                <x-SmallComponent value="{{ $err['email'][0] }}" />
            @endif
        </div>

        <div class="pwd">
            <label for="password">Mot de passe</label>
            <input type="password" id="password" name="password" required>
            @if(isset($err) && isset($err['password'][0]))
                <x-SmallComponent value="{{ $err['password'][0] }}" />
            @endif
        </div>

        <div class="pwd-confirmation">
            <label for="password-confirmation">Confirmation de mot de passe</label>
            <input type="password" id="password-confirmation" name="password_confirmation" required>
        </div>

        <div class="already-registered">
            Vous avez déjà un compte ?
            <a href="{{ route('login') }}">se connecter</a>
        </div>
        <button type="submit" class="add-button">Enregistrer</button>
    </form>
</div>
@endsection()