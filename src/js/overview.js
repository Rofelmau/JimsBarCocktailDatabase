if (!window.overviewInitialized) {
    window.overviewInitialized = true;

    let cocktailsData = [];
    let ingredientData = [];
    let selectedCocktails = new Set();

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
            if (selectedCocktails.has(cocktail.name)) {
                cocktailDiv.classList.add('selected');
            }
            const ingredientsList = cocktail.ingredients.map(ingredient => {
                const ingredientDataItem = ingredientData.find(i => i.id === ingredient.ingredientId);
                return `<li>${ingredientDataItem.name}</li>`;
            }).join('');
            cocktailDiv.innerHTML = `
                <h3>${cocktail.name}</h3>
                <p>Zutaten:</p>
                <ul>${ingredientsList}</ul>
            `;
            cocktailDiv.addEventListener('click', () => {
                if (selectedCocktails.has(cocktail.name)) {
                    selectedCocktails.delete(cocktail.name);
                    cocktailDiv.classList.remove('selected');
                } else {
                    selectedCocktails.add(cocktail.name);
                    cocktailDiv.classList.add('selected');
                }
                updateExportButtonState();
            });
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

    function updateExportButtonState() {
        const exportButton = document.getElementById('export-pdf-button');
        exportButton.disabled = selectedCocktails.size === 0;
    }

    function exportSelectedCocktailsToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        const cardWidth = (pageWidth - 4 * margin) / 3;
        const cardHeight = (pageHeight - 3 * margin) / 2;
        let xPosition = margin;
        let yPosition = margin;
        let rowCount = 0;
        let colCount = 0;

        Array.from(selectedCocktails).forEach((cocktailName, index) => {
            const cocktail = cocktailsData.find(c => c.name === cocktailName);
            const ingredientsList = cocktail.ingredients.map(ingredient => {
                const ingredientDataItem = ingredientData.find(i => i.id === ingredient.ingredientId);
                return `${ingredientDataItem.name}: ${ingredient.quantity} ${ingredientDataItem.unit}`;
            });

            doc.setLineWidth(0.5);
            doc.rect(xPosition, yPosition, cardWidth, cardHeight);

            doc.setFontSize(12);
            doc.text(`Cocktail: ${cocktail.name}`, xPosition + 5, yPosition + 10);
            doc.setFontSize(10);
            doc.text('Zutaten:', xPosition + 5, yPosition + 20);
            let ingredientYPosition = yPosition + 30;
            ingredientsList.forEach(ingredient => {
                doc.text(`- ${ingredient}`, xPosition + 5, ingredientYPosition);
            ingredientYPosition += 10;
            });

            colCount++;
            if (colCount === 3) {
                colCount = 0;
                rowCount++;
                xPosition = margin;
                yPosition += cardHeight + margin;
                if (rowCount === 2 && index !== selectedCocktails.size - 1) {
                    doc.addPage('landscape');
                    xPosition = margin;
                    yPosition = margin;
                    rowCount = 0;
                }
            } else {
                xPosition += cardWidth + margin;
            }
        });

        doc.save('Selected_Cocktails.pdf');
    }

    document.getElementById('search-field').addEventListener('input', filterCocktails);
    document.getElementById('export-pdf-button').addEventListener('click', exportSelectedCocktailsToPDF);
}

loadCocktails();
