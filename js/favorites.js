// Favorites functionality with local storage
class FavoritesManager {
    constructor() {
        this.storageKey = 'foodInMoviesFavorites';
        this.favorites = this.loadFavorites();
        this.init();
    }
    
    init() {
        this.updateFavoriteButtons();
        this.setupEventListeners();
        this.createFavoritesCounter();
    }
    
    loadFavorites() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }
    
    saveFavorites() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
            this.updateFavoritesCounter();
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }
    
    setupEventListeners() {
        // Delegate click events for favorite buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) {
                e.preventDefault();
                const btn = e.target.closest('.favorite-btn');
                const card = btn.closest('.content-card');
                const sceneId = card?.dataset.sceneId;
                
                if (sceneId) {
                    this.toggleFavorite(sceneId, btn);
                }
            }
        });
        
        // Handle mobile nav favorites click
        const mobileFavoritesLink = document.querySelector('.mobile-nav-item[href="#favorites"]');
        if (mobileFavoritesLink) {
            mobileFavoritesLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showFavoritesModal();
            });
        }
    }
    
    toggleFavorite(sceneId, button) {
        const index = this.favorites.indexOf(sceneId);
        
        if (index > -1) {
            // Remove from favorites
            this.favorites.splice(index, 1);
            button.classList.remove('active');
            this.showToast('Removed from favorites');
        } else {
            // Add to favorites
            this.favorites.push(sceneId);
            button.classList.add('active');
            this.showToast('Added to favorites');
            this.animateFavoriteButton(button);
        }
        
        this.saveFavorites();
    }
    
    updateFavoriteButtons() {
        document.querySelectorAll('.content-card').forEach(card => {
            const sceneId = card.dataset.sceneId;
            const favoriteBtn = card.querySelector('.favorite-btn');
            
            if (favoriteBtn && this.favorites.includes(sceneId)) {
                favoriteBtn.classList.add('active');
            }
        });
    }
    
    animateFavoriteButton(button) {
        // Create heart burst animation
        const burst = document.createElement('div');
        burst.className = 'favorite-burst';
        button.appendChild(burst);
        
        // Create mini hearts
        for (let i = 0; i < 6; i++) {
            const heart = document.createElement('span');
            heart.className = 'mini-heart';
            heart.style.setProperty('--angle', `${i * 60}deg`);
            burst.appendChild(heart);
        }
        
        // Remove after animation
        setTimeout(() => burst.remove(), 1000);
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    createFavoritesCounter() {
        const nav = document.querySelector('.nav-menu');
        if (!nav) return;
        
        const favoritesLink = document.createElement('li');
        favoritesLink.innerHTML = `
            <a href="#favorites" class="nav-link favorites-link">
                Favorites
                <span class="favorites-counter" ${this.favorites.length === 0 ? 'style="display: none;"' : ''}>
                    ${this.favorites.length}
                </span>
            </a>
        `;
        
        nav.appendChild(favoritesLink);
        
        // Add click handler
        favoritesLink.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            this.showFavoritesModal();
        });
    }
    
    updateFavoritesCounter() {
        const counter = document.querySelector('.favorites-counter');
        if (counter) {
            counter.textContent = this.favorites.length;
            counter.style.display = this.favorites.length > 0 ? 'inline-flex' : 'none';
        }
        
        // Update mobile nav badge
        const mobileFavoritesLink = document.querySelector('.mobile-nav-item[href="#favorites"]');
        if (mobileFavoritesLink) {
            const existingBadge = mobileFavoritesLink.querySelector('.mobile-badge');
            if (this.favorites.length > 0) {
                if (!existingBadge) {
                    const badge = document.createElement('span');
                    badge.className = 'mobile-badge';
                    badge.textContent = this.favorites.length;
                    mobileFavoritesLink.appendChild(badge);
                } else {
                    existingBadge.textContent = this.favorites.length;
                }
            } else if (existingBadge) {
                existingBadge.remove();
            }
        }
    }
    
    showFavoritesModal() {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'favorites-modal';
        
        const favoriteScenes = this.favorites.map(id => 
            movieScenes.find(scene => scene.id === id)
        ).filter(Boolean);
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>My Favorite Scenes</h2>
                    <button class="modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="modal-body">
                    ${favoriteScenes.length === 0 ? `
                        <div class="empty-favorites">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <p>No favorites yet!</p>
                            <p>Click the heart icon on any scene to add it to your favorites.</p>
                        </div>
                    ` : `
                        <div class="favorites-grid">
                            ${favoriteScenes.map(scene => this.createFavoriteCard(scene)).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Show modal with animation
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
        
        // Setup close handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeFavoritesModal(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeFavoritesModal(modal);
            }
        });
        
        // Handle remove buttons
        modal.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sceneId = e.currentTarget.dataset.sceneId;
                this.removeFavoriteFromModal(sceneId, modal);
            });
        });
    }
    
    createFavoriteCard(scene) {
        return `
            <div class="favorite-card" data-scene-id="${scene.id}">
                <img src="${scene.scene.thumbnailUrl}" alt="${scene.movie.title}">
                <div class="favorite-card-content">
                    <h3>${scene.movie.title}</h3>
                    <p>${scene.scene.foodItems[0]}</p>
                    <button class="remove-favorite" data-scene-id="${scene.id}" aria-label="Remove from favorites">
                        Remove
                    </button>
                </div>
            </div>
        `;
    }
    
    removeFavoriteFromModal(sceneId, modal) {
        const index = this.favorites.indexOf(sceneId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            
            // Update the card in the grid
            const mainCard = document.querySelector(`.content-card[data-scene-id="${sceneId}"] .favorite-btn`);
            if (mainCard) {
                mainCard.classList.remove('active');
            }
            
            // Remove from modal
            const favoriteCard = modal.querySelector(`.favorite-card[data-scene-id="${sceneId}"]`);
            if (favoriteCard) {
                favoriteCard.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    favoriteCard.remove();
                    
                    // Check if empty
                    const remainingCards = modal.querySelectorAll('.favorite-card');
                    if (remainingCards.length === 0) {
                        modal.querySelector('.modal-body').innerHTML = `
                            <div class="empty-favorites">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                <p>No favorites yet!</p>
                                <p>Click the heart icon on any scene to add it to your favorites.</p>
                            </div>
                        `;
                    }
                }, 300);
            }
            
            this.showToast('Removed from favorites');
        }
    }
    
    closeFavoritesModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Add favorites styles
const favoritesStyles = `
<style>
/* Favorite button animations */
.favorite-btn {
    position: relative;
}

.favorite-btn.active svg {
    fill: var(--color-primary);
    stroke: var(--color-primary);
}

.favorite-burst {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
}

.mini-heart {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--color-primary);
    transform: rotate(45deg);
    animation: burst 0.8s ease-out;
}

.mini-heart::before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--color-primary);
    border-radius: 50%;
    top: -4px;
    left: 0;
}

