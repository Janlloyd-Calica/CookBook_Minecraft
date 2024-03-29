var ctjs = {};
var ings = null;
var table = null;
var airElement = null;
ctjs.init = function() {
    $.ajax({
        url: 'src/ingredients.json',
        success: function(data) {
            ings = new Ingredients(data);
            table = new Table(ings);

            ctjs.craftingTable.init();
            ctjs.inventory.init();
            ctjs.itemList.init();

            airElement = ctjs.ingredient.element(ings.get('air'));
        }
    });
}

ctjs.craftingTable = {
    grid: [],
    outputGridElm: null,
    clear: function() {
        var grid = ctjs.craftingTable.grid;
        for(i in grid) {
            var gridElm = grid[i];
            if(gridElm) {
                gridElm.detachIngredient();
            }
        }
    },
    clearOutput: function() {
        ctjs.craftingTable.outputGridElm.detachIngredient();
    },
    getIngredients: function() {
        var outIngs = [];
        var gridElms = ctjs.craftingTable.grid;
        for(i in gridElms) {
            outIngs.push(gridElms[i].getIngredient());
        }

        return outIngs;
    },
    init: function() {
        var craftingTable = document.querySelector('#crafting-table');
        var craftingTableOutput = document.querySelector('#crafting-table-output');

        // Create grid elements of the crafting table
        for(var i=0; i<9; i++) {
            var gridElm = new ctjs.grid.element(true);
            craftingTable.appendChild(gridElm);
            ctjs.craftingTable.grid.push(gridElm);
        }

        // Create output grid
        var outputElm = new ctjs.grid.element(false, true);
        craftingTableOutput.appendChild(outputElm);
        ctjs.craftingTable.outputGridElm = outputElm;
    },
    getIngredientAt: function(index) {
        var ingredient = null;
        if(typeof ctjs.craftingTable.grid[index] !== 'undefined') {
            ingredient = ctjs.craftingTable.grid[index].getIngredient();
        }
        return ingredient;
    },
    change: function() {
        // Clean up the output grid element
        ctjs.craftingTable.clearOutput();
        

        // Check if there's any match
        var outputIngredient = table.match(ctjs.craftingTable.getIngredients());
        if(outputIngredient) {
            var outputElement = ctjs.ingredient.element(outputIngredient);
            ctjs.craftingTable.outputGridElm.attachIngredient(outputElement);
        }
    }
}

ctjs.inventory = {
    initialIngredients: [
        'stone',
        'grass',
        'cobblestone',
        'wooden_plank',
        'sapling',
        'bedrock',
        'water',
        'stationary_water',
        'lava',
    ],
    grid: [],
    init: function(numGrid) {
        var inventory = document.querySelector('#inventory');
        var numGrid = numGrid || 60;

        for(var i=0; i<numGrid; i++) {
            var gridElm = new ctjs.grid.element();
            inventory.appendChild(gridElm);
            ctjs.inventory.grid.push(gridElm);
        }

        ctjs.inventory.attachInitialIngredients();
    },
    attachInitialIngredients: function() {
        var initialIngredients = ctjs.inventory.initialIngredients;
        for(i in initialIngredients) {
            var ingredient = ings.get(initialIngredients[i]);
            var ingredientToAttach = new ctjs.ingredient.element(ingredient);

            // Attach
            ctjs.inventory.grid[i].attachIngredient(ingredientToAttach);
        }
    }
}

ctjs.itemList = {
    lastSearch: '',
    grid: [],
    init: function(numGrid) {
        ctjs.itemList.attachIngredients();
        ctjs.itemList.initSearchForm();
    },
    attachIngredients: function() {
        var itemList = document.querySelector('#item-list');
        var ingredientList = ings.getList();
        for(var i in ingredientList) {
            var ingredient = ingredientList[i];

            if(ingredient.name === 'air') {
                continue;
            }

            var gridElm = new ctjs.grid.element();
            itemList.appendChild(gridElm);
            ctjs.itemList.grid.push(gridElm);

            gridElm.attachIngredient(new ctjs.ingredient.element(ingredient));
        }
    },
    initSearchForm: function() {
        var searchForm = document.querySelector('#item-search-form');
        searchForm.onsubmit = function(e) { e.preventDefault() };

        var inputSearch = document.querySelector('#item-search-input');
        inputSearch.onkeyup = function(e) {
            ctjs.itemList.performSearch(inputSearch.value);
        }
    },
    /**
     * Performance here really sucks.
     * I need to revisit it to remove this O(n) complexity
     */
    performSearch: function(subject) {
        if(subject === ctjs.itemList.lastSearch) {
            return;
        }
        ctjs.itemList.lastSearch = subject;

        var grid = ctjs.itemList.grid;
        for(var i in grid) {
            var gridElm = grid[i];
            gridElm.show();

            var fullName = gridElm.getIngredient().full_name;
            var searchResult = fullName.toLowerCase().indexOf(subject);
            if(searchResult === -1) {
                gridElm.hide();
            }
        }
    }
}

