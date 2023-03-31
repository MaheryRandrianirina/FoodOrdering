<div class="recipe_identity">
    <p class="identity"><i class="fas fa-info-circle"></i>Identité</p>
    <div class="inputs">
        <x-InputComponent type='text' name='name' label='Nom' error="{{ $error['name'][0] ?? '' }}" value="{{ $recipe->name ?? null }}"/>

        <x-InputComponent type='text' name='slug' label='Slug' error="{{ $error['slug'][0] ?? '' }}" value="{{ $recipe->slug ?? null }}"/>

        <x-selectComponent name='category' label='Categorie :' error="{{ $error['category'][0] ?? '' }}">
            @foreach($categories as $category)
            <option value="{{ $category->name }}">{{ $category->name }}</option>
            @endforeach
        </x-selectComponent>

        <x-TextareaComponent name='description' label='Description' error="{{ $error['description'][0] ?? '' }}" value="{{ $recipe->description ?? null }}"/>
    </div>
</div>
<hr>
<div class="recipe_files">
    <p class="files"><i class="fas fa-file-upload"></i>Fichiers</p>
    <div class="inputs">
        <x-InputComponent type='file' name='image1' label='Image 1' error="{{ $error['image1'][0] ?? '' }}"/>

        <x-InputComponent type='file' name='image2' label='Image 2' error="{{ $error['image2'][0] ?? '' }}"/>
    </div>
</div>
<hr>
<div class="recipe_price_and_unity">
    <p class="prices"><i class="fas fa-money-bill"></i>Prix</p>
    <div class="inputs">
        <x-InputComponent type='number' name='price' label='Valeur' error="{{ $error['price'][0] ?? '' }}" value="{{ $recipe->price ?? null }}"/>

        <x-InputComponent type='text' name='unity' label='Unité' error="{{ $error['unity'][0] ?? '' }}" value="{{ $recipe->unity ?? null }}"/>
    </div>
</div>

