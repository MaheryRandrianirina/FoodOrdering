<?php

namespace App\Http\Controllers;

use App\Actions\indispensableForAdminInterfaceTrait;
use App\Models\Recipe;
use App\Models\User;
use App\Models\UserRecipes;
use Illuminate\Http\Request;


class AdminController extends Controller
{

    use indispensableForAdminInterfaceTrait;

    private $userCommands = [];

    private $commanders = [];

    public function renderAdminDashboardView()
    {
        $bagages = $this->bagageToUserInterface();
        return view('admin.dashboard', $bagages);
    }

    public function renderUserCommandsView()
    {
        $indispensables = $this->indispensableForAdminInterface();

        $this->setInstanceVariablesUsersAndUserCommandsValues();
        
        $indispensables['commands'] = $this->userCommands;
        $indispensables['commanders'] = $this->commanders;
        
        return view('admin.commands', $indispensables);
    }

    private function setInstanceVariablesUsersAndUserCommandsValues(): void
    {
        $commands = UserRecipes::all();
        $i = 0;

        foreach($commands as $command){
            $i++;
            // Envoyer à la vue toutes
            $this->commanders[$command->user_id] = User::find($command->user_id);
            $this->userCommands[$command->user_id]['recipe'.$i] = Recipe::find($command->recipe_id);
            $this->userCommands[$command->user_id]['command'.$i] = $command;
        }
    }

    public function createAdmin(Request $request)
    {
        if($request->getMethod('GET')){
            return $this->renderAdminCreationView();
        }
    }

    public function deleteAdmin(Request $request, int $admin_id)
    {
        $admin = User::find($admin_id);
        
        if(!is_null($admin)){
            $admin->delete();
            echo json_encode(['success' => "Administrateur supprimé !"]);
        }else{
            abort(404);
        }
    }

    public function renderAdminListView(Request $request)
    {
        $bagages = $this->bagageToUserInterface();
        $bagages['adminList'] = $this->getEverySimpleAdmins();
        
        return view('admin.list', $bagages);
    }

    private function getEverySimpleAdmins()
    {
        return User::where('is_admin', 1)
            ->where('is_superadmin', 0)->get();
    }

    private function renderAdminCreationView()
    {
        $bagages = $this->bagageToUserInterface();
        return view('admin.new', $bagages);
    }
}
