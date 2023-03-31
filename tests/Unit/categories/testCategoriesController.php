<?php

namespace Tests\Unit\Categories;

use App\Http\Controllers\CategoriesController;
use App\Models\Recipe;
use PHPUnit\Framework\TestCase;

class testCategoriesController extends TestCase {

    /**
     * @var CategoriesController
     */
    private $categoriesController;

    protected function setUp(): void
    {
        $this->categoriesController = new CategoriesController();
        
    }

    public function testShowRecipesWhichCorrespondsTo()
    {
        $this->categoriesController->showRecipesWhichCorrespondsTo('mahery', 1);
        $this->getMockBuilder(Recipe::class)->getMock();
    }
}