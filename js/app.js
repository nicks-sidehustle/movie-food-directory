// Main application logic
class FoodInMovies {
    constructor() {
        this.currentScenes = [...movieScenes];
        this.filteredScenes = [...movieScenes];
        this.currentView = 'grid';
        this.currentPage = 1;
        this.scenesPerPage = 6;
        this.activeFilters = {
            genre: [],
            cuisine: [],
            decade: [],
            meal: []
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderScenes();
        this.updateViewToggle();
    }
    
    setupEventListeners() {
        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleView(e));
        });
        
        // Load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMore());
        }
        
        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.smoothScroll(e));
        });
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleFilterDropdown(e));
        });
        
        // Filter checkboxes
        document.querySelectorAll('.filter-dropdown input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleFilterChange(e));
        });
        
        // Clear filters
        const clearFiltersBtn = document.querySelector('.clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());
        }
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }
    
    toggleView(e) {
        const btn = e.currentTarget;
        const view = btn.dataset.view;
        
        if (view === this.currentView) return;
        
        this.currentView = view;
        this.updateViewToggle();
        this.renderScenes();
    }
    
    updateViewToggle() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === this.currentView);
        });
        
        const grid = document.getElementById('content-grid');
        if (grid) {
            grid.classList.toggle('list-view', this.currentView === 'list');
        }
    }
    
    renderScenes() {
        const grid = document.getElementById('content-grid');
        if (!grid) return;
        
        const start = 0;
        const end = this.currentPage * this.scenesPerPage;
        const scenesToRender = this.filteredScenes.slice(start, end);
        
        grid.innerHTML = scenesToRender.map(scene => this.createSceneCard(scene)).join('');
        
        // Add animation
        this.animateCards();
        
        // Update load more button visibility
        this.updateLoadMoreButton();
    }
    
    createSceneCard(scene) {
        const { movie, scene: sceneData, food } = scene;
        const attribution = window.getAttribution ? window.getAttribution(movie) : '';
        
        return `
            <article class="content-card" data-scene-id="${scene.id}">
                <div class="card-image">
                    <img 
                        class="scene-image"
                        src="images/placeholders/placeholder-scene.svg"
                        data-src="${sceneData.thumbnailUrl}"
                        data-srcset="${window.imageLoader ? window.imageLoader.generateSrcset(sceneData.thumbnailUrl) : ''}"
                        alt="${sceneData.thumbnailAlt || `${movie.title} - ${sceneData.foodItems[0]} scene`}"
                        data-attribution="${attribution}"
                        data-placeholder-type="scene"
                        loading="lazy">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${movie.title}</h3>
                    <div class="card-meta">
                        <span>${movie.year}</span>
                        <span>•</span>
                        <span>${movie.genre[0]}</span>
                    </div>
                    <p class="card-food">${sceneData.foodItems[0]}</p>
                    <p class="card-description">${this.truncateText(sceneData.description, 100)}</p>
                    <div class="card-tags">
                        <span class="tag">${food.cuisine}</span>
                        <span class="tag">${food.mealType}</span>
                    </div>
                    <div class="card-actions">
                        <button class="action-btn favorite-btn" aria-label="Add to favorites">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                        <button class="action-btn share-btn" aria-label="Share">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }
    
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }
    
    animateCards() {
        const cards = document.querySelectorAll('.content-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
        
        // Re-observe new images for lazy loading
        if (window.imageLoader) {
            window.imageLoader.observeImages();
        }
    }
    
    loadMore() {
        this.currentPage++;
        this.renderScenes();
    }
    
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;
        
        const hasMore = this.currentPage * this.scenesPerPage < this.filteredScenes.length;
        loadMoreBtn.style.display = hasMore ? 'inline-flex' : 'none';
    }
    
    toggleMobileMenu() {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.classList.toggle('active');
        }
    }
    
    smoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 60;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    toggleFilterDropdown(e) {
        const btn = e.currentTarget;
        const filterType = btn.dataset.filter;
        const dropdown = document.querySelector(`[data-filter-dropdown="${filterType}"]`);
        
        if (!dropdown) return;
        
        // Close other dropdowns
        document.querySelectorAll('.filter-dropdown').forEach(dd => {
            if (dd !== dropdown) {
                dd.classList.remove('active');
                dd.previousElementSibling.classList.remove('active');
            }
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active');
        btn.classList.toggle('active');
    }
    
    handleFilterChange(e) {
        const checkbox = e.target;
        const filterType = checkbox.closest('.filter-dropdown').dataset.filterDropdown;
        const value = checkbox.value;
        
        if (checkbox.checked) {
            if (!this.activeFilters[filterType].includes(value)) {
                this.activeFilters[filterType].push(value);
            }
        } else {
            const index = this.activeFilters[filterType].indexOf(value);
            if (index > -1) {
                this.activeFilters[filterType].splice(index, 1);
            }
        }
        
        this.applyFilters();
    }
    
    applyFilters() {
        this.filteredScenes = this.currentScenes.filter(scene => {
            // Genre filter
            if (this.activeFilters.genre.length > 0) {
                const hasGenre = scene.movie.genre.some(g => 
                    this.activeFilters.genre.includes(g.toLowerCase())
                );
                if (!hasGenre) return false;
            }
            
            // Cuisine filter
            if (this.activeFilters.cuisine.length > 0) {
                if (!this.activeFilters.cuisine.includes(scene.food.cuisine.toLowerCase())) {
                    return false;
                }
            }
            
            // Decade filter
            if (this.activeFilters.decade.length > 0) {
                const decade = Math.floor(scene.movie.year / 10) * 10 + 's';
                if (!this.activeFilters.decade.includes(decade)) {
                    return false;
                }
            }
            
            // Meal filter
            if (this.activeFilters.meal.length > 0) {
                if (!this.activeFilters.meal.includes(scene.food.mealType.toLowerCase())) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.currentPage = 1;
        this.renderScenes();
    }
    
    clearAllFilters() {
        // Reset active filters
        this.activeFilters = {
            genre: [],
            cuisine: [],
            decade: [],
            meal: []
        };
        
        // Uncheck all checkboxes
        document.querySelectorAll('.filter-dropdown input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Close all dropdowns
        document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Reset filtered scenes
        this.filteredScenes = [...this.currentScenes];
        this.currentPage = 1;
        this.renderScenes();
    }
    
    handleOutsideClick(e) {
        if (!e.target.closest('.filter-group')) {
            document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.foodInMovies = new FoodInMovies();
});