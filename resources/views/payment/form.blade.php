@extends('layouts.payment')

@section('content')
<div class="payment_errors">

</div>
<form action="{{ route('payment.process') }}" method="post" class="form">
    @csrf
    <x-InputComponent name='recipe_id' type='hidden' value="{{ $recipe_id }}"/>
    <x-InputComponent name='quantity' label='Quantité' type='number' />
    <x-InputComponent name='lot' label='Lot' type='text'/>
    <x-InputComponent name='city' label='Ville' type='text'/>
    <x-InputComponent name='payment_method' id="payment_method" type='hidden' value='{{ $recipe->id ?? null  }}' />
    <div id="card-element"></div>
    <button class="button add payment-submit">Effectuer  <i class="fas fa-check"></i></button>
</form>
@section('extra-js')
<script src="https://js.stripe.com/v3"></script>
<script>
    const stripe = Stripe("{{ env('STRIPE_KEY') }}")

    const elements = stripe.elements()
    const cardElement = elements.create('card', {
        classes : {
            base: 'StripeElement'
        }
    })

    cardElement.mount('#card-element')

    let button = document.querySelector('.payment-submit')
    button.addEventListener('click', async(e)=>{
        e.preventDefault()

        const {paymentMethod, error} = await stripe.createPaymentMethod('card', cardElement)

        if(error){
            //const errorMessage = `<p>${error.}</p>`
            //document.querySelector('.payment_errors').innerHTML = errorMessage
        }else {
            document.querySelector('#payment_method').value = paymentMethod.id
            
            document.querySelector('.form').submit()
        }

    })
</script>
@endsection
@endsection