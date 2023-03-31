<?php

namespace App\View\Components;

use Illuminate\View\Component;

class selectComponent extends Component
{
    public $name;

    public $label;
    
    public $error;
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(string $name, string $label, ?string $error = null)
    {
        $this->name = $name;
        $this->label = $label;
        $this->error = $error;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.select-component');
    }
}
