// Function to display favorite superheroes on the favorites page
function displayFavorites() {
    // Get the favorite superheroes from local storage, or initialize an empty array if no favorites are present
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Get the element where the favorites list will be displayed
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = ''; // Clear the existing content in case of refresh or update

    // Loop through each favorite superhero and create a card for them
    for (let i = 0; i < favorites.length; i++) {
        const superhero = favorites[i];

        // Create the card element for the superhero
        const card = document.createElement('div');
        card.classList.add('card', 'col-md-2');

        // Create the favorites icon (trash can) and add a click event to remove the superhero from favorites
        const favoritesIcon = document.createElement('div');
        favoritesIcon.classList.add('favorites-icon');
        const removeIcon = document.createElement('i');
        removeIcon.classList.add('fa-solid', 'fa-trash-can');
        removeIcon.onclick = () => removeFromFavorites(superhero); // Call the function to remove superhero from favorites
        favoritesIcon.appendChild(removeIcon);

        // Create the image element for the superhero's thumbnail
        const image = document.createElement('img');
        image.src = superhero.thumbnail.path + '.' + superhero.thumbnail.extension;
        image.id = superhero.id;
        image.classList.add('card-img-top', 'img-fluid', 'poster-size');
        image.alt = superhero.name;

        // Create the card body to hold the superhero's name
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Create the title element for the superhero's name
        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = superhero.name;

        // Append the superhero's name to the card body, and the thumbnail and favorites icon to the card
        cardBody.appendChild(title);
        card.appendChild(image);
        card.appendChild(cardBody);
        card.appendChild(favoritesIcon);

        // Append the card to the favorites list container
        favoritesList.appendChild(card);
    }
}

// Function to remove superhero from favorites
function removeFromFavorites(superhero) {
    // Get the current favorites from local storage, or initialize an empty array if no favorites are present
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Filter out the superhero with the specified ID to remove them from the favorites
    const updatedFavorites = favorites.filter((item) => item.id !== superhero.id);

    // Save the updated favorites back to local storage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    // Refresh the display of favorite superheroes on the page
    displayFavorites();
}

// Display favorite superheroes on page load
displayFavorites();
