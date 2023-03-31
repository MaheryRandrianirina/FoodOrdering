<td>{{ $userCommand['recipe1']->name }}</td>
<td class="command_quantity">{{ $userCommand['command1']->quantity }}</td>
<td>
    @include('partials.admin.delivered')
</td>
<td class="command_date">{{ $userCommand['command1']->created_at }}</td>