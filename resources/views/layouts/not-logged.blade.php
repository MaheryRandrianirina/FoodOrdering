<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title></title>

        <!-- Fonts -->
        <link rel="stylesheet" href="{{ asset('css/app.css') }}">
        <link rel="stylesheet" href="{{ asset('css/all.min.css') }}">
        <link rel="stylesheet" href="{{ asset('css/bootstrap.min.css') }}">
        <!-- Scripts -->
        <script src="{{ asset('js/jquery-3.6.0.min.js') }}" defer></script>
        <script src="{{ asset('js/owl.carousel.min.js') }}" defer></script>
        <script src="{{ asset('js/app.js') }}" defer></script>
    </head>
    <body>
        <div>
            @include('partials.not-logged')
            <main>
                @yield('content')
            </main>
        </div>
    </body>
</html>