.mini-heart::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--color-primary);
    border-radius: 50%;
    top: 0;
    left: -4px;
}

@keyframes burst {
    0% {
        opacity: 1;
        transform: rotate(45deg) translate(0) scale(0);
    }
    100% {
        opacity: 0;
        transform: rotate(45deg) translate(var(--angle)) scale(1);
    }
}

/* Toast notifications */
.toast {
    position: fixed;
    bottom: calc(var(--mobile-nav-height) + var(--spacing-xl));
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background-color: var(--color-neutral-dark);
    color: var(--color-white);
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    z-index: var(--z-tooltip);
    opacity: 0;
    transition: all var(--transition-base);
}

.toast.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
}

/* Favorites counter */
.favorites-counter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 var(--spacing-xs);
    background-color: var(--color-primary);
    color: var(--color-white);
    font-size: var(--text-xs);
    border-radius: var(--radius-full);
    margin-left: var(--spacing-xs);
}

.mobile-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    background-color: var(--color-primary);
    color: var(--color-white);
    font-size: 10px;
    border-radius: var(--radius-full);
}

/* Favorites modal */
.favorites-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    opacity: 0;
    transition: opacity var(--transition-base);
    padding: var(--spacing-lg);
}

.favorites-modal.show {
    opacity: 1;
}

.modal-content {
    background-color: var(--color-white);
    border-radius: var(--radius-lg);
    max-width: 800px;
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    transform: scale(0.9);
    transition: transform var(--transition-base);
}

.favorites-modal.show .modal-content {
    transform: scale(1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-neutral-light);
}

.modal-header h2 {
    margin: 0;
    color: var(--color-primary);
}

.modal-close {
    font-size: var(--text-2xl);
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-fast);
}

.modal-close:hover {
    background-color: var(--color-neutral-light);
}

.modal-body {
    padding: var(--spacing-lg);
    overflow-y: auto;
    flex: 1;
}

.empty-favorites {
    text-align: center;
    padding: var(--spacing-3xl) var(--spacing-lg);
    color: #666;
}

.empty-favorites svg {
    stroke: var(--color-neutral-light);
    margin-bottom: var(--spacing-lg);
}

.favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-md);
}

.favorite-card {
    background-color: var(--color-neutral-light);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: transform var(--transition-base);
}

.favorite-card:hover {
    transform: translateY(-2px);
}

.favorite-card img {
    width: 100%;
    height: 120px;
    object-fit: cover;
}

.favorite-card-content {
    padding: var(--spacing-sm);
}

.favorite-card h3 {
    font-size: var(--text-base);
    margin-bottom: var(--spacing-xs);
}

.favorite-card p {
    font-size: var(--text-sm);
    color: var(--color-accent);
    margin-bottom: var(--spacing-sm);
}

.remove-favorite {
    font-size: var(--text-xs);
    color: var(--color-primary);
    text-decoration: underline;
    transition: opacity var(--transition-fast);
}

.remove-favorite:hover {
    opacity: 0.7;
}

@keyframes fadeOut {
    to {
        opacity: 0;
        transform: scale(0.9);
    }
}

@media (max-width: 768px) {
    .favorites-modal {
        padding: 0;
    }
    
    .modal-content {
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        max-height: 90vh;
        margin-top: auto;
    }
    
    .toast {
        bottom: calc(var(--mobile-nav-height) + var(--spacing-md));
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', favoritesStyles);

// Initialize favorites when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.favoritesManager = new FavoritesManager();
    
    // Update buttons when new content is loaded
    const originalRenderScenes = window.cinemaEats?.renderScenes;
    if (window.cinemaEats && originalRenderScenes) {
        window.cinemaEats.renderScenes = function() {
            originalRenderScenes.call(this);
            setTimeout(() => {
                window.favoritesManager.updateFavoriteButtons();
            }, 100);
        };
    }
});