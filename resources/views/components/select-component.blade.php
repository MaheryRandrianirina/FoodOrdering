<div class="form-group">
    <label for="category">{{ $label }}</label>
    <select  name="{{ $name }}" id="{{ $name }}" class="form-control">
        {{ $slot }}
    </select>
</div>