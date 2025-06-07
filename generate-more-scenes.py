#!/usr/bin/env python3
"""
Generate additional scene images for the movie food directory
"""
import requests
import time
import os
from pathlib import Path

# API key - use environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')

if not OPENAI_API_KEY:
    print("Please set OPENAI_API_KEY environment variable")
    exit(1)

# Create directory
Path('images/real-images/scenes').mkdir(parents=True, exist_ok=True)

def generate_image(prompt, filename):
    """Generate an image using DALL-E API"""
    headers = {
        'Authorization': f'Bearer {OPENAI_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    data = {
        'model': 'dall-e-3',
        'prompt': prompt,
        'n': 1,
        'size': '1792x1024',
        'quality': 'hd'
    }
    
    print(f"Generating: {filename}")
    response = requests.post('https://api.openai.com/v1/images/generations', 
                           headers=headers, json=data)
    
    if response.status_code == 200:
        image_url = response.json()['data'][0]['url']
        
        # Download the image
        img_response = requests.get(image_url)
        if img_response.status_code == 200:
            with open(filename, 'wb') as f:
                f.write(img_response.content)
            print(f"✓ Saved: {filename}")
            return True
        else:
            print(f"✗ Failed to download: {filename}")
            return False
    else:
        print(f"✗ API Error for {filename}: {response.text}")
        return False

# Additional scene images
scenes = [
    {
        'prompt': 'Photorealistic elaborate Japanese feast with various colorful dishes, sushi, tempura, dumplings, and traditional Japanese foods artfully arranged on a long wooden table. Rich colors, steam rising from hot dishes, warm restaurant lighting, Studio Ghibli-inspired but photorealistic style.',
        'filename': 'images/real-images/scenes/spirited-away-feast.jpg'
    },
    {
        'prompt': 'Photorealistic scene of hands tossing spaghetti aglio e olio in a pan with golden olive oil, visible garlic slices, and red pepper flakes. Steam rising, warm kitchen lighting, intimate cooking moment with fresh parsley and parmesan cheese visible nearby.',
        'filename': 'images/real-images/scenes/chef-pasta-aglio.jpg'
    },
    {
        'prompt': 'Photorealistic massive timpano (drum-shaped pasta dish) being cut open revealing layers of pasta, eggs, meatballs, and rich tomato sauce inside. 1950s Italian restaurant kitchen setting, warm tungsten lighting, chefs in white uniforms watching with anticipation.',
        'filename': 'images/real-images/scenes/big-night-timpano.jpg'
    }
]

print(f"Generating {len(scenes)} additional scene images...")

for i, scene in enumerate(scenes):
    print(f"\nProgress: {i+1}/{len(scenes)}")
    if generate_image(scene['prompt'], scene['filename']):
        print("Success!")
    else:
        print("Failed!")
    
    # Wait a bit between requests
    if i < len(scenes) - 1:
        time.sleep(2)

print("\nAdditional scene generation complete!")