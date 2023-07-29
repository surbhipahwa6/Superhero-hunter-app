// Function to play/pause background video on click of the heading
var video = document.getElementById("myVideo");
function playPause() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

// Define a global array to store the search results
let searchResults = [];

// Function to fetch superhero data from the Marvel API
async function fetchSuperheroes(searchQuery) {
    // API keys for Marvel API authentication
    const publicKey = '2895c1bb83aa762d7e46acc8257c57c0';
    const privateKey = '37735379ec7cdeda0b4d59725524163e6e887ac1';
    const ts = new Date().getTime();
    const hash = md5(ts + privateKey + publicKey);

    // Construct the API URL
    const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchQuery}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    try {
        // Fetch data from the API
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Return the superhero data from the API response
        return data.data.results;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Function to display search results (superheroes) as cards
function renderSearchResults(superheroes) {
    const superheroList = document.getElementById('superhero-list');
    superheroList.innerHTML = '';

    let currentRow = document.createElement('div');
    currentRow.classList.add('row');

    superheroes.forEach((superhero, index) => {
        if (index < 15) {
            const card = document.createElement('div');
            card.classList.add('card', 'col-md-2');

            // Create the favorites icon and heart icon
            const favoritesIcon = document.createElement('div');
            favoritesIcon.classList.add('favorites-icon');
            const heartIcon = document.createElement('i');
            heartIcon.classList.add('fas', 'fa-heart');

            // Check if the superhero is already in favorites
            const favorites = JSON.parse(localStorage?.getItem('favorites')) || [];
            const superheroIds = favorites.map(item => item.id);
            if (superheroIds.includes(superhero.id)) {
                heartIcon.classList.add('red-bg');
            }

            // Add click event to the heart icon to add superhero to favorites
            heartIcon.onclick = () => {
                heartIcon.classList.add('red-bg');
                addToFavorites(index, superhero);
            };

            favoritesIcon.appendChild(heartIcon);

            // Create the superhero card image
            const image = document.createElement('img');
            image.src = superhero.thumbnail.path + '.' + superhero.thumbnail.extension;
            image.id = index;
            image.classList.add('card-img-top', 'img-fluid', 'poster-size');
            image.alt = superhero.name;

            // Create the superhero card body with the name
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            const title = document.createElement('h5');
            title.classList.add('card-title');
            title.textContent = superhero.name;
            cardBody.appendChild(title);

            // Append the elements to the superhero card
            card.appendChild(image);
            card.appendChild(cardBody);
            card.appendChild(favoritesIcon);

            // Append the superhero card to the current row
            currentRow.appendChild(card);

            // Add event listeners to the image and card body to navigate to the superhero details page
            image.addEventListener('click', () => {
                window.location.href = `superheroDetails.html?id=${superhero.id}`;
            });
            cardBody.addEventListener('click', () => {
                window.location.href = `superheroDetails.html?id=${superhero.id}`;
            });
        }
    });

    // Add the row to the container if it has at least 1 search result
    if (currentRow.children.length > 0) {
        superheroList.appendChild(currentRow);
    }
}

// Function to add or remove superhero from favorites
function addToFavorites(index, superhero) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const superheroIds = favorites.map(item => item.id);

    // Check if the superhero is already in favorites
    if (!superheroIds.includes(superhero.id)) {
        // Add superhero to favorites and update localStorage
        favorites.push(superhero);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${superhero.name} added to favorites!`);
    } else {
        alert(`${superhero.name} is already in favorites.`);
    }
}

// Function to handle the search query
async function handleSearch(event) {
    const searchQuery = event.target.value.trim();
    const messageElement = document.getElementById('search-result-message');

    if (searchQuery === '') {
        // Clear search results and message if search query is empty
        searchResults = [];
        messageElement.textContent = 'Search your favourite superheroes';
        return;
    }

    // Fetch superheroes based on the search query
    searchResults = await fetchSuperheroes(searchQuery);
    renderSearchResults(searchResults);

    if (searchResults.length === 0) {
        messageElement.textContent = 'No results found';
    } else {
        messageElement.textContent = '';
    }
}

// Event listener for the search input
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', handleSearch);
