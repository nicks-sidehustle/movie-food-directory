#!/usr/bin/env python3
"""
Generate real AI images for the movie food directory using OpenAI's DALL-E API
"""
import requests
import os
from pathlib import Path

# Set your OpenAI API key here or in environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')

if not OPENAI_API_KEY:
    print("Please set your OpenAI API key:")
    print("export OPENAI_API_KEY='your-api-key-here'")
    print("Or set it in this script")
    exit(1)

# Create directories
Path('images/real-images/scenes').mkdir(parents=True, exist_ok=True)
Path('images/real-images/collections').mkdir(parents=True, exist_ok=True)
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

# Image prompts
images_to_generate = [
    # Hero image
    {
        'prompt': 'Photorealistic outdoor summer movie night scene with a picnic spread in the foreground. String lights hanging above creating warm ambiance, a movie screen visible in the soft-focus background. The picnic blanket has colorful dishes including fresh salads, grilled foods, popcorn in striped boxes, fresh fruit, and refreshing drinks. Golden hour sunset lighting with warm oranges, pinks, and yellows. Cinematic composition, shallow depth of field focusing on the delicious food spread.',
        'filename': 'images/real-images/hero/hero-summer-movie-night.jpg'
    },
    
    # Scene images
    {
        'prompt': 'Photorealistic Italian prison dinner scene with hands slicing garlic paper-thin, fresh tomatoes, basil, and pasta ingredients spread on a metal table. Warm golden lighting, steam rising from cooking pots, cinematic composition. Focus on the preparation of an elaborate Italian feast.',
        'filename': 'images/real-images/scenes/goodfellas-prison-dinner.jpg'
    },
    {
        'prompt': 'Photorealistic beautifully plated ratatouille dish with perfectly arranged colorful vegetables (zucchini, eggplant, tomatoes, bell peppers) in concentric circles on an elegant white plate. Fine dining restaurant setting, warm ambient lighting, shallow depth of field, professional food photography style.',
        'filename': 'images/real-images/scenes/ratatouille-final-dish.jpg'
    },
    {
        'prompt': 'Photorealistic gourmet burger with visible beef patty, cheese, lettuce, and special sauce on a sesame bun. Served on a white plate with golden french fries. Natural daylight from window, dramatic angles, high contrast photography style reminiscent of 90s cinematography.',
        'filename': 'images/real-images/scenes/pulp-fiction-burger.jpg'
    },
    {
        'prompt': 'Photorealistic hands preparing bruschetta with fresh tomatoes, basil, and garlic on toasted bread in a charming kitchen. Natural window light, warm and inviting atmosphere, cookbook visible in background, domestic cooking scene.',
        'filename': 'images/real-images/scenes/julie-julia-bruschetta.jpg'
    },
    {
        'prompt': 'Photorealistic elaborate Japanese feast with various colorful dishes, dumplings, and traditional Japanese foods artfully arranged on a long table. Rich colors, steam rising from hot dishes, dramatic lighting, anime-inspired but photorealistic style.',
        'filename': 'images/real-images/scenes/spirited-away-feast.jpg'
    },
    {
        'prompt': 'Photorealistic intimate kitchen scene of hands tossing spaghetti in a pan with golden olive oil, garlic, and red pepper flakes. Steam rising, warm kitchen lighting, shallow depth of field emphasizing the sensual cooking process. Fresh parsley and parmesan nearby.',
        'filename': 'images/real-images/scenes/chef-pasta-aglio.jpg'
    },
    {
        'prompt': 'Photorealistic massive timpano (drum-shaped pasta dish) being cut open in a 1950s restaurant kitchen, revealing layers of pasta, eggs, meatballs, and sauce inside. Professional kitchen setting, warm tungsten lighting, steam and anticipation.',
        'filename': 'images/real-images/scenes/big-night-timpano.jpg'
    },
    {
        'prompt': 'Photorealistic steaming bowl of ramen with perfectly arranged toppings - soft-boiled egg, sliced pork, green onions, nori. Steam rising dramatically, warm restaurant lighting, chopsticks positioned beside bowl, Japanese aesthetic.',
        'filename': 'images/real-images/scenes/tampopo-ramen.jpg'
    },
    {
        'prompt': 'Photorealistic elegant French pastries and cakes arranged in a sophisticated display case. Colorful macarons, éclairs, and ornate cakes with perfect lighting showing their delicate details. European patisserie aesthetic, warm inviting colors.',
        'filename': 'images/real-images/scenes/grand-budapest-pastries.jpg'
    },
    
    # Collection images
    {
        'prompt': 'Photorealistic romantic restaurant collage featuring intimate dining moments. Candlelit tables, wine glasses, couples sharing desserts, soft bokeh lights. Include oysters, chocolate fondue, champagne. Warm romantic lighting throughout.',
        'filename': 'images/real-images/collections/collection-date-night.jpg'
    },
    {
        'prompt': 'Photorealistic collage showcasing global cuisine diversity. Japanese sushi, Italian pasta, Indian curry, French pastries, Mexican tacos, Thai noodles arranged artistically. Vibrant colors, each dish lit to highlight unique characteristics.',
        'filename': 'images/real-images/collections/collection-international.jpg'
    },
    {
        'prompt': 'Photorealistic comfort food collection with mac and cheese, grilled cheese sandwich, tomato soup, pizza slice, chocolate chip cookies, hot cocoa. Cozy home setting with warm lighting, nostalgic and inviting atmosphere.',
        'filename': 'images/real-images/collections/collection-comfort-food.jpg'
    },
    {
        'prompt': 'Photorealistic elegant fine dining collection representing Oscar-winning films. Sophisticated plated dishes, wine glasses, elegant table setting with golden accents. Luxurious restaurant ambiance with dramatic lighting.',
        'filename': 'images/real-images/collections/collection-oscar-winners.jpg'
    }
]

def main():
    print("Starting image generation...")
    print(f"Will generate {len(images_to_generate)} images")
    
    success_count = 0
    for image in images_to_generate:
        if generate_image(image['prompt'], image['filename']):
            success_count += 1
        
        # Small delay to be respectful to the API
        import time
        time.sleep(1)
    
    print(f"\nGeneration complete!")
    print(f"Successfully generated {success_count}/{len(images_to_generate)} images")

if __name__ == "__main__":
    main()