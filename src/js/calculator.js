function populateCocktailDropdown() {
    const selects = document.querySelectorAll('.cocktail-select');
    selects.forEach(select => {
        cocktailsData.sort((a, b) => a.name.localeCompare(b.name));
        cocktailsData.forEach(cocktail => {
            const option = document.createElement('option');
            option.value = cocktail.name;
            option.textContent = cocktail.name;
            select.appendChild(option);
        });
    });

    updateShoppingList(); // Initial call to update the shopping list
}

function createNewRow() {
    const table = document.getElementById('cocktail-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.rows.length - 1); // Insert before the last row (add-row)
    const newCell1 = newRow.insertCell(0);
    const newCell2 = newRow.insertCell(1);
    const newCell3 = newRow.insertCell(2);

    const newSelect = document.createElement('select');
    newSelect.classList.add('cocktail-select');
    newSelect.addEventListener('change', updateShoppingList);
    newCell1.appendChild(newSelect);

    const newInput = document.createElement('input');
    newInput.type = 'number';
    newInput.classList.add('cocktail-quantity');
    newInput.min = '0';
    newInput.max = '999';
    newInput.value = '0';
    newInput.addEventListener('input', updateShoppingList);
    newCell2.appendChild(newInput);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-row-button');
    deleteButton.innerHTML = '<i class="fas fa-minus"></i>';
    deleteButton.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        row.parentNode.removeChild(row);
        updateShoppingList();
    });
    newCell3.style.textAlign = 'right';
    newCell3.appendChild(deleteButton);

    populateCocktailDropdown();
}

document.querySelectorAll('.delete-row-button').forEach(button => {
    button.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        row.parentNode.removeChild(row);
        updateShoppingList();
    });
});

function updateShoppingList() {
    const table = document.getElementById('cocktail-table').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    const shoppingList = new Map();

    for (let i = 0; i < rows.length - 1; i++) { // Exclude the last row (add-row)
        const select = rows[i].querySelector('.cocktail-select');
        const quantityInput = rows[i].querySelector('.cocktail-quantity');
        const cocktailName = select.value;
        const quantity = parseInt(quantityInput.value, 10);

        if (cocktailName && quantity > 0) {
            const cocktail = cocktailsData.find(c => c.name === cocktailName);
            if (cocktail) {
                cocktail.ingredients.forEach(ingredient => {
                    const ingredientId = ingredient.ingredientId;
                    const totalQuantity = ingredient.quantity * quantity;
                    if (shoppingList.has(ingredientId)) {
                        shoppingList.set(ingredientId, shoppingList.get(ingredientId) + totalQuantity);
                    } else {
                        shoppingList.set(ingredientId, totalQuantity);
                    }
                });
            }
        }
    }

    const shoppingListElement = document.getElementById('shopping-list-items');
    shoppingListElement.innerHTML = '';
    shoppingList.forEach((quantity, id) => {
        const listItem = document.createElement('li');
        const name = ingredientData[id].name;
        const unit = ingredientData[id].unit;
        listItem.textContent = `${name}: ${quantity} ${unit}`;
        shoppingListElement.appendChild(listItem);
    });

    // Show or hide the shopping list based on whether it has items
    const shoppingListContainer = document.getElementById('shopping-list');
    if (shoppingList.size > 0) {
        shoppingListContainer.classList.add('visible');
    } else {
        shoppingListContainer.classList.remove('visible');
    }
}

// Initial population of the dropdown and shopping list
populateCocktailDropdown();

// Copy to clipboard functionality
document.getElementById('copy-button').addEventListener('click', () => {
    const shoppingListElement = document.getElementById('shopping-list-items');
    const items = shoppingListElement.querySelectorAll('li');
    const textToCopy = Array.from(items).map(item => item.textContent).join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Einkaufsliste kopiert!');
    }).catch(err => {
        console.error('Fehler beim Kopieren der Einkaufsliste:', err);
    });
});

// Export as PDF functionality
document.getElementById('export-pdf-button').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const shoppingListElement = document.getElementById('shopping-list-items');
    const items = shoppingListElement.querySelectorAll('li');
    const textToExport = Array.from(items).map(item => item.textContent).join('\n');
    doc.text(textToExport, 10, 10);
    doc.save('Einkaufsliste.pdf');
});

createNewRow();
document.getElementById('add-row-button').addEventListener('click', () => {
    createNewRow();
});
