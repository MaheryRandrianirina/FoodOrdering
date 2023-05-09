<?php

namespace App\Http\Controllers;

use App\Events\AdminOrderTableUpdate;
use App\Models\Recipe;
use App\Models\Recipe_user;
use App\Services\StripeService;
use App\Stripe\StripeApi;
use Exception;
use Illuminate\Http\Request;

class PayementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(StripeService $stripeService)
    {
        dd($stripeService->getKey());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        $recipe = Recipe::find($request->recipe_id);
        
        $price = $recipe->price * $request->quantity;

        try{
            Recipe_user::create([
                'user_id' => $user->id,
                'recipe_id' => $request->recipe_id,
                'address' => $request->lot . ' ' . $request->city,
                'quantity' => $request->quantity,
            ]);
            
            $recipe->update([
                'selled' => $request->quantity
            ]);
            
            //AdminOrderTableUpdate::dispatch(['a', 'b']);
            //$user->charge($price, $request->payment_method);
            
            //return redirect('/')->with("success", 'Achat éffectué !');
        }catch(Exception $e){
            throw new Exception("Le payment a échoué à cause d'une erreur : " . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
