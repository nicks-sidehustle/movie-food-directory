#!/usr/bin/env python3
"""
Generate collection images for the movie food directory
"""
import requests
import time
from pathlib import Path

# API key - set your OpenAI API key here or use environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'your-api-key-here')

# Create directory
Path('images/real-images/collections').mkdir(parents=True, exist_ok=True)

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

# Collection images
collections = [
    {
        'prompt': 'Photorealistic comfort food collection with mac and cheese, grilled cheese sandwich, pizza slice, chocolate chip cookies arranged on a cozy wooden table. Warm home kitchen lighting, nostalgic and inviting atmosphere with steam rising from hot dishes.',
        'filename': 'images/real-images/collections/collection-comfort-food.jpg'
    },
    {
        'prompt': 'Photorealistic romantic restaurant scene with candlelit table, wine glasses, elegant plated dishes, rose petals scattered around. Soft warm lighting, intimate dining atmosphere, couple sharing dessert in soft focus background.',
        'filename': 'images/real-images/collections/collection-date-night.jpg'
    }
]

print(f"Generating {len(collections)} collection images...")

for i, collection in enumerate(collections):
    print(f"\nProgress: {i+1}/{len(collections)}")
    if generate_image(collection['prompt'], collection['filename']):
        print("Success!")
    else:
        print("Failed!")
    
    # Wait a bit between requests
    if i < len(collections) - 1:
        time.sleep(2)

print("\nCollection image generation complete!")