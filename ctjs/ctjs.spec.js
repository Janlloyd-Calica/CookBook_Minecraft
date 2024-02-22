describe('Matcher', function() {
	var ings, table = null;
	beforeEach(function() {
		ings = new Ingredients(mockIngredients);

		table = new Table(ings);
	});

	it('Planify a list of ingredient objects', function() {
		var testInnerObject = [
		    ings.air, ings.air, ings.air,
		    ings.air, ings.air, ings.get('wooden_plank'),
		    ings.air, ings.air, ings.get('wooden_plank')
		];

		var testOuterObject = [
		    ings.get('wooden_plank'), ings.air, ings.air,
		    ings.get('wooden_plank'), ings.air, ings.air,
		    ings.air, ings.air, ings.air
		];

		var planified = table.planify(testInnerObject);
		for(a in planified) {
			expect(planified[a].equals(testOuterObject[a]));
		}
	});

	it('Convert a list of ids into a list of ingredient object', function() {
		var testInnerObject = [
		    0, 0, 0,
		    0, 0, 5,
		    0, 0, 5
		];

		var testOuterObject = [
		    ings.air, ings.air, ings.air,
		    ings.air, ings.air, ings.get('wooden_plank'),
		    ings.air, ings.air, ings.get('wooden_plank')
		];

		expect(table.convertNumericToObjectRecipe(testInnerObject)).toEqual(testOuterObject);
	});

	it('Matches a stick with ingredients in the exact position', function() {
		var testObject = [
		    ings.get('wooden_plank'), ings.air, ings.air,
		    ings.get('wooden_plank'), ings.air, ings.air,
		    ings.air, ings.air, ings.air
		];

		expect(table.match(testObject)).toEqual(ings.get('stick'));
	});

	it('Matches a stick with ingredients in a offseted but still valid position (1)', function() {
		var testObject = [
		    ings.air, ings.get('wooden_plank'), ings.air,
		    ings.air, ings.get('wooden_plank'), ings.air,
		    ings.air, ings.air, ings.air
		];

		expect(table.match(testObject)).toEqual(ings.get('stick'));
	});

	it('Matches a stick with ingredients in a offseted but still valid position (2)', function() {
		var testObject = [
		    ings.air, ings.air, ings.air,
		    ings.get('wooden_plank'), ings.air, ings.air,
		    ings.get('wooden_plank'), ings.air, ings.air
		];

		expect(table.match(testObject)).toEqual(ings.get('stick'));
	});

	it('Do not match a stick with all necessary ingredients but in an invalid position', function() {
		var testObject = [
		    ings.air, ings.get('wooden_plank'), ings.get('wooden_plank'),
		    ings.air, ings.air, ings.air,
		    ings.air, ings.air, ings.air
		];

		expect(table.match(testObject)).toEqual(null);
	});

	it('Create a wooden plank from oak wood', function() {
		var testObject = [
		    ings.air, ings.get('oak_wood'), ings.air,
		    ings.air, ings.air, ings.air,
		    ings.air, ings.air, ings.air
		];

		expect(table.match(testObject)).toEqual(ings.get('wooden_plank'));
	});

		it('Create a cake from wheat, milk, sugar, and egg', function() {
		var testObject = [
		    ings.get('wheat'), ings.get('wheat'), ings.get('wheat'),
		    ings.get('wheat'), ings.get('egg'), ings.get('wheat'),
		    ings.get('sugar'), ings.get('milk_bucket'), ings.get('sugar')
		];

		expect(table.match(testObject)).toEqual(ings.get('cake'));
	});

	it('Create a golden apple from apple and gold ingots', function() {
		var testObject = [
		    ings.air, ings.get('gold_ingot'), ings.air,
		    ings.get('gold_ingot'), ings.get('apple'), ings.get('gold_ingot'),
		    ings.air, ings.get('gold_ingot'), ings.air
		];

		expect(table.match(testObject)).toEqual(ings.get('golden_apple'));
	});

	it('Create a pumpkin pie from pumpkin, egg, and sugar', function() {
		var testObject = [
		    ings.air, ings.get('pumpkin'), ings.air,
		    ings.get('sugar'), ings.get('egg'), ings.get('sugar'),
		    ings.air, ings.air, ings.air
		];

		expect(table.match(testObject)).toEqual(ings.get('pumpkin_pie'));
	});

	it('Create a bookshelf from books and wood planks', function() {
		var testObject = [
		    ings.get('wooden_plank'), ings.get('book'), ings.get('wooden_plank'),
		    ings.get('wooden_plank'), ings.get('book'), ings.get('wooden_plank'),
		    ings.get('wooden_plank'), ings.get('wooden_plank'), ings.get('wooden_plank')
		];

		expect(table.match(testObject)).toEqual(ings.get('bookshelf'));
	});

	it('Create a redstone repeater from redstone, torch, and smooth stone', function() {
		var testObject = [
		    ings.air, ings.get('redstone_torch'), ings.air,
		    ings.air, ings.get('smooth_stone'), ings.air,
		    ings.get('redstone'), ings.get('redstone'), ings.get('redstone')
		];

		expect(table.match(testObject)).toEqual(ings.get('redstone_repeater'));
	});

	it('Create a brewing stand from blaze rods and cobblestone', function() {
		var testObject = [
		    ings.air, ings.get('blaze_rod'), ings.air,
		    ings.get('blaze_rod'), ings.get('cobblestone'), ings.get('blaze_rod'),
		    ings.get('cobblestone'), ings.air, ings.get('cobblestone')
		];

		expect(table.match(testObject)).toEqual(ings.get('brewing_stand'));
	});

	it('Create a compass from redstone and iron ingot', function() {
		var testObject = [
		    ings.air, ings.get('iron_ingot'), ings.air,
		    ings.get('redstone'), ings.get('iron_ingot'), ings.get('redstone'),
		    ings.air, ings.get('iron_ingot'), ings.air
		];

		expect(table.match(testObject)).toEqual(ings.get('compass'));
	});

	it('Create a clock from gold ingot and redstone', function() {
		var testObject = [
		    ings.air, ings.get('gold_ingot'), ings.air,
		    ings.get('redstone'), ings.air, ings.get('redstone'),
		    ings.air, ings.get('gold_ingot'), ings.air
		];

		expect(table.match(testObject)).toEqual(ings.get('clock'));
	});

	it('Create a dispenser from bow, redstone, and cobblestone', function() {
		var testObject = [
		    ings.get('cobblestone'), ings.get('bow'), ings.get('cobblestone'),
		    ings.get('cobblestone'), ings.get('redstone'), ings.get('cobblestone'),
		    ings.get('cobblestone'), ings.get('cobblestone'), ings.get('cobblestone')
		];

		expect(table.match(testObject)).toEqual(ings.get('dispenser'));
	});

	it('Create a minecart from iron ingot', function() {
		var testObject = [
		    ings.air, ings.air, ings.air,
		    ings.get('iron_ingot'), ings.air, ings.get('iron_ingot'),
		    ings.get('iron_ingot'), ings.get('iron_ingot'), ings.get('iron_ingot')
		];

		expect(table.match(testObject)).toEqual(ings.get('minecart'));
	});

	it('Create carrot on a stick from carrot and fishing rod', function() {
		var testObject = [
		    ings.air, ings.get('fishing_rod'), ings.air,
		    ings.get('carrot'), ings.air, ings.air,
		    ings.air, ings.air, ings.air
		];

		expect(table.match(testObject)).toEqual(ings.get('carrot_on_a_stick'));
	});

	it('Create mushroom stew from red mushroom, brown mushroom, and bowl', function() {
		var testObject = [
		    ings.air, ings.get('red_mushroom'), ings.air,
		    ings.get('bowl'), ings.get('brown_mushroom'), ings.get('bowl'),
		    ings.air, ings.air, ings.air
		];

		expect(table.match(testObject)).toEqual(ings.get('mushroom_stew'));
	});

	it('Create bread from wheat', function() {
		var testObject = [
		    ings.air, ings.air, ings.air,
		    ings.get('wheat'), ings.get('wheat'), ings.air,
		    ings.air, ings.air, ings.air
		];

		expect(table.match(testObject)).toEqual(ings.get('bread'));
	});

	it('Create a rabbit stew from cooked rabbit, carrot, baked potato, and mushroom', function() {
		var testObject = [
		    ings.air, ings.get('cooked_rabbit'), ings.get('carrot'),
		    ings.get('baked_potato'), ings.get('mushroom'), ings.air,
		    ings.air, ings.air, ings.air
		];

		expect(table.match(testObject)).toEqual(ings.get('rabbit_stew'));
	});

	it('Create a suspicious stew from red mushroom, brown mushroom, and flower', function() {
		var testObject = [
		    ings.air, ings.get('red_mushroom'), ings.air,
		    ings.get('flower'), ings.get('brown_mushroom'), ings.air,
		    ings.air, ings.air, ings.air
		];

		expect(table.match(testObject)).toEqual(ings.get('suspicious_stew'));
	});
});