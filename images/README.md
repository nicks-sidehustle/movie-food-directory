# Image Directory Structure

## Naming Conventions

### Scene Images
Format: `{movie-slug}-{scene-description}.jpg`
- Example: `goodfellas-prison-dinner.jpg`
- Size: 800x450px (16:9 aspect ratio)
- WebP version: `{filename}.webp`

### Collection Images
Format: `collection-{name}.jpg`
- Example: `collection-oscar-winners.jpg`
- Size: 600x800px (3:4 aspect ratio)

### Hero Images
- Desktop: `hero-desktop.jpg` (1920x1080px)
- Mobile: `hero-mobile.jpg` (1200x675px)

### Placeholders
- Scene placeholder: `placeholder-scene.svg`
- Collection placeholder: `placeholder-collection.svg`

## Directory Structure
```
images/
├── scenes/          # Movie scene thumbnails
├── collections/     # Collection cover images
├── hero/           # Hero section images
├── placeholders/   # Fallback images
└── README.md       # This file
```

## Image Processing Guidelines
1. Maintain consistent color grading
2. Apply subtle film grain overlay
3. Ensure text readability on overlays
4. Compress to <200KB for thumbnails
5. Create WebP versions for modern browsers