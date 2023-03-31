@if($userCommand['command1']->delivered)
    <div class="deliver-status delivered" data-delivered="1">
        <p class="check-btn"></p>
    </div>
    @else
    <div class="deliver-status not-delivered" data-delivered="0">
        <p class="check-btn"></p>
    </div>
@endif