<?php

namespace App\View\Components;

use Illuminate\View\Component;

class TextareaComponent extends Component
{
    public $name;

    public $label;

    public $error;

    public $value;
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(string $name, string $label, ?string $error = null, ?string $value = null)
    {
        $this->name = $name;
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
        return view('components.textarea-component');
    }
}
