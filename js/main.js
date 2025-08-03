/**
 * FOOD IN MOVIES - MAIN APPLICATION
 * Consolidated JavaScript for movie food scenes directory
 */

// =============================================
// 1. IMAGE LOADER MODULE
// =============================================
class ImageLoader {
    constructor() {
        this.observer = null;
        this.fallbackImage = 'images/fallback.jpg';
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.observeImages();
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
        }
    }
    
    observeImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (this.observer) {
                this.observer.observe(img);
            } else {
                this.loadImage(img);
            }
        });
    }
    
    loadImage(img) {
        const src = img.dataset.src || img.src;
        
        // Create skeleton loading effect
        img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
        img.style.backgroundSize = '200% 100%';
        img.style.animation = 'loading 1.5s infinite';
        
        const imageObj = new Image();
        imageObj.onload = () => {
            img.src = src;
            img.style.background = '';
            img.style.animation = '';
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            setTimeout(() => img.style.opacity = '1', 50);
        };
        
        imageObj.onerror = () => {
            img.src = this.fallbackImage;
            img.style.background = '';
            img.style.animation = '';
        };
        
        imageObj.src = src;
    }
}

// =============================================
// 2. SEARCH MODULE
// =============================================
class SearchManager {
    constructor() {
        this.searchInput = null;
        this.resultsContainer = null;
        this.debounceTimer = null;
        this.currentFocus = -1;
        this.init();
    }
    
    init() {
        this.createSearchInterface();
        this.setupEventListeners();
    }
    
    createSearchInterface() {
        // Search functionality is handled by existing HTML structure
        this.searchInput = document.querySelector('.search-input');
        if (!this.searchInput) {
            // Create search input if it doesn't exist
            const searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.innerHTML = `
                <input type="text" class="search-input" placeholder="Search movies, food, or cuisine...">
                <div class="search-results"></div>
            `;
            document.querySelector('.filters-section .container').appendChild(searchContainer);
            this.searchInput = searchContainer.querySelector('.search-input');
        }
        this.resultsContainer = document.querySelector('.search-results') || this.createResultsContainer();
    }
    
    createResultsContainer() {
        const container = document.createElement('div');
        container.className = 'search-results';
        this.searchInput.parentNode.appendChild(container);
        return container;
    }
    
    setupEventListeners() {
        if (!this.searchInput) return;
        
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
        
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideResults();
            }
        });
    }
    
    performSearch(query) {
        if (!query.trim()) {
            this.hideResults();
            return;
        }
        
        const results = movieScenes.filter(scene => {
            const searchText = `
                ${scene.movie.title} 
                ${scene.scene.description} 
                ${scene.scene.foodItems.join(' ')} 
                ${scene.food.cuisine} 
                ${scene.food.mealType}
            `.toLowerCase();
            
            return searchText.includes(query.toLowerCase());
        });
        
        this.displayResults(results, query);
    }
    
    displayResults(results, query) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
        } else {
            this.resultsContainer.innerHTML = results.slice(0, 5).map((scene, index) => `
                <div class="search-result-item" data-scene-id="${scene.id}" data-index="${index}">
                    <img src="${scene.scene.thumbnailUrl}" alt="${scene.movie.title}" loading="lazy">
                    <div class="result-content">
                        <strong>${this.highlightText(scene.movie.title, query)}</strong>
                        <p>${this.highlightText(scene.scene.foodItems[0], query)}</p>
                        <small>${scene.food.cuisine} • ${scene.food.mealType}</small>
                    </div>
                </div>
            `).join('');
        }
        
        this.showResults();
        this.currentFocus = -1;
    }
    
    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    handleKeyNavigation(e) {
        const items = this.resultsContainer.querySelectorAll('.search-result-item');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.currentFocus = Math.min(this.currentFocus + 1, items.length - 1);
                this.updateFocus(items);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.currentFocus = Math.max(this.currentFocus - 1, -1);
                this.updateFocus(items);
                break;
            case 'Enter':
                e.preventDefault();
                if (this.currentFocus >= 0 && items[this.currentFocus]) {
                    this.selectResult(items[this.currentFocus]);
                }
                break;
            case 'Escape':
                this.hideResults();
                break;
        }
    }
    
    updateFocus(items) {
        items.forEach((item, index) => {
            item.classList.toggle('focused', index === this.currentFocus);
        });
    }
    
    selectResult(item) {
        const sceneId = item.dataset.sceneId;
        this.hideResults();
        this.searchInput.value = '';
        
        // Scroll to the scene card
        const sceneCard = document.querySelector(`[data-scene-id="${sceneId}"]`);
        if (sceneCard) {
            sceneCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            sceneCard.style.animation = 'highlight 2s ease';
        }
    }
    
    showResults() {
        this.resultsContainer.style.display = 'block';
    }
    
    hideResults() {
        this.resultsContainer.style.display = 'none';
    }
}

