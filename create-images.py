#!/usr/bin/env python3
import json
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random
import os

# Create directories
os.makedirs('images/generated/scenes', exist_ok=True)
os.makedirs('images/generated/collections', exist_ok=True)
os.makedirs('images/generated/hero', exist_ok=True)

# Summer color palette
colors = {
    'watermelon': (255, 107, 107),
    'sunshine': (255, 217, 61),
    'mint': (149, 225, 211),
    'salmon': (255, 160, 122),
    'picnic_red': (255, 139, 148),
    'grass': (168, 230, 207),
    'sky': (199, 206, 234),
    'cream': (255, 245, 235)
}

def create_gradient(size, color1, color2):
    """Create a gradient image"""
    width, height = size
    base = Image.new('RGB', size, color1)
    top = Image.new('RGB', size, color2)
    mask = Image.new('L', size)
    mask_data = []
    for y in range(height):
        mask_data.extend([int(255 * (y / height))] * width)
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def add_pattern(img, pattern_color, opacity=30):
    """Add a subtle pattern overlay"""
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Add dots pattern
    for x in range(0, img.width, 40):
        for y in range(0, img.height, 40):
            if random.random() > 0.5:
                draw.ellipse([x-3, y-3, x+3, y+3], fill=(*pattern_color, opacity))
    
    # Convert and blend
    img = img.convert('RGBA')
    return Image.alpha_composite(img, overlay).convert('RGB')

def create_scene_image(filename, title, color_scheme, icon_text):
    """Create a movie scene placeholder image"""
    size = (800, 450)
    
    # Create gradient background
    img = create_gradient(size, colors[color_scheme[0]], colors[color_scheme[1]])
    
    # Add pattern
    img = add_pattern(img, colors['cream'])
    
    # Add soft vignette
    draw = ImageDraw.Draw(img)
    
    # Add semi-transparent overlay for text area
    overlay = Image.new('RGBA', size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle([size[0]//4, size[1]//3, 3*size[0]//4, 2*size[1]//3], 
                          fill=(255, 255, 255, 40))
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    
    # Add text
    draw = ImageDraw.Draw(img)
    
    # Try to use a nice font, fallback to default if not available
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
        icon_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 72)
    except:
        title_font = ImageFont.load_default()
        icon_font = ImageFont.load_default()
    
    # Add icon
    icon_bbox = draw.textbbox((0, 0), icon_text, font=icon_font)
    icon_width = icon_bbox[2] - icon_bbox[0]
    icon_x = (size[0] - icon_width) // 2
    draw.text((icon_x, size[1]//3 - 40), icon_text, fill=(255, 255, 255), font=icon_font)
    
    # Add title (handle multi-line)
    lines = title.split('\\n')
    y_offset = size[1]//2
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=title_font)
        text_width = bbox[2] - bbox[0]
        x = (size[0] - text_width) // 2
        draw.text((x, y_offset), line, fill=(255, 255, 255), font=title_font)
        y_offset += 45
    
    # Add subtle border
    draw.rectangle([20, 20, size[0]-20, size[1]-20], outline=(255, 255, 255, 128), width=3)
    
    # Apply slight blur for softer look
    img = img.filter(ImageFilter.SMOOTH_MORE)
    
    return img

def create_hero_image():
    """Create the hero banner image"""
    size = (1920, 800)
    
    # Create sunset gradient
    img = create_gradient(size, colors['sunshine'], colors['picnic_red'])
    
    # Add pattern
    img = add_pattern(img, colors['cream'], opacity=20)
    
    # Add text overlay area
    overlay = Image.new('RGBA', size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle([size[0]//4, size[1]//3, 3*size[0]//4, 2*size[1]//3], 
                          fill=(255, 255, 255, 30))
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    
    # Add text
    draw = ImageDraw.Draw(img)
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 96)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # Title
    title = "FOOD IN MOVIES"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    text_width = bbox[2] - bbox[0]
    draw.text(((size[0] - text_width) // 2, size[1]//3), title, fill=(255, 255, 255), font=title_font)
    
    # Subtitle
    subtitle = "Discover Iconic Food Scenes from Cinema"
    bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    text_width = bbox[2] - bbox[0]
    draw.text(((size[0] - text_width) // 2, size[1]//2 + 20), subtitle, fill=(255, 255, 255), font=subtitle_font)
    
    # Icons
    icons = "🍿 🍕 🍝 🍔 🍱 🍷 🥐 🍜"
    bbox = draw.textbbox((0, 0), icons, font=subtitle_font)
    text_width = bbox[2] - bbox[0]
    draw.text(((size[0] - text_width) // 2, 2*size[1]//3), icons, fill=(255, 255, 255), font=subtitle_font)
    
    return img

# Generate images
print("Generating hero image...")
hero = create_hero_image()
hero.save('images/generated/hero/hero-summer.jpg', quality=90)

# Scene data
scenes = [
    ('goodfellas-prison-dinner', 'Goodfellas\\nPrison Dinner', ['watermelon', 'salmon'], '🍝'),
    ('ratatouille-final-dish', 'Ratatouille\\nFinal Dish', ['mint', 'grass'], '🍲'),
    ('pulp-fiction-burger', 'Pulp Fiction\\nBig Kahuna Burger', ['sunshine', 'salmon'], '🍔'),
    ('julie-julia-bruschetta', 'Julie & Julia\\nBruschetta', ['picnic_red', 'salmon'], '🥖'),
    ('spirited-away-feast', 'Spirited Away\\nFeast Scene', ['sky', 'mint'], '🍱'),
    ('chef-pasta-aglio', 'Chef\\nPasta Aglio e Olio', ['grass', 'sunshine'], '🍳'),
    ('big-night-timpano', 'Big Night\\nTimpano', ['watermelon', 'picnic_red'], '🥘'),
    ('tampopo-ramen', 'Tampopo\\nRamen Scene', ['salmon', 'sunshine'], '🍜'),
    ('grand-budapest-pastries', 'Grand Budapest\\nMendl\'s Pastries', ['sky', 'picnic_red'], '🧁'),
    ('eat-pray-love-pizza', 'Eat Pray Love\\nPizza in Rome', ['watermelon', 'sunshine'], '🍕'),
]

# Collections
collections = [
    ('collection-comfort-food', 'Comfort Food\\nCollection', ['salmon', 'sunshine'], '🍕'),
    ('collection-date-night', 'Date Night\\nCollection', ['picnic_red', 'sky'], '🍷'),
    ('collection-international', 'International\\nCuisine', ['mint', 'grass'], '🌍'),
    ('collection-oscar-winners', 'Oscar Winners\\nCollection', ['sunshine', 'watermelon'], '🏆'),
]

print("Generating scene images...")
for filename, title, color_scheme, icon in scenes:
    img = create_scene_image(filename, title, color_scheme, icon)
    img.save(f'images/generated/scenes/{filename}.jpg', quality=85)
    print(f"Created: {filename}.jpg")

print("Generating collection images...")
for filename, title, color_scheme, icon in collections:
    img = create_scene_image(filename, title, color_scheme, icon)
    img.save(f'images/generated/collections/{filename}.jpg', quality=85)
    print(f"Created: {filename}.jpg")

print("\nAll images generated successfully!")
print("Images saved in: images/generated/")