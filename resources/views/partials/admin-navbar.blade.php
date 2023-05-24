<div class="container">
    <nav class="navbar navbar-expand-md bg-light fixed-top">
        <div class="container-fluid">
            <a href='/' class="logo navbar-brand">Benkyo</a>
            <div class="profile nav-item">
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
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" data-bs-target="#navbarSupportedContent">
                <span class="navbar-toggler-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6">
                        </line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    @include('partials.logout')
                </ul>
                <form action="{{ route('recipe.search')}}" method="post" class="d-flex" role="search">
                    @csrf
                    <input class="form-control me-2 search_input" id="search_input" type="search" name="q" placeholder="recherche..." autocomplete="off">
                    <button class="btn btn-outline-success" type="submit"><i class="fas fa-search loupe"></i></button>
                </form>
            </div>
        </div>
    </nav>
</div>