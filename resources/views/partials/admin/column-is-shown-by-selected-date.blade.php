@for($i = 0; $i < count($userCommand) / 2; $i++)  
<?php $columnHidden = $i+1 === 1 ? '' : 'hidden'?>
<td class="command_recipe {{ $userCommand['command'. $i+1]->id }}" {{ $columnHidden }}>{{ $userCommand['recipe'. $i+1]->name }}</td>
<td class="command_quantity {{ $userCommand['command'. $i+1]->id }}" {{ $columnHidden }}>{{ $userCommand['command'. $i+1]->quantity }}</td>
<td class="command_delivered {{ $userCommand['command'. $i+1]->id }}" {{ $columnHidden }}>
    @if($userCommand['command'. $i+1]->delivered)
        <div class="deliver-status delivered" data-delivered="1">
            <p class="check-btn"></p>
        </div>
    @else
        <div class="deliver-status not-delivered" data-delivered="0">
            <p class="check-btn"></p>
        </div>
    @endif
</td>
@endfor
