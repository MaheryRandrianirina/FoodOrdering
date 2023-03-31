<?php

namespace App\View\Components;

use Illuminate\View\Component;

class InputComponent extends Component
{
    public $name;

    public $type;

    public $label;

    public $error;

    public $value;
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(string $name, string $type, ?string $label = null, ?string $error = null, ?string $value = null)
    {
        $this->name = $name;
        $this->type = $type;
        $this->label = $label;
        $this->error = $error;
        $this->value = $value;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.input-component');
    }
}
