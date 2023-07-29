// Initialize all tabs and set activeTab to 1
const allTabsBody = document.querySelectorAll('.tab-body-single');
const allTabsHead = document.querySelectorAll('.tab-head-single');
let activeTab = 1;

// Initialize the app
const init = () => {
    showActiveTabBody();
    showActiveTabHead();
}

// Show the active tab in the tabs head
const showActiveTabHead = () => allTabsHead[activeTab - 1].classList.add('active-tab');

// Show the active tab content in the tabs body
const showActiveTabBody = () => {
    hideAllTabBody();
    allTabsBody[activeTab - 1].classList.add('show-tab');
}

// Hide all tabs content in the tabs body
const hideAllTabBody = () => allTabsBody.forEach(singleTabBody => singleTabBody.classList.remove('show-tab'));

// Hide the active tab in the tabs head
const hideAllTabHead = () => allTabsHead.forEach(singleTabHead => singleTabHead.classList.remove('active-tab'));

// Event listeners
// Run the init function when the DOM content is loaded
window.addEventListener('DOMContentLoaded', () => init());

// Add click event listeners to each tab head
allTabsHead.forEach(singleTabHead => {
    singleTabHead.addEventListener('click', () => {
        // Hide all tab heads and bodies
        hideAllTabHead();
        hideAllTabBody();

        // Set the activeTab to the clicked tab's data-id
        activeTab = singleTabHead.dataset.id;

        // Show the active tab head and body
        showActiveTabHead();
        showActiveTabBody();
    });
});

// Function to fetch superhero data from the Marvel API
async function fetchSuperheroDetails(superheroId) {
    // API authentication information
    const publicKey = '2895c1bb83aa762d7e46acc8257c57c0';
    const privateKey = '37735379ec7cdeda0b4d59725524163e6e887ac1';
    const ts = new Date().getTime();
    const hash = md5(ts + privateKey + publicKey);

    // API URL with parameters
    const apiUrl = `https://gateway.marvel.com:443/v1/public/characters/${superheroId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    try {
        // Fetch data from the API
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.data.results[0]; // Correctly access the superhero data from the API response
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to display superhero details on the page
function displaySuperheroDetails() {
    // Get the superhero ID from the URL parameters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const superheroId = urlParams.get('id');

    // Check if superhero ID exists
    if (!superheroId) {
        alert('Superhero ID not found.');
        return;
    }

    // Fetch superhero details from the Marvel API
    fetchSuperheroDetails(superheroId).then((superhero) => {
        if (superhero) {
            // Get HTML elements for displaying superhero details
            const nameElement = document.querySelector('.name');
            const thumbnailElement = document.querySelector('.hero-details-content-thumbnail img');
            const biographyElement = document.querySelector('.biography');
            const comicsElement = document.querySelector('.Comics');
            const eventsElement = document.querySelector('.Events');
            const seriesElement = document.querySelector('.Series');
            const storiesElement = document.querySelector('.Stories');

            // Set superhero name
            nameElement.textContent = superhero.name;

            // Set superhero thumbnail
            thumbnailElement.src = `${superhero.thumbnail.path}.${superhero.thumbnail.extension}`;

            // Set superhero biography
            if (superhero.description) {
                const biographyItem = document.createElement('li');
                biographyItem.textContent = superhero.description;
                biographyElement.appendChild(biographyItem);
            } else {
                const noDescriptionItem = document.createElement('li');
                noDescriptionItem.textContent = 'No description available.';
                biographyElement.appendChild(noDescriptionItem);
            }

            // Set superhero comics
            superhero.comics.items.forEach((comic) => {
                const comicItem = document.createElement('li');
                comicItem.innerHTML = `<div><i class="fa-solid fa-shield"></i> <span>${comic.name}</span></div>`;
                comicsElement.appendChild(comicItem);
            });

            // Set superhero events
            superhero.events.items.forEach((event) => {
                const eventItem = document.createElement('li');
                eventItem.innerHTML = `<div><i class="fa-solid fa-shield"></i> <span>${event.name}</span></div>`;
                eventsElement.appendChild(eventItem);
            });

            // Set superhero series
            superhero.series.items.forEach((series) => {
                const seriesItem = document.createElement('li');
                seriesItem.innerHTML = `<div><i class="fa-solid fa-shield"></i> <span>${series.name}</span></div>`;
                seriesElement.appendChild(seriesItem);
            });

            // Set superhero stories
            superhero.stories.items.forEach((story) => {
                const storyItem = document.createElement('li');
                storyItem.innerHTML = `<div><i class="fa-solid fa-shield"></i> <span>${story.name}</span></div>`;
                storiesElement.appendChild(storyItem);
            });
        } else {
            alert('Superhero data not found.');
        }
    });

}

// Display superhero details on page load
displaySuperheroDetails();
