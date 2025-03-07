const fs = require('fs');

function loadJSON(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

function checkForDuplicateIngredients(data) {
    const ingredientNames = data.ingredients.map(ingredient => ingredient.name.toLowerCase());
    const uniqueNames = new Set(ingredientNames);
    if (ingredientNames.length !== uniqueNames.size) {
        const duplicates = ingredientNames.filter((item, index) => ingredientNames.indexOf(item) !== index);
        const duplicateIngredients = [...new Set(duplicates)];
        const affectedCocktails = data.cocktails.filter(cocktail => 
            cocktail.ingredients.some(ing => duplicateIngredients.includes(data.ingredients.find(i => i.id === ing.ingredientId).name.toLowerCase()))
        );
        return { hasDuplicates: true, duplicateIngredients, affectedCocktails };
    }
    return { hasDuplicates: false };
}

function checkForDuplicateIds(data) {
    const ingredientIds = data.ingredients.map(ingredient => ingredient.id);
    const uniqueIds = new Set(ingredientIds);
    return ingredientIds.length !== uniqueIds.size;
}

const data = loadJSON('src/data/cocktails.json');

try {
    if (checkForDuplicateIds(data)) {
        console.error('Duplicate ingredient IDs found.');
        process.exit(1);
    }

    const duplicateCheck = checkForDuplicateIngredients(data);
    if (duplicateCheck.hasDuplicates) {
        console.error('Duplicate ingredients found:', duplicateCheck.duplicateIngredients);
        console.error('Affected cocktails:', duplicateCheck.affectedCocktails.map(cocktail => cocktail.name));
        process.exit(1);
    }

    console.log('No duplicate ingredients or IDs found.');
    process.exit(0);
} catch (error) {
    console.error('Error validating data:', error);
    process.exit(1);
}
