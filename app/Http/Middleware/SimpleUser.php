<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;

class SimpleUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if(!is_null(auth()->user()) && auth()->user()->is_admin === 0) {
            return $next($request);
        }elseif(auth()->user() && auth()->user()->is_admin === 1) {
            return redirect(RouteServiceProvider::DASHBOARD);
        }else {
            abort(301);
        }
        
    }
}
