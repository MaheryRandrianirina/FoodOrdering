<nav>
    <div class="profile">
        <input type="hidden" class="user-id" value="{{ Auth::user()->id }}">
        @if($profilePhoto !== null)
        <img src="{{ Storage::url($profilePhoto->file) }}" class="profile-photo" alt="profile photo">
        @else
        <div class="profile-photo empty">
            <i class="fas fa-user-plus photo"></i>
        </div>
        @endif
        <div class="name">{{ Auth::user()->name }}</div>
    </div>
</nav>