ctjs.grid = {
    element: function(craftingWorkspace, output) {
        var grid = document.createElement('span');
        var hasIngredient = false;
        var ingredientElm = null;
        var craftingWorkspace = craftingWorkspace || false;

        grid.isGrid = true;
        grid.className = 'grid' + (output ? '-large output' : '');
        if(craftingWorkspace) {
            grid.className += ' grid-crafting';
        }

        grid.attachIngredient = function(ingredientToAttach) {
            hasIngredient = true;
            ingredientElm = ingredientToAttach;
            var changedCraftingWorkspace = false;

            // Detach from the original grid
            var sourceGrid = ingredientToAttach.getGrid();
            if(sourceGrid !== null) {
                sourceGrid.detachIngredient();

                if($(sourceGrid).hasClass('grid-crafting')) {
                    ctjs.craftingTable.change();
                }

                // If we are detaching from the output, clear the crafting table workspace
                if($(sourceGrid).hasClass('output')) {
                    ctjs.craftingTable.clear(null);
                }
            }

            // Attach the ingredient to myself
            grid.appendChild(ingredientToAttach);
            ctjs.drag.resetElementPosition(ingredientToAttach);

            // Notify crafting table that it was changed.            
            if($(grid).hasClass('grid-crafting')) {
                ctjs.craftingTable.change();
            }
        }
        grid.detachIngredient = function(isReattaching) {
            if (hasIngredient) {
                hasIngredient = false;
                // Create a new ingredient element and attach it to the grid
                var newIngredient = ctjs.ingredient.element(ingredientElm.ingredient);
                this.appendChild(newIngredient);
                ctjs.drag.resetElementPosition(newIngredient);
            }
        }
        grid.getIngredient = function() {
            var ing = ings.air;
            if(ingredientElm !== null) {
                ing = ingredientElm.ingredient;
            }

            return ing;
        }
        grid.hasIngredient = function() {
            return hasIngredient;
        }
        grid.show = function() {
            this.style.display = '';
        }
        grid.hide = function() {
            this.style.display = 'none';
        }


        return grid;
    }
}

ctjs.ingredient = {
    element: function(ingredient) {
        var elm = document.createElement('img');
        elm.ingredient = ingredient;
        elm.className = 'ingredient';
        elm.src = elm.ingredient.image;
        elm.width = elm.height = 32;
        elm.title = elm.ingredient.full_name;

        elm.getGrid = function() {
            var grid = elm.parentNode;
            if(grid !== null && typeof grid.isGrid == 'boolean') {
                return grid;
            } else {
                return null;
            }
        }

        // Make this element draggable
        ctjs.drag.bind(elm);

        return elm;
    }
}

ctjs.drag = {
    config: {
        containment: '.crafting-holder'
    },
    bind: function(elem) {
        var draggie = new Draggabilly(elem, ctjs.drag.config);
        draggie.on('dragEnd', ctjs.drag.onDragEnd);
    },
    onDragEnd: function(instance, event, pointer) {
        instance.element.style.display = 'none';
        var pointedElement = document.elementFromPoint(event.x, event.y);
        instance.element.style.display = '';
        ctjs.drag.ingredientToGrid(instance.element, pointedElement);
    },
    moveIngredient: function(element, left, top) {
        element.style.left = left;
        element.style.top = top;
    },
    ingredientToGrid: function(sourceElement, destElement) {
        var drg = ctjs.drag;
        if(!!destElement.isGrid) {
            if(destElement.hasIngredient()) {
                drg.resetElementPosition(sourceElement);
            } else {
                destElement.attachIngredient(sourceElement);
            }
        } else {
            drg.resetElementPosition(sourceElement);
        }
    },
    resetElementPosition: function(element) {
        ctjs.drag.moveIngredient(element, 0, 0);
    }
};