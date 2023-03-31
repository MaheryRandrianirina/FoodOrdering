<?php

namespace App\Http\Controllers;

use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class AppController extends Controller
{    
    
    public function renderHomeView()
    {
        $bagages = $this->bagageToUserInterface();
        
        if($this->connectedUserIsAdmin()){
            return view(RouteServiceProvider::DASHBOARD, $bagages);
        }
        return view('home', $bagages);
    }

    private function connectedUserIsAdmin(): bool
    {
        return Auth::user() && Auth::user()->is_admin === 1;
    }

    public function renderPaymentForm(Request $request)
    {
        $recipe_id = (int)$request->id;
        return view('payment.form', compact('recipe_id'));
    }

    public function UserNav()
    {
        return view('partials.user-status');
    }

    public function redirectToAdminDashboardOrHome()
    {
        if(Gate::allows('admin')){
            return redirect()->intended('/admin/dashboard');
        }else{
            return redirect('/');
        }
    }
}
