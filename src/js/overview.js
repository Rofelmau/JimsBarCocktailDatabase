if (!window.overviewInitialized) {
    window.overviewInitialized = true;

    let cocktailsData = [];
    let ingredientData = [];

    function loadCocktails() {
        fetch('data/cocktails.json')
            .then(response => response.json())
            .then(data => {
                cocktailsData = data.cocktails;
                ingredientData = data.ingredients;
                cocktailsData.sort((a, b) => a.name.localeCompare(b.name));
                displayCocktails(cocktailsData);
            })
            .catch(error => console.error('Error loading cocktails:', error));
    }

    function displayCocktails(cocktails) {
        const grid = document.getElementById('cocktail-grid');
        grid.innerHTML = '';
        cocktails.forEach(cocktail => {
            const cocktailDiv = document.createElement('div');
            cocktailDiv.classList.add('cocktail-item');
            const ingredientsList = cocktail.ingredients.map(ingredient => `<li>${ingredientData.find(i => i.id === ingredient.ingredientId).name}</li>`).join('');
            cocktailDiv.innerHTML = `
                <h3>${cocktail.name}</h3>
                <p>Zutaten:</p>
                <ul>${ingredientsList}</ul>
            `;
            grid.appendChild(cocktailDiv);
        });
    }

    function filterCocktails() {
        const searchField = document.getElementById('search-field').value.toLowerCase();
        const filteredCocktails = cocktailsData.filter(cocktail => {
            const matchesSearch = cocktail.name.toLowerCase().includes(searchField);
            return matchesSearch;
        });
        displayCocktails(filteredCocktails);
    }

    document.getElementById('search-field').addEventListener('input', filterCocktails);

    loadCocktails();
}