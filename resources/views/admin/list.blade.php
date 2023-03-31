@extends('layouts.admin')

@section('content')
<div class="container">
    @if(session()->get('success'))
    <p class="admin_creation_success">{{ session()->get('success') }}</p>
    @endif
    @if($errors->any())
    <p class="admin_creation_fail">Echec de la création d'administrateur</p>
    @endif
    <div class="admin-actions-bar">
        <div class="infos_for_actions_menu">
            <p class="create_admin">Créer un administrateur</p>
        </div>
    </div> 
    @if($adminList->isEmpty() === false)
    <table class="admin-table admin_list">
        <thead>
            <tr class="tab-head">
                <td>Pseudo</td>
                <td>Email</td>
                <td></td>
            </tr>
        </thead>
        <tbody>
            @foreach($adminList as $admin)
            <tr>
                <td>
                    @if($admin->image)
                    <img src="{{ Storage::url($admin->image->file) }}" class="profile-photo" alt="profile photo">
                    @else
                    <i class="fas fa-user-circle photo"></i>
                    @endif
                    {{ $admin->name }}
                </td>
                <td>{{ $admin->email }}</td>
                <td>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    <input type="hidden" value="{{ $admin->id }}" name="admin_id" class="admin_id">
                    @csrf
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div class="empty_simple_admins">
        <p class="message">Aucun administrateur simple pour le moment.</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    </div>
    
    @endif
</div>
@endsection()