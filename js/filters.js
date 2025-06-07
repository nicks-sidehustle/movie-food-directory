// Filter functionality (already implemented in app.js, this extends it)
class FilterEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.addFilterCounts();
        this.setupAdvancedFilters();
    }
    
    addFilterCounts() {
        // Count occurrences for each filter type
        const counts = {
            genre: {},
            cuisine: {},
            decade: {},
            meal: {}
        };
        
        movieScenes.forEach(scene => {
            // Count genres
            scene.movie.genre.forEach(genre => {
                const key = genre.toLowerCase();
                counts.genre[key] = (counts.genre[key] || 0) + 1;
            });
            
            // Count cuisines
            const cuisineKey = scene.food.cuisine.toLowerCase();
            counts.cuisine[cuisineKey] = (counts.cuisine[cuisineKey] || 0) + 1;
            
            // Count decades
            const decade = Math.floor(scene.movie.year / 10) * 10 + 's';
            counts.decade[decade] = (counts.decade[decade] || 0) + 1;
            
            // Count meal types
            const mealKey = scene.food.mealType.toLowerCase();
            counts.meal[mealKey] = (counts.meal[mealKey] || 0) + 1;
        });
        
        // Update filter labels with counts
        document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
            const filterType = dropdown.dataset.filterDropdown;
            
            dropdown.querySelectorAll('label').forEach(label => {
                const checkbox = label.querySelector('input');
                const value = checkbox.value;
                const count = counts[filterType][value] || 0;
                
                if (count > 0) {
                    const countSpan = document.createElement('span');
                    countSpan.className = 'filter-count';
                    countSpan.textContent = `(${count})`;
                    label.appendChild(countSpan);
                }
            });
        });
    }
    
    setupAdvancedFilters() {
        // Add active filter badges
        const filterSection = document.querySelector('.filters-section .container');
        const activeBadgesContainer = document.createElement('div');
        activeBadgesContainer.className = 'active-filters';
        activeBadgesContainer.style.display = 'none';
        
        if (filterSection) {
            filterSection.appendChild(activeBadgesContainer);
        }
        
        // Listen for filter changes to update badges
        this.updateActiveBadges();
    }
    
    updateActiveBadges() {
        const container = document.querySelector('.active-filters');
        if (!container) return;
        
        const activeFilters = window.cinemaEats.activeFilters;
        const badges = [];
        
        Object.entries(activeFilters).forEach(([type, values]) => {
            values.forEach(value => {
                const displayValue = value.charAt(0).toUpperCase() + value.slice(1);
                badges.push(`
                    <span class="filter-badge" data-type="${type}" data-value="${value}">
                        ${displayValue}
                        <button class="remove-filter" aria-label="Remove filter">×</button>
                    </span>
                `);
            });
        });
        
        if (badges.length > 0) {
            container.innerHTML = badges.join('');
            container.style.display = 'flex';
            
            // Add click handlers to remove buttons
            container.querySelectorAll('.remove-filter').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const badge = e.target.closest('.filter-badge');
                    const type = badge.dataset.type;
                    const value = badge.dataset.value;
                    
                    // Uncheck the corresponding checkbox
                    const checkbox = document.querySelector(
                        `.filter-dropdown[data-filter-dropdown="${type}"] input[value="${value}"]`
                    );
                    if (checkbox) {
                        checkbox.checked = false;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
            });
        } else {
            container.style.display = 'none';
        }
    }
}

// Add filter styles
const filterStyles = `
<style>
.filter-count {
    margin-left: var(--spacing-xs);
    font-size: var(--text-xs);
    opacity: 0.6;
}

.active-filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-md);
    width: 100%;
}

.filter-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
    background-color: var(--color-primary);
    color: var(--color-white);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.remove-filter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: none;
    border: none;
    color: var(--color-white);
    font-size: var(--text-lg);
    line-height: 1;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity var(--transition-fast);
    padding: 0;
}

.remove-filter:hover {
    opacity: 1;
}

/* Sort options */
.sort-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-left: auto;
}

.sort-select {
    padding: var(--spacing-sm) var(--spacing-md);
    padding-right: var(--spacing-xl);
    background-color: var(--color-white);
    border: 1px solid var(--color-neutral-light);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2336454F' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right var(--spacing-sm) center;
    background-size: 16px;
}

@media (max-width: 768px) {
    .active-filters {
        order: 10;
    }
    
    .sort-container {
        width: 100%;
        margin-left: 0;
        margin-top: var(--spacing-sm);
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', filterStyles);

// Override the original handleFilterChange to update badges
const originalHandleFilterChange = window.cinemaEats?.handleFilterChange;
if (window.cinemaEats && originalHandleFilterChange) {
    window.cinemaEats.handleFilterChange = function(e) {
        originalHandleFilterChange.call(this, e);
        if (window.filterEnhancements) {
            window.filterEnhancements.updateActiveBadges();
        }
    };
}

// Initialize filter enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.filterEnhancements = new FilterEnhancements();
});