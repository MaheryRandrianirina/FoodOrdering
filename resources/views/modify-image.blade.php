<i class="fas fa-window-close close-btn"></i>
<form action="{{ route('profile.photo.edit', ['id' => $id])}}" method="POST" enctype="multipart/form-data">
    @csrf 
    <x-InputComponent type='file' name='image' label='Nouvelle photo de profile'/>
    <button type="submit" class='button modal-add'>Ajouter</button>
</form>
