<?php

namespace App\Http\Controllers;

use App\Models\Recipe_user;
use Illuminate\Http\Request;

class CommandController extends Controller
{
    public function delivered(Request $request, int $id)
    {
        $command = Recipe_user::find($id);
        
        if($command->update([
            'delivered' => $request->delivered
        ])) {
            echo 'success';
        }else {
            echo "fail";
        }
    }
}
