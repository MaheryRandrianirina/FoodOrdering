<div class="form-group">
    <label for="{{ $name }}">{{ $label }}</label>
    <textarea name="{{ $name }}" id="{{ $name }}" class="form-control">{{ $value }}</textarea>
    @if($error !== '')
        <x-SmallComponent value="{{ $error }}" />
    @endif
</div>