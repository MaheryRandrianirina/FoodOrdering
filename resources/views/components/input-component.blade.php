<div class="form-group">
    @if($label)
    <label for="{{ $name }}">{{ $label }} : </label>
    @endif
    @if($error === null)
        <input type="{{ $type }}" id="{{ $name }}" name="{{ $name }}" class="form-control" value="{{ $value }}">
    @elseif($error !== null)
        <input type="{{ $type }}" id="{{ $name }}" name="{{ $name }}" class="form-control is_invalid" value="{{ $value }}">
        <x-SmallComponent value="{{ $error }}" />
    @endif
</div>