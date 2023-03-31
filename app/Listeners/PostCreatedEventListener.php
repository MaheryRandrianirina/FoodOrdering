<?php

namespace App\Listeners;

use App\Events\PostCreatedEvent;

class PostCreatedEventListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\PostCreatedEvent  $event
     * @return void
     */
    public function handle(PostCreatedEvent $event)
    {
        dd($event->post['title'] . " vient d'être crée !");
    }
}
