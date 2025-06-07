// Search functionality with autocomplete
class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchDropdown = document.querySelector('.search-dropdown');
        this.searchTimeout = null;
        this.minSearchLength = 2;
        this.searchResults = [];
        
        this.init();
    }
    
    init() {
        if (!this.searchInput || !this.searchDropdown) return;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
        this.searchInput.addEventListener('focus', () => this.handleSearchFocus());
        this.searchInput.addEventListener('blur', () => this.handleSearchBlur());
        
        // Handle keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
        
        // Handle clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideDropdown();
            }
        });
    }
    
    handleSearchInput(e) {
        const query = e.target.value.trim();
        
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Hide dropdown if query is too short
        if (query.length < this.minSearchLength) {
            this.hideDropdown();
            return;
        }
        
        // Debounce search
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }
    
    performSearch(query) {
        const lowerQuery = query.toLowerCase();
        
        // Search through movie scenes
        this.searchResults = movieScenes.filter(scene => {
            const { movie, scene: sceneData, food } = scene;
            
            // Search in movie title
            if (movie.title.toLowerCase().includes(lowerQuery)) return true;
            
            // Search in food items
            if (sceneData.foodItems.some(item => item.toLowerCase().includes(lowerQuery))) return true;
            
            // Search in description
            if (sceneData.description.toLowerCase().includes(lowerQuery)) return true;
            
            // Search in cuisine
            if (food.cuisine.toLowerCase().includes(lowerQuery)) return true;
            
            // Search in director
            if (movie.director.toLowerCase().includes(lowerQuery)) return true;
            
            // Search in genre
            if (movie.genre.some(g => g.toLowerCase().includes(lowerQuery))) return true;
            
            return false;
        });
        
        this.displayResults();
    }
    
    displayResults() {
        if (this.searchResults.length === 0) {
            this.searchDropdown.innerHTML = `
                <div class="search-no-results">
                    <p>No results found. Try searching for:</p>
                    <ul>
                        <li>Movie titles (e.g., "Goodfellas", "Ratatouille")</li>
                        <li>Food items (e.g., "Pizza", "Pasta", "Burger")</li>
                        <li>Cuisines (e.g., "Italian", "French", "Japanese")</li>
                    </ul>
                </div>
            `;
        } else {
            const resultsHTML = this.searchResults.slice(0, 5).map((scene, index) => `
                <div class="search-result" data-index="${index}" tabindex="0">
                    <img src="${scene.scene.thumbnailUrl}" alt="${scene.movie.title}" class="search-result-image">
                    <div class="search-result-content">
                        <h4 class="search-result-title">${this.highlightMatch(scene.movie.title, this.searchInput.value)}</h4>
                        <p class="search-result-food">${this.highlightMatch(scene.scene.foodItems[0], this.searchInput.value)}</p>
                        <p class="search-result-meta">${scene.movie.year} • ${scene.food.cuisine}</p>
                    </div>
                </div>
            `).join('');
            
            this.searchDropdown.innerHTML = resultsHTML;
            
            // Add click handlers to results
            this.searchDropdown.querySelectorAll('.search-result').forEach((result, index) => {
                result.addEventListener('click', () => this.selectResult(index));
            });
        }
        
        this.showDropdown();
    }
    
    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    showDropdown() {
        this.searchDropdown.classList.add('active');
    }
    
    hideDropdown() {
        this.searchDropdown.classList.remove('active');
    }
    
    handleSearchFocus() {
        if (this.searchInput.value.length >= this.minSearchLength && this.searchResults.length > 0) {
            this.showDropdown();
        }
    }
    
    handleSearchBlur() {
        // Delay hiding to allow clicking on results
        setTimeout(() => {
            this.hideDropdown();
        }, 200);
    }
    
    handleKeyboardNavigation(e) {
        if (!this.searchDropdown.classList.contains('active')) return;
        
        const results = this.searchDropdown.querySelectorAll('.search-result');
        const currentIndex = Array.from(results).findIndex(r => r === document.activeElement);
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < results.length - 1) {
                    results[currentIndex + 1].focus();
                } else if (currentIndex === -1 && results.length > 0) {
                    results[0].focus();
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    results[currentIndex - 1].focus();
                } else if (currentIndex === 0) {
                    this.searchInput.focus();
                }
                break;
                
            case 'Enter':
                e.preventDefault();
                if (currentIndex >= 0) {
                    this.selectResult(currentIndex);
                }
                break;
                
            case 'Escape':
                e.preventDefault();
                this.hideDropdown();
                this.searchInput.blur();
                break;
        }
    }
    
    selectResult(index) {
        const selectedScene = this.searchResults[index];
        if (!selectedScene) return;
        
        // Clear search
        this.searchInput.value = '';
        this.hideDropdown();
        
        // Scroll to the scene in the grid
        const sceneCard = document.querySelector(`[data-scene-id="${selectedScene.id}"]`);
        if (sceneCard) {
            const headerOffset = 120;
            const elementPosition = sceneCard.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Highlight the card
            sceneCard.classList.add('highlighted');
            setTimeout(() => {
                sceneCard.classList.remove('highlighted');
            }, 2000);
        }
    }
}

// Add styles for search dropdown
const searchStyles = `
<style>
.search-no-results {
    padding: var(--spacing-lg);
    text-align: center;
    color: var(--color-neutral-dark);
}

.search-no-results p {
    margin-bottom: var(--spacing-md);
    font-weight: 500;
}

.search-no-results ul {
    text-align: left;
    display: inline-block;
    font-size: var(--text-sm);
    color: #666;
}

.search-no-results li {
    margin-bottom: var(--spacing-xs);
}

.search-result-content {
    flex: 1;
    overflow: hidden;
}

.search-result-title {
    font-size: var(--text-base);
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
    color: var(--color-neutral-dark);
}

.search-result-food {
    font-size: var(--text-sm);
    color: var(--color-accent);
    margin-bottom: var(--spacing-xs);
}

.search-result-meta {
    font-size: var(--text-xs);
    color: #666;
}

.search-result mark {
    background-color: var(--color-secondary);
    color: var(--color-neutral-dark);
    padding: 0 2px;
    border-radius: 2px;
}

.search-result:focus {
    outline: none;
    background-color: var(--color-neutral-light);
}

.content-card.highlighted {
    animation: highlight 2s ease;
}

@keyframes highlight {
    0%, 100% {
        box-shadow: var(--shadow-sm);
    }
    50% {
        box-shadow: 0 0 0 4px var(--color-secondary);
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', searchStyles);

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.searchManager = new SearchManager();
});