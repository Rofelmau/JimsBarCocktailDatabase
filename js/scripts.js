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

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContent = document.getElementById('tab-content');

    // Function to load content for a tab
    function loadTabContent(tabName) {
        fetch(`partials/${tabName}.html`)
            .then(response => response.text())
            .then(data => {
                tabContent.innerHTML = data;
                const script = document.createElement('script');
                if (tabName === 'calculator') {
                    script.src = 'js/calculator.js';
                } else if (tabName === 'overview') {
                    script.src = 'js/overview.js';
                } else if (tabName === 'by-ingredients') {
                    script.src = 'js/by-ingredients.js';
                }
                if (!document.body.contains(script)) {
                    document.body.appendChild(script);
                }
            })
            .catch(error => console.error('Error loading tab content:', error));
    }

    // Load initial content
    loadTabContent('overview');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.getAttribute('data-tab');
            loadTabContent(target);
        });
    });
});

function displayCocktails(cocktails, ingredients) {
    const overviewSection = document.querySelector('#overview');
    overviewSection.innerHTML = '<h2>Cocktails</h2>';
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
        overviewSection.appendChild(cocktailDiv);
    });
}