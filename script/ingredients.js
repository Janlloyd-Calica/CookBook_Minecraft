class Ingredient {
    async getIngredient(type, number) {
        const imgUrl = `http://minecraftdatavalues.com/images/${type}/${number}.png`;
        const url = `http://minecraftdatavalues.com/ajax.php?t=${type}&m=${number}&d=`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const ingredient = {
                id_mc: data.id_mc,
                stackable: parseInt(data.stackable),
                l_name: data.l_name,
                ot_name: data.ot_name,
                id_source_type: parseInt(data.source[0].id_source_type),
                image: imgUrl,
                stackable: parseInt(data.stackable)
            };

            if (data.source[0].recipe) {
                ingredient.recipe = this.createPlanifiedRecipe(data.source[0].recipe);
            }

            return ingredient;
        } catch (error) {
            console.error('Error fetching ingredient:', error);
            return null;
        }
    }

    createPlanifiedRecipe(originalRecipe) {
        const planifiedRecipe = [];
        const recipe = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        if (originalRecipe) {
            // Convert the original recipe into a [3,3] matrix
            originalRecipe.forEach(ingredient => {
                recipe[ingredient.y][ingredient.x] = ingredient.id_mc;
            });

            // Now, we'll planify the recipe
            recipe.forEach(yIngredients => {
                yIngredients.forEach(xIngredients => {
                    planifiedRecipe.push(parseInt(xIngredients));
                });
            });
        }

        return planifiedRecipe;
    }
}

const arTypesToDownload = [
    { type: 1, from: 0, to: 175 },
    { type: 2, from: 256, to: 408 },
    { type: 2, from: 2256, to: 2266 }
];

async function fetchIngredients() {
    const ingredients = [];
    const ingredient = new Ingredient();

    for (const type of arTypesToDownload) {
        for (let i = type.from; i <= type.to; i++) {
            const result = await ingredient.getIngredient(type.type, i);
            ingredients.push(result);
        }
    }

    return ingredients;
}

fetchIngredients().then(ingredients => {
    console.log(JSON.stringify(ingredients));
});