// =============================================
// 3. FAVORITES MODULE
// =============================================
class FavoritesManager {
    constructor() {
        this.favorites = this.loadFavorites();
        this.init();
    }
    
    init() {
        this.updateFavoriteButtons();
        this.setupEventListeners();
        this.injectStyles();
    }
    
    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('movieFoodFavorites') || '[]');
        } catch {
            return [];
        }
    }
    
    saveFavorites() {
        localStorage.setItem('movieFoodFavorites', JSON.stringify(this.favorites));
    }
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) {
                e.preventDefault();
                const card = e.target.closest('.content-card');
                const sceneId = card?.dataset.sceneId;
                if (sceneId) {
                    this.toggleFavorite(sceneId, e.target.closest('.favorite-btn'));
                }
            }
        });
    }
    
    toggleFavorite(sceneId, button) {
        const isFavorited = this.favorites.includes(sceneId);
        
        if (isFavorited) {
            this.favorites = this.favorites.filter(id => id !== sceneId);
        } else {
            this.favorites.push(sceneId);
            this.createHeartBurst(button);
        }
        
        this.saveFavorites();
        this.updateFavoriteButton(button, !isFavorited);
        this.showToast(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    }
    
    updateFavoriteButtons() {
        document.querySelectorAll('.content-card').forEach(card => {
            const sceneId = card.dataset.sceneId;
            const button = card.querySelector('.favorite-btn');
            if (button && sceneId) {
                this.updateFavoriteButton(button, this.favorites.includes(sceneId));
            }
        });
    }
    
    updateFavoriteButton(button, isFavorited) {
        const svg = button.querySelector('svg path');
        if (svg) {
            svg.setAttribute('fill', isFavorited ? 'currentColor' : 'none');
        }
        button.classList.toggle('favorited', isFavorited);
    }
    
    createHeartBurst(button) {
        const burst = document.createElement('div');
        burst.className = 'heart-burst';
        burst.innerHTML = '💖';
        
        const rect = button.getBoundingClientRect();
        burst.style.position = 'fixed';
        burst.style.left = rect.left + rect.width / 2 + 'px';
        burst.style.top = rect.top + rect.height / 2 + 'px';
        burst.style.transform = 'translate(-50%, -50%)';
        burst.style.animation = 'heartBurst 1s ease-out forwards';
        burst.style.pointerEvents = 'none';
        burst.style.zIndex = '9999';
        
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 1000);
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-charcoal);
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 9999;
            animation: slideInUp 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    injectStyles() {
        const styles = `
            @keyframes heartBurst {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.8; }
                100% { transform: translate(-50%, -50%) scale(0) translateY(-20px); opacity: 0; }
            }
            
            @keyframes slideInUp {
                from { transform: translateX(-50%) translateY(100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            
            @keyframes slideOutDown {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(100%); opacity: 0; }
            }
            
            .favorite-btn.favorited {
                color: #ff6b6b;
            }
            
            .search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid var(--color-neutral);
                border-top: none;
                border-radius: 0 0 var(--radius-md) var(--radius-md);
                box-shadow: var(--shadow-lg);
                max-height: 300px;
                overflow-y: auto;
                z-index: var(--z-dropdown);
                display: none;
            }
            
            .search-result-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-sm);
                cursor: pointer;
                border-bottom: 1px solid var(--color-neutral-light);
            }
            
            .search-result-item:hover,
            .search-result-item.focused {
                background-color: var(--color-neutral-light);
            }
            
            .search-result-item img {
                width: 50px;
                height: 30px;
                object-fit: cover;
                border-radius: var(--radius-sm);
            }
            
            .result-content {
                flex: 1;
            }
            
            .result-content strong {
                display: block;
                font-size: var(--text-sm);
            }
            
            .result-content p {
                margin: 2px 0;
                font-size: var(--text-xs);
                color: var(--color-neutral-dark);
            }
            
            .result-content small {
                font-size: var(--text-xs);
                color: var(--color-neutral);
            }
            
            .no-results {
                padding: var(--spacing-md);
                text-align: center;
                color: var(--color-neutral);
            }
            
            mark {
                background-color: var(--color-accent);
                color: white;
                padding: 1px 3px;
                border-radius: 2px;
            }
            
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            @keyframes highlight {
                0%, 100% { transform: scale(1); box-shadow: none; }
                50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(139, 21, 56, 0.3); }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// =============================================
// 4. MAIN APPLICATION CLASS
// =============================================
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
        this.setupFilterEnhancements();
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
        
        // Update favorites after rendering
        if (window.favoritesManager) {
            window.favoritesManager.updateFavoriteButtons();
        }
    }
    
    createSceneCard(scene) {
        const { movie, scene: sceneData, food } = scene;
        const attribution = getAttribution ? getAttribution(movie) : '';
        
        return `
            <article class="content-card" data-scene-id="${scene.id}">
                <div class="card-image">
                    <img 
                        class="scene-image"
                        src="${sceneData.thumbnailUrl}"
                        alt="${sceneData.thumbnailAlt || `${movie.title} - ${sceneData.foodItems[0]} scene`}"
                        onerror="this.src='images/fallback.jpg'"
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
        this.updateFilterCounts();
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
        this.updateFilterCounts();
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
    
    setupFilterEnhancements() {
        this.updateFilterCounts();
    }
    
    updateFilterCounts() {
        // Add counts to filter options
        document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
            const filterType = dropdown.dataset.filterDropdown;
            const labels = dropdown.querySelectorAll('label');
            
            labels.forEach(label => {
                const input = label.querySelector('input');
                const value = input.value;
                
                let count = 0;
                if (filterType === 'genre') {
                    count = movieScenes.filter(scene => 
                        scene.movie.genre.some(g => g.toLowerCase() === value)
                    ).length;
                } else if (filterType === 'cuisine') {
                    count = movieScenes.filter(scene => 
                        scene.food.cuisine.toLowerCase() === value
                    ).length;
                } else if (filterType === 'decade') {
                    count = movieScenes.filter(scene => {
                        const decade = Math.floor(scene.movie.year / 10) * 10 + 's';
                        return decade === value;
                    }).length;
                } else if (filterType === 'meal') {
                    count = movieScenes.filter(scene => 
                        scene.food.mealType.toLowerCase() === value
                    ).length;
                }
                
                // Update label text with count
                const text = label.textContent.replace(/\s*\(\d+\)$/, '');
                label.innerHTML = `${input.outerHTML} ${text} (${count})`;
            });
        });
    }
}

// =============================================
// 5. INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    window.imageLoader = new ImageLoader();
    window.searchManager = new SearchManager();
    window.favoritesManager = new FavoritesManager();
    window.foodInMovies = new FoodInMovies();
    
    console.log('🎬 Food In Movies - All modules loaded successfully!');
});