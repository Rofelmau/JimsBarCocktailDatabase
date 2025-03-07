document.addEventListener('DOMContentLoaded', () => {
    fetch('data/cocktails.json')
        .then(response => response.json())
        .then(data => {
            displayCocktails(data.cocktails, data.ingredients);
        })
        .catch(error => console.error('Error loading cocktails:', error));
});

function displayCocktails(cocktails, ingredients) {
    const main = document.querySelector('main');
    const cocktailSection = document.createElement('section');
    cocktailSection.innerHTML = '<h2>Cocktails</h2>';
    cocktails.forEach(cocktail => {
        const cocktailDiv = document.createElement('div');
        const ingredientList = cocktail.ingredients.map(ing => {
            const ingredient = ingredients.find(i => i.id === ing.ingredientId);
            return `${ing.quantity} ${ing.unit} ${ingredient.name}`;
        }).join(', ');
        cocktailDiv.innerHTML = `
            <h3>${cocktail.name}</h3>
            <p>Ingredients: ${ingredientList}</p>
            <p>Instructions: ${cocktail.instructions}</p>
        `;
        cocktailSection.appendChild(cocktailDiv);
    });
    main.appendChild(cocktailSection);
}