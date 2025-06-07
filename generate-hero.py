#!/usr/bin/env python3
"""
Generate hero image for the movie food directory
"""
import requests
import os
from pathlib import Path

# API key - set your OpenAI API key here or use environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'your-api-key-here')

# Create directory
Path('images/real-images/hero').mkdir(parents=True, exist_ok=True)

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

# Generate hero image
prompt = 'Photorealistic outdoor summer movie night scene with a picnic spread in the foreground. String lights hanging above creating warm ambiance, a movie screen visible in the soft-focus background. The picnic blanket has colorful dishes including fresh salads, grilled foods, popcorn in striped boxes, fresh fruit, and refreshing drinks. Golden hour sunset lighting with warm oranges, pinks, and yellows. Cinematic composition, shallow depth of field focusing on the delicious food spread.'

if generate_image(prompt, 'images/real-images/hero/hero-summer-movie-night.jpg'):
    print("Hero image generated successfully!")
else:
    print("Failed to generate hero image")