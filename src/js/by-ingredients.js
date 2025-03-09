setupIngredientSelect();

function setupIngredientSelect() {
    const ingredientSelect = document.getElementById('ingredient-select');

    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'Bitte wählen Sie eine Zutat';
    ingredientSelect.appendChild(emptyOption);

    ingredientData.sort((a, b) => a.name.localeCompare(b.name));
    ingredientData.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient.id;
        option.textContent = ingredient.name;
        ingredientSelect.appendChild(option);
    });

    // Wiederherstellen der ausgewählten Zutat aus localStorage
    const savedIngredientId = localStorage.getItem('selectedIngredientId');
    if (savedIngredientId) {
        ingredientSelect.value = savedIngredientId;
        updateCocktailList();
    }

    ingredientSelect.addEventListener('change', () => {
        // Speichern der ausgewählten Zutat in localStorage
        localStorage.setItem('selectedIngredientId', ingredientSelect.value);
        updateCocktailList();
    });
}

function updateCocktailList() {
    const cocktailListElement = document.getElementById('cocktail-list-items');
    cocktailListElement.innerHTML = '';

    const ingredientSelect = document.getElementById('ingredient-select');
    const selectedIngredientId = parseInt(ingredientSelect.value, 10);

    if (isNaN(selectedIngredientId)) {
        return;
    }

    cocktailsData.forEach(cocktail => {
        const hasSelectedIngredient = cocktail.ingredients.some(ingredient => ingredient.ingredientId === selectedIngredientId);

        if (hasSelectedIngredient) {
            const listItem = document.createElement('li');
            listItem.textContent = cocktail.name;
            cocktailListElement.appendChild(listItem);
        }
    });
}