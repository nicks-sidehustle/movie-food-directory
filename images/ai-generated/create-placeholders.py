#!/usr/bin/env python3
"""
Create SVG placeholder images for all required movie scenes and collections.
These can be used immediately while AI-generated images are being created.
"""

import json
import os
from pathlib import Path

def create_svg_placeholder(title, subtitle, width, height, color_scheme='default'):
    """Create an SVG placeholder with movie/food styling"""
    
    # Color schemes
    colors = {
        'default': {'bg': '#2c3e50', 'accent': '#e74c3c', 'text': '#ecf0f1'},
        'romantic': {'bg': '#c0392b', 'accent': '#f39c12', 'text': '#fff'},
        'international': {'bg': '#16a085', 'accent': '#f39c12', 'text': '#fff'},
        'comfort': {'bg': '#d35400', 'accent': '#e67e22', 'text': '#fff'},
        'luxury': {'bg': '#2c3440', 'accent': '#f1c40f', 'text': '#fff'}
    }
    
    scheme = colors.get(color_scheme, colors['default'])
    
    svg = f'''<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{scheme['bg']};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{scheme['accent']};stop-opacity:0.8" />
    </linearGradient>
    <filter id="shadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="2" dy="2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.5"/>
      </feComponentTransfer>
      <feMerge> 
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/> 
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="{width}" height="{height}" fill="url(#grad1)"/>
  
  <!-- Film strip decoration -->
  <g opacity="0.3">
    <rect x="0" y="0" width="40" height="{height}" fill="{scheme['text']}"/>
    <rect x="{width-40}" y="0" width="40" height="{height}" fill="{scheme['text']}"/>
    
    <!-- Film perforations -->
    {"".join([f'<rect x="10" y="{20 + i*40}" width="20" height="25" rx="2" fill="{scheme["bg"]}"/>' for i in range(height//40)])}
    {"".join([f'<rect x="{width-30}" y="{20 + i*40}" width="20" height="25" rx="2" fill="{scheme["bg"]}"/>' for i in range(height//40)])}
  </g>
  
  <!-- Central icon -->
  <g transform="translate({width//2}, {height//2})">
    <!-- Plate -->
    <circle cx="0" cy="0" r="80" fill="{scheme['text']}" opacity="0.2"/>
    <circle cx="0" cy="0" r="70" fill="none" stroke="{scheme['text']}" stroke-width="2" opacity="0.5"/>
    
    <!-- Fork and knife -->
    <path d="M-30,-40 L-30,40 M-35,-35 L-30,-30 M-25,-35 L-30,-30" 
          stroke="{scheme['text']}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
    <path d="M30,-40 L30,40 M30,-35 Q35,-30 30,-25" 
          stroke="{scheme['text']}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
  </g>
  
  <!-- Text -->
  <text x="{width//2}" y="{height-120}" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
        text-anchor="middle" fill="{scheme['text']}" filter="url(#shadow)">
    {title}
  </text>
  <text x="{width//2}" y="{height-80}" font-family="Arial, sans-serif" font-size="20" 
        text-anchor="middle" fill="{scheme['text']}" opacity="0.8">
    {subtitle}
  </text>
  
  <!-- Corner accent -->
  <path d="M0,{height-100} Q0,{height} 100,{height} L0,{height} Z" fill="{scheme['accent']}" opacity="0.5"/>
  <path d="M{width},{height-100} Q{width},{height} {width-100},{height} L{width},{height} Z" fill="{scheme['accent']}" opacity="0.5"/>
</svg>'''
    
    return svg

# Load the prompts data
with open('image-generation-prompts.json', 'r') as f:
    prompts_data = json.loads(f.read())

# Create directories
scenes_dir = Path('../scenes')
collections_dir = Path('../collections')
scenes_dir.mkdir(exist_ok=True, parents=True)
collections_dir.mkdir(exist_ok=True, parents=True)

print("Creating placeholder images...")

# Create scene placeholders
for scene in prompts_data['scenes']:
    filename = scene['filename'].replace('.jpg', '-placeholder.svg')
    svg_content = create_svg_placeholder(
        scene['movie'],
        scene['scene'],
        1200, 800
    )
    
    filepath = scenes_dir / filename
    with open(filepath, 'w') as f:
        f.write(svg_content)
    
    print(f"Created: {filepath}")

# Create collection placeholders with themed colors
collection_colors = {
    'Date Night': 'romantic',
    'International Cuisine': 'international', 
    'Comfort Food': 'comfort',
    'Oscar Winners': 'luxury'
}

for collection in prompts_data['collections']:
    filename = collection['filename'].replace('.jpg', '-placeholder.svg')
    color_scheme = collection_colors.get(collection['title'], 'default')
    
    svg_content = create_svg_placeholder(
        collection['title'],
        'Collection',
        1600, 900,
        color_scheme
    )
    
    filepath = collections_dir / filename
    with open(filepath, 'w') as f:
        f.write(svg_content)
    
    print(f"Created: {filepath}")

print("\nPlaceholder creation complete!")
print("These SVG files can be used immediately while AI images are being generated.")