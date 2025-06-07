// Image optimization utilities
class ImageOptimizer {
    constructor() {
        this.qualitySettings = {
            thumbnail: 85,
            hero: 90,
            collection: 88
        };
        this.maxSizes = {
            thumbnail: 200 * 1024, // 200KB
            hero: 500 * 1024, // 500KB
            collection: 300 * 1024 // 300KB
        };
    }

    // Create WebP versions configuration
    generateWebPConfig() {
        return {
            scenes: {
                sizes: [400, 800, 1200],
                quality: this.qualitySettings.thumbnail
            },
            collections: {
                sizes: [600, 900],
                quality: this.qualitySettings.collection
            },
            hero: {
                sizes: [768, 1200, 1920],
                quality: this.qualitySettings.hero
            }
        };
    }

    // Generate picture element for responsive images
    createPictureElement(imagePath, alt, className = '') {
        const name = imagePath.substring(imagePath.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, '');
        const dir = imagePath.substring(0, imagePath.lastIndexOf('/'));
        
        return `
            <picture class="${className}">
                <source type="image/webp" 
                        srcset="${dir}/${name}-400w.webp 400w,
                                ${dir}/${name}-800w.webp 800w,
                                ${dir}/${name}-1200w.webp 1200w"
                        sizes="(max-width: 640px) 400px,
                               (max-width: 1024px) 800px,
                               1200px">
                <source type="image/jpeg" 
                        srcset="${dir}/${name}-400w.jpg 400w,
                                ${dir}/${name}-800w.jpg 800w,
                                ${dir}/${name}-1200w.jpg 1200w"
                        sizes="(max-width: 640px) 400px,
                               (max-width: 1024px) 800px,
                               1200px">
                <img src="${imagePath}" 
                     alt="${alt}"
                     loading="lazy"
                     decoding="async">
            </picture>
        `;
    }

    // Image processing pipeline configuration
    getProcessingPipeline() {
        return {
            resize: {
                width: 800,
                height: 450,
                fit: 'cover',
                position: 'center'
            },
            optimize: {
                mozjpeg: {
                    quality: 85,
                    progressive: true,
                    optimizeScans: true
                },
                webp: {
                    quality: 85,
                    method: 6,
                    alphaQuality: 100
                }
            },
            filmGrain: {
                overlay: 'multiply',
                opacity: 0.03,
                size: 1
            }
        };
    }

    // Batch processing configuration
    getBatchConfig() {
        return [
            {
                name: 'goodfellas-prison-dinner',
                adjustments: {
                    brightness: 1.05,
                    contrast: 1.1,
                    warmth: 1.2
                }
            },
            {
                name: 'ratatouille-final-dish',
                adjustments: {
                    saturation: 1.15,
                    brightness: 1.1
                }
            },
            {
                name: 'pulp-fiction-burger',
                adjustments: {
                    contrast: 1.2,
                    brightness: 0.95
                }
            },
            {
                name: 'julie-julia-bruschetta',
                adjustments: {
                    warmth: 1.15,
                    saturation: 1.1
                }
            },
            {
                name: 'spirited-away-feast',
                adjustments: {
                    saturation: 1.2,
                    brightness: 1.05
                }
            },
            {
                name: 'eat-pray-love-pizza',
                adjustments: {
                    warmth: 1.25,
                    saturation: 1.15
                }
            },
            {
                name: 'chef-pasta-aglio',
                adjustments: {
                    warmth: 1.2,
                    contrast: 1.05
                }
            },
            {
                name: 'big-night-timpano',
                adjustments: {
                    warmth: 1.3,
                    brightness: 1.1
                }
            },
            {
                name: 'tampopo-ramen',
                adjustments: {
                    contrast: 1.15,
                    saturation: 1.05
                }
            },
            {
                name: 'grand-budapest-pastries',
                adjustments: {
                    saturation: 1.25,
                    brightness: 1.15
                }
            }
        ];
    }

    // CLI commands for image processing
    getProcessingCommands() {
        return {
            // Using ImageMagick for basic processing
            resize: (input, output, width, height) => 
                `convert ${input} -resize ${width}x${height}^ -gravity center -crop ${width}x${height}+0+0 ${output}`,
            
            // Add film grain overlay
            addGrain: (input, output) =>
                `convert ${input} -attenuate 0.03 +noise Gaussian ${output}`,
            
            // Create WebP version
            toWebP: (input, output, quality = 85) =>
                `cwebp -q ${quality} ${input} -o ${output}`,
            
            // Optimize JPEG
            optimizeJPEG: (input, output, quality = 85) =>
                `jpegoptim --max=${quality} --strip-all --all-progressive ${input}`,
            
            // Create responsive sizes
            createSizes: (input, name, sizes) => {
                return sizes.map(size => ({
                    jpg: `convert ${input} -resize ${size}x -quality 85 ${name}-${size}w.jpg`,
                    webp: `cwebp -q 85 -resize ${size} 0 ${input} -o ${name}-${size}w.webp`
                }));
            }
        };
    }

    // Generate image processing script
    generateProcessingScript() {
        const commands = this.getProcessingCommands();
        const batch = this.getBatchConfig();
        
        let script = '#!/bin/bash\n\n';
        script += '# CinemaEats Image Processing Script\n\n';
        script += '# Create output directories\n';
        script += 'mkdir -p images/scenes/optimized\n';
        script += 'mkdir -p images/collections/optimized\n';
        script += 'mkdir -p images/hero/optimized\n\n';
        
        // Process each scene
        batch.forEach(scene => {
            script += `# Process ${scene.name}\n`;
            script += `echo "Processing ${scene.name}..."\n`;
            
            // Basic resize and crop
            script += commands.resize(
                `images/scenes/${scene.name}.jpg`,
                `images/scenes/optimized/${scene.name}.jpg`,
                800, 450
            ) + '\n';
            
            // Add film grain
            script += commands.addGrain(
                `images/scenes/optimized/${scene.name}.jpg`,
                `images/scenes/optimized/${scene.name}-grain.jpg`
            ) + '\n';
            
            // Create responsive sizes
            const sizes = [400, 800, 1200];
            sizes.forEach(size => {
                script += commands.resize(
                    `images/scenes/optimized/${scene.name}-grain.jpg`,
                    `images/scenes/optimized/${scene.name}-${size}w.jpg`,
                    size, Math.round(size * 0.5625)
                ) + '\n';
                
                script += commands.toWebP(
                    `images/scenes/optimized/${scene.name}-${size}w.jpg`,
                    `images/scenes/optimized/${scene.name}-${size}w.webp`,
                    85
                ) + '\n';
            });
            
            script += '\n';
        });
        
        return script;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageOptimizer;
}