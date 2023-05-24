<header>
    <div class="navigation">
        <h1><a href='/' class="logo">LG</a></h1>
        <div class="search">
            <form action="{{ route('recipe.search')}}" method="post">
                @csrf
                <input type="search" placeholder="recherche..." name="q" class="search-input" autocomplete="off">
                <button type="submit"><i class="fas fa-search loupe"></i></button>
            </form>
        </div>
        <nav>
        @if(Auth::user() !== null)
            <a class="basket" href='/user/wishes'>
                <i class='fas fa-shopping-basket'></i>
            </a>
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
        @else
            <div class="login">
                <div class="mobile_login">
                   <a href="{{ route('login')}}">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mobile_login_icon">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                   </a>
                   
                </div>
                <a href="{{ route('login')}}" class="button add login-button">
                    Connexion
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="login-icon-inside-button">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                </a>
            </div>
        @endif
        </nav>
    </div> 
</header>