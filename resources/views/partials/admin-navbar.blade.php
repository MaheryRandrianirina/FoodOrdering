<header class="admin-nav">
    <div class="navigation">
        <h1><a href="/" class='logo'>LOGO</a></h1>
        <div class="search">
            <form action="{{ route('recipe.search')}}" method="post">
                @csrf
                <input type="search" placeholder="recherche..." name="q" class="search-input" autocomplete="off">
                <button type="submit"><i class="fas fa-search loupe"></i></button>
            </form>
        </div>
        <nav>
            @include('partials.logout')
            <div class="profile">
                <input type="hidden" class="user-id" value="{{ Auth::user()->id }}">
                @if($profilePhoto !== null)
                <img src="{{ Storage::url($profilePhoto->file) }}" class="profile-photo" alt="profile photo">
                @else
                <div class="profile-photo empty">
                    <i class="fas fa-user-circle photo"></i>
                    <i class="fas fa-plus"></i>
                </div>
                @endif
                <div class="name">{{ Auth::user()->name }}</div>
            </div>
        </nav>
    </div> 
</header>