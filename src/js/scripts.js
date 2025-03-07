document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContent = document.getElementById('tab-content');

    // Function to load content for a tab
    function loadTabContent(tabName) {
        fetch(`partials/${tabName}.html`)
            .then(response => response.text())
            .then(data => {
                tabContent.innerHTML = data;
                if (tabName === 'calculator') {
                    const script = document.createElement('script');
                    script.src = 'js/calculator.js';
                    document.body.appendChild(script);
                }
            })
            .catch(error => console.error('Error loading tab content:', error));
    }

    // Load initial content
    loadTabContent('calculator');

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