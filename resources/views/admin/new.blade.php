
<i class="fas fa-window-close close-btn"></i>
<form action="{{ route('admin.create')}}" method="POST" enctype="multipart/form-data">
    @csrf
    <x-InputComponent type='text' name='name' label="Nom d'utilisateur" />  
    <x-InputComponent type='password' name='password' label='Mot de passe' />
    <x-InputComponent type='password' name='password_confirmation' label='Confirmer le mot de passe' />
    <x-InputComponent type='email' name='email' label='Adresse email' />
    <x-InputComponent type='file' name='image' label='Photo de profil' />
    <button type="submit" class='button modal-add'>Créer l'administrateur</button>
</form>
