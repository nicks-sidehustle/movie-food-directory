// Image loading and optimization functionality
class ImageLoader {
    constructor() {
        this.loadedImages = new Set();
        this.imageObserver = null;
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.setupImageErrorHandling();
        this.addSkeletonStyles();
    }
    
    setupLazyLoading() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Start loading 50px before entering viewport
                threshold: 0.01
            });
            
            // Start observing images
            this.observeImages();
        } else {
            // Fallback: load all images immediately
            this.loadAllImages();
        }
    }
    
    observeImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            // Add skeleton loading state
            this.addSkeletonState(img);
            this.imageObserver.observe(img);
        });
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        if (!src) return;
        
        // Create a new image to preload
        const newImg = new Image();
        
        newImg.onload = () => {
            // Apply blur-up effect if low quality placeholder exists
            if (img.dataset.placeholder) {
                img.style.filter = 'blur(5px)';
                img.style.transition = 'filter 0.3s ease-out';
            }
            
            // Set the actual image sources
            if (srcset) {
                img.srcset = srcset;
            }
            img.src = src;
            
            // Remove skeleton state and blur
            requestAnimationFrame(() => {
                img.classList.remove('skeleton-img');
                img.style.filter = '';
                img.classList.add('loaded');
                
                // Mark as loaded
                this.loadedImages.add(src);
                
                // Add film grain overlay if it's a scene image
                if (img.classList.contains('scene-image')) {
                    this.addFilmGrain(img);
                }
            });
        };
        
        newImg.onerror = () => {
            this.handleImageError(img);
        };
        
        // Start loading
        newImg.src = src;
    }
    
    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.loadImage(img));
    }
    
    addSkeletonState(img) {
        img.classList.add('skeleton-img');
        
        // Set dimensions based on aspect ratio
        if (img.classList.contains('scene-image')) {
            img.style.aspectRatio = '16/9';
        } else if (img.classList.contains('collection-image')) {
            img.style.aspectRatio = '3/4';
        }
    }
    
    handleImageError(img) {
        const fallbackSrc = img.dataset.fallback;
        const placeholderType = img.dataset.placeholderType || 'scene';
        
        if (fallbackSrc && !img.dataset.fallbackUsed) {
            // Try fallback image
            img.dataset.fallbackUsed = 'true';
            img.dataset.src = fallbackSrc;
            this.loadImage(img);
        } else {
            // Use SVG placeholder
            const placeholderPath = `/images/placeholders/placeholder-${placeholderType}.svg`;
            img.src = placeholderPath;
            img.classList.remove('skeleton-img');
            img.classList.add('placeholder-img');
            
            // Add attribution as overlay
            if (img.dataset.attribution) {
                this.addAttributionOverlay(img);
            }
        }
    }
    
    addFilmGrain(img) {
        const container = img.closest('.card-image, .hero-image');
        if (container && !container.querySelector('.film-grain')) {
            const grain = document.createElement('div');
            grain.className = 'film-grain';
            container.appendChild(grain);
        }
    }
    
    addAttributionOverlay(img) {
        const container = img.closest('.card-image, .collection-image');
        if (container && img.dataset.attribution) {
            const attribution = document.createElement('div');
            attribution.className = 'image-attribution';
            attribution.textContent = img.dataset.attribution;
            container.appendChild(attribution);
        }
    }
    
    setupImageErrorHandling() {
        // Global error handler for images
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);
    }
    
    addSkeletonStyles() {
        if (document.getElementById('skeleton-styles')) return;
        
        const styles = `
            <style id="skeleton-styles">
                .skeleton-img {
                    background: linear-gradient(
                        90deg,
                        #f0f0f0 25%,
                        #e0e0e0 50%,
                        #f0f0f0 75%
                    );
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s infinite;
                }
                
                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                
                img.loaded {
                    animation: fadeIn 0.3s ease-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .film-grain {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    opacity: 0.03;
                    pointer-events: none;
                    background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
                    mix-blend-mode: overlay;
                }
                
                .image-attribution {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: var(--spacing-xs) var(--spacing-sm);
                    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
                    color: white;
                    font-size: var(--text-xs);
                    opacity: 0;
                    transition: opacity var(--transition-base);
                }
                
                .card-image:hover .image-attribution,
                .collection-image:hover .image-attribution {
                    opacity: 1;
                }
                
                .placeholder-img {
                    opacity: 0.5;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Helper method to generate srcset for responsive images
    generateSrcset(basePath, sizes = [400, 800, 1200]) {
        const ext = basePath.split('.').pop();
        const name = basePath.replace(`.${ext}`, '');
        
        return sizes.map(size => {
            return `${name}-${size}w.${ext} ${size}w`;
        }).join(', ');
    }
    
    // Convert image URLs to use placeholders and lazy loading
    prepareImageElement(src, alt, className, attribution = null) {
        const img = document.createElement('img');
        img.className = className;
        img.alt = alt;
        
        // Use placeholder as immediate src
        const placeholderType = className.includes('collection') ? 'collection' : 'scene';
        img.src = `/images/placeholders/placeholder-${placeholderType}.svg`;
        
        // Set lazy loading attributes
        img.dataset.src = src;
        img.dataset.srcset = this.generateSrcset(src);
        img.dataset.placeholderType = placeholderType;
        
        // Add WebP fallback
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        img.dataset.fallback = src;
        img.dataset.src = webpSrc;
        
        // Add attribution if provided
        if (attribution) {
            img.dataset.attribution = attribution;
        }
        
        img.loading = 'lazy';
        
        return img;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.imageLoader = new ImageLoader();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageLoader;
}