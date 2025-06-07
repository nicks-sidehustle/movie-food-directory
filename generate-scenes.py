#!/usr/bin/env python3
"""
Generate scene images for the movie food directory
"""
import requests
import time
from pathlib import Path

# API key - set your OpenAI API key here or use environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'your-api-key-here')

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

# Key scene images
scenes = [
    {
        'prompt': 'Photorealistic beautifully plated ratatouille dish with perfectly arranged colorful vegetables (zucchini, eggplant, tomatoes, bell peppers) in concentric circles on an elegant white plate. Fine dining restaurant setting, warm ambient lighting, shallow depth of field, professional food photography style.',
        'filename': 'images/real-images/scenes/ratatouille-final-dish.jpg'
    },
    {
        'prompt': 'Photorealistic gourmet burger with visible beef patty, cheese, lettuce, and special sauce on a sesame bun. Served on a white plate with golden french fries. Natural daylight from window, dramatic angles, high contrast photography style.',
        'filename': 'images/real-images/scenes/pulp-fiction-burger.jpg'
    },
    {
        'prompt': 'Photorealistic Italian pasta dinner scene with hands preparing fresh pasta, basil, tomatoes, and garlic on a rustic wooden table. Warm golden lighting, steam rising from cooking, cinematic composition focused on the cooking process.',
        'filename': 'images/real-images/scenes/goodfellas-prison-dinner.jpg'
    },
    {
        'prompt': 'Photorealistic hands preparing bruschetta with fresh tomatoes, basil, and garlic on toasted bread in a charming kitchen. Natural window light, warm and inviting atmosphere, cookbook visible in background.',
        'filename': 'images/real-images/scenes/julie-julia-bruschetta.jpg'
    }
]

print(f"Generating {len(scenes)} scene images...")

for i, scene in enumerate(scenes):
    print(f"\nProgress: {i+1}/{len(scenes)}")
    if generate_image(scene['prompt'], scene['filename']):
        print("Success!")
    else:
        print("Failed!")
    
    # Wait a bit between requests
    if i < len(scenes) - 1:
        time.sleep(2)

print("\nScene image generation complete!")