// Global variables
let currentOffset = 0;
const limit = 20;
const baseUrl = 'https://pokeapi.co/api/v2/';
let allPokemon = [];

// DOM elements
const pokemonGrid = document.getElementById('pokemonGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const pokemonModal = document.getElementById('pokemonModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');

// Type colors mapping for badges
const typeColors = {
    bug: 'pokebug',
    dark: 'pokedark',
    dragon: 'pokedragon',
    electric: 'pokeelectric',
    fairy: 'pokefairy',
    fighting: 'pokefighting',
    fire: 'pokefire',
    flying: 'pokeflying',
    ghost: 'pokeghost',
    grass: 'pokegrass',
    ground: 'pokeground',
    ice: 'pokeice',
    normal: 'pokenormal',
    poison: 'pokepoison',
    psychic: 'pokepsychic',
    rock: 'pokerock',
    steel: 'pokesteel',
    water: 'pokewater'
};

// Initialize the app
window.addEventListener('DOMContentLoaded', () => {
    fetchPokemon();
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    loadMoreBtn.addEventListener('click', fetchPokemon);
    searchBtn.addEventListener('click', searchPokemon);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchPokemon();
        }
    });
    randomBtn.addEventListener('click', getRandomPokemon);
    closeModal.addEventListener('click', () => {
        closeModalWithAnimation();
    });
}

// Helper function to close modal with animation
function closeModalWithAnimation() {
    pokemonModal.classList.add('animate__animated', 'animate__fadeOut');
    setTimeout(() => {
        pokemonModal.classList.remove('animate__animated', 'animate__fadeOut');
        pokemonModal.classList.add('hidden');
    }, 300);
}

// Fetch Pokemon from PokeAPI
async function fetchPokemon() {
    try {
        // Show loading spinner
        pokemonGrid.innerHTML = '<div class="col-span-full flex justify-center py-12"><div class="loader"></div></div>';

        const response = await fetch(`${baseUrl}pokemon?offset=${currentOffset}&limit=${limit}`);
        const data = await response.json();
        
        // If it's the first load, replace the content. Otherwise, append.
        if (currentOffset === 0) {
            pokemonGrid.innerHTML = '';
        } else {
            // Remove loader if it exists
            const loader = pokemonGrid.querySelector('.loader')?.parentElement;
            if (loader) {
                pokemonGrid.removeChild(loader);
            }
        }

        // Fetch details for each Pokemon
        for (const pokemon of data.results) {
            await fetchPokemonDetails(pokemon.url);
        }

        currentOffset += limit;
    } catch (error) {
        console.error('Error fetching Pokemon:', error);
        pokemonGrid.innerHTML = '<div class="col-span-full text-center text-red-600">Failed to load Pokemon. Please try again later.</div>';
    }
}

// Fetch details for a specific Pokemon
async function fetchPokemonDetails(url) {
    try {
        const response = await fetch(url);
        const pokemon = await response.json();
        allPokemon.push(pokemon);
        renderPokemonCard(pokemon);
    } catch (error) {
        console.error('Error fetching Pokemon details:', error);
    }
}

// Render a Pokemon card in the grid
function renderPokemonCard(pokemon) {
    const pokemonId = String(pokemon.id).padStart(3, '0');
    const types = pokemon.types.map(typeInfo => typeInfo.type.name);
    const mainType = types[0];
    const bgColor = `bg-${typeColors[mainType] || 'pokegray'}`;
    
    const card = document.createElement('div');
    card.className = `pokemon-card ${bgColor} rounded-xl overflow-hidden shadow-lg text-white cursor-pointer transform transition duration-300 hover:scale-105`;
    card.innerHTML = `
        <div class="relative p-4">
            <span class="absolute top-2 right-2 font-bold opacity-70">#${pokemonId}</span>
            <div class="flex justify-center">
                <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                     alt="${pokemon.name}" 
                     class="w-32 h-32 object-contain animate-float">
            </div>
            <div class="text-center mt-2">
                <h3 class="font-pokemon text-lg capitalize">${pokemon.name.replace('-', ' ')}</h3>
                <div class="flex justify-center gap-2 mt-2">
                    ${types.map(type => `
                        <span class="type-badge capitalize px-2 py-1 rounded-full bg-white bg-opacity-30 text-xs font-semibold">
                            ${type}
                        </span>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => showPokemonDetails(pokemon.id));
    pokemonGrid.appendChild(card);
}

// Show detailed information about a Pokemon
async function showPokemonDetails(pokemonId) {
    try {
        // Make sure the modal is ready and reset any previous content
        pokemonModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        
        // Show modal with loading spinner
        modalContent.innerHTML = '<div class="flex justify-center py-12"><div class="loader"></div></div>';
        pokemonModal.classList.add('animate__animated', 'animate__fadeIn');
        
        // Fetch detailed Pokemon data
        const response = await fetch(`${baseUrl}pokemon/${pokemonId}`);
        const pokemon = await response.json();
        
        // Fetch additional species data for flavor text
        const speciesResponse = await fetch(pokemon.species.url);
        const species = await speciesResponse.json();
        
        // Get English flavor text
        const flavorText = species.flavor_text_entries
            .find(entry => entry.language.name === 'en')?.flavor_text
            .replace(/\f/g, ' ')
            .replace(/\u00AD/g, '') || 'No description available.';
            
        // Get habitat and generation
        const habitat = species.habitat ? species.habitat.name : 'Unknown';
        const generation = species.generation.name.replace('-', ' ').toUpperCase();
        
        // Get evolution chain
        let evolutionData = [];
        try {
            const evoResponse = await fetch(species.evolution_chain.url);
            const evoChain = await evoResponse.json();
            evolutionData = await processEvolutionChain(evoChain.chain);
        } catch (err) {
            console.error('Error fetching evolution data:', err);
        }
        
        // Get abilities
        const abilities = pokemon.abilities.map(ability => 
            `<span class="capitalize">${ability.ability.name.replace('-', ' ')}</span>`
        ).join(', ');
        
        // Build the modal content
        modalContent.innerHTML = `
            <div class="bg-${typeColors[pokemon.types[0].type.name]} rounded-t-xl p-6 pb-16 relative">
                <h2 class="font-pokemon text-white text-2xl capitalize mb-2">${pokemon.name.replace('-', ' ')}</h2>
                <span class="text-white opacity-70 font-bold">#${String(pokemon.id).padStart(3, '0')}</span>
                
                <div class="flex justify-center mt-4">
                    <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                         alt="${pokemon.name}" 
                         class="w-48 h-48 object-contain animate-bounce">
                </div>
                
                <div class="flex justify-center gap-2 mt-4">
                    ${pokemon.types.map(typeInfo => `
                        <span class="type-badge capitalize px-3 py-1 rounded-full bg-white bg-opacity-30 text-white text-sm font-semibold">
                            ${typeInfo.type.name}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <div class="p-6 -mt-8 bg-white rounded-xl max-h-96 overflow-y-auto">
                <div class="bg-white rounded-xl shadow-lg p-4 mb-6">
                    <h3 class="font-pokemon text-gray-800 text-lg mb-2">Pokédex Entry</h3>
                    <p class="text-gray-600">${flavorText}</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-gray-50 rounded-xl p-4">
                        <h3 class="font-pokemon text-gray-800 text-lg mb-4">Details</h3>
                        
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <p class="text-gray-500 text-sm">Height</p>
                                <p class="text-gray-800 font-bold">${pokemon.height / 10} m</p>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm">Weight</p>
                                <p class="text-gray-800 font-bold">${pokemon.weight / 10} kg</p>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm">Habitat</p>
                                <p class="text-gray-800 font-bold capitalize">${habitat}</p>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm">Generation</p>
                                <p class="text-gray-800 font-bold">${generation}</p>
                            </div>
                            <div class="col-span-2">
                                <p class="text-gray-500 text-sm">Abilities</p>
                                <p class="text-gray-800 font-bold">${abilities}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 rounded-xl p-4">
                        <h3 class="font-pokemon text-gray-800 text-lg mb-4">Base Stats</h3>
                        
                        <div class="space-y-3">
                            ${pokemon.stats.map(stat => {
                                const statName = stat.stat.name.replace('-', ' ');
                                const statValue = stat.base_stat;
                                const percentage = Math.min(100, (statValue / 150) * 100);
                                
                                let barColor;
                                if (percentage < 30) barColor = 'bg-red-500';
                                else if (percentage < 60) barColor = 'bg-yellow-500';
                                else barColor = 'bg-green-500';
                                
                                return `
                                    <div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-700 capitalize">${statName}</span>
                                            <span class="text-gray-700 font-bold">${statValue}</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                            <div class="${barColor} h-2.5 rounded-full" style="width: ${percentage}%"></div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
                
                ${evolutionData.length > 0 ? `
                    <div class="mt-6 bg-gray-50 rounded-xl p-4">
                        <h3 class="font-pokemon text-gray-800 text-lg mb-4">Evolution Chain</h3>
                        <div class="flex flex-wrap justify-center items-center gap-4">
                            ${evolutionData.map((evo, index) => `
                                <div class="text-center flex flex-col items-center">
                                    <img src="${evo.image}" alt="${evo.name}" class="w-20 h-20 object-contain mx-auto">
                                    <p class="text-sm font-bold capitalize mt-1">${evo.name.replace('-', ' ')}</p>
                                    ${index < evolutionData.length - 1 ? `
                                        <div class="mx-2 my-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        modalContent.innerHTML = '<div class="p-6 text-center text-red-600">Failed to load Pokemon details. Please try again later.</div>';
    }
}

// Process evolution chain data
async function processEvolutionChain(chain) {
    const evolutionData = [];
    
    // Function to extract evolution data
    async function extractEvolutionData(chain) {
        try {
            // Fetch Pokemon details to get the image
            const response = await fetch(`${baseUrl}pokemon/${chain.species.name}`);
            const pokemon = await response.json();
            
            evolutionData.push({
                name: chain.species.name,
                image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default
            });
            
            // Process the next evolution if it exists
            if (chain.evolves_to.length > 0) {
                await extractEvolutionData(chain.evolves_to[0]);
            }
        } catch (error) {
            console.error('Error processing evolution:', error);
        }
    }
    
    await extractEvolutionData(chain);
    return evolutionData;
}

// Search for Pokemon
function searchPokemon() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        return;
    }
    
    // Show loading spinner
    pokemonGrid.innerHTML = '<div class="col-span-full flex justify-center py-12"><div class="loader"></div></div>';
    
    // Search by name or ID
    fetch(`${baseUrl}pokemon/${searchTerm}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokemon not found');
            }
            return response.json();
        })
        .then(pokemon => {
            pokemonGrid.innerHTML = '';
            renderPokemonCard(pokemon);
            currentOffset = 0; // Reset offset for when "Load More" is clicked again
        })
        .catch(error => {
            console.error('Error searching Pokemon:', error);
            pokemonGrid.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-pokered text-lg mb-4">No Pokemon found matching "${searchTerm}"</p>
                    <button id="resetSearchBtn" class="bg-pokeblue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        Show All Pokemon
                    </button>
                </div>
            `;
            
            // Add event listener to reset button
            document.getElementById('resetSearchBtn').addEventListener('click', () => {
                currentOffset = 0;
                fetchPokemon();
            });
        });
}

// Get a random Pokemon
function getRandomPokemon() {
    // There are approximately 898 Pokemon in the API
    const randomId = Math.floor(Math.random() * 898) + 1;
    
    // Show loading spinner
    pokemonGrid.innerHTML = '<div class="col-span-full flex justify-center py-12"><div class="loader"></div></div>';
    
    fetch(`${baseUrl}pokemon/${randomId}`)
        .then(response => response.json())
        .then(pokemon => {
            pokemonGrid.innerHTML = '';
            renderPokemonCard(pokemon);
            
            // Add a "Show All" button when displaying random Pokemon
            const resetDiv = document.createElement('div');
            resetDiv.className = 'col-span-full text-center mt-8';
            resetDiv.innerHTML = `
                <button id="resetRandomBtn" class="bg-pokeblue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    Show All Pokemon
                </button>
            `;
            pokemonGrid.appendChild(resetDiv);
            
            // Add event listener to reset button
            document.getElementById('resetRandomBtn').addEventListener('click', () => {
                currentOffset = 0;
                fetchPokemon();
            });
        })
        .catch(error => {
            console.error('Error fetching random Pokemon:', error);
            pokemonGrid.innerHTML = '<div class="col-span-full text-center text-red-600">Failed to load random Pokemon. Please try again later.</div>';
        });
}

// Event delegation for dynamically added buttons
document.addEventListener('click', function(e) {
    // Handle clicks on the document
    if (e.target.id === 'resetSearchBtn' || e.target.id === 'resetRandomBtn') {
        currentOffset = 0;
        fetchPokemon();
    }
    
    // Close modal when clicking outside of modal content
    if (e.target === pokemonModal) {
        closeModalWithAnimation();
    }
});

// Add keyboard support for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !pokemonModal.classList.contains('hidden')) {
        closeModalWithAnimation();
    }
});

// Handle browser back button to close modal
window.addEventListener('popstate', () => {
    if (!pokemonModal.classList.contains('hidden')) {
        pokemonModal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
});

// Reset body overflow when modal is closed
closeModal.addEventListener('click', () => {
    document.body.style.overflow = 'auto';
});