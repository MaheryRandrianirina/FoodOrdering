@extends('layouts.admin')

@section('content')
<div class="container commands_container">
    <button class="button add go-to">
        <a href="{{ route('app.admin.dashboard') }}">Dashboard</a>
    </button>
    <table class="admin-table commands">
        <thead>
            <tr class="tab-head">
                <td class="head_user">Utilisateur</td>
                <td>Plat</td>
                <td>Quantité</td>
                <td>Livré</td>
                <td class="head_commands_dates">Date</td>
            </tr>
        </thead>
        <tbody>
            @if(!empty($commanders))
                @foreach($commanders as $commander)
                    <tr>
                        <td class="user">
                            @if($commander->image->file)
                            <img src="{{ Storage::url($commander->image->file) }}" class="profile-photo" alt="profile photo">
                            @else
                            <i class="fas fa-user-circle photo"></i>
                            @endif
                            {{ $commander->name }}
                        </td>
                        <?php $userCommand = $commands[$commander->id]; ?>
                        
                        @csrf
                        
                        @if(count($userCommand) > 2)
                            @include('partials.admin.column-is-shown-by-selected-date')
                            <td class="commands_dates">
                                <select>
                                @for($i = 0; $i < count($userCommand) / 2; $i++)  
                                    <?php $selected = $i+1 === 1 ? 'selected' : ''?>  
                                    <option {{ $selected }} value="{{ $userCommand['command'. $i+1]->id }}">{{ $userCommand['command'. $i+1]->created_at }}</option>
                                @endfor
                                </select>
                            </td>
                        @else
                            @include('partials.admin.usercommand')
                        @endif
                    </tr>
                @endforeach
            @else
                <p class="alert_empty_commands">Il n'y pas encore aucune commande.</p>
            @endif
        </tbody>
    </table>
</div>
@endsection