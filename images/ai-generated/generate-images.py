#!/usr/bin/env python3
"""
Script to generate movie food scene images using AI image generation services.
This script provides the prompts and specifications for all required images.
"""

import json
import os
from pathlib import Path

# Load the image generation prompts
with open('image-generation-prompts.json', 'r') as f:
    prompts_data = json.loads(f.read())

def generate_images_with_dalle(api_key=None):
    """
    Generate images using OpenAI's DALL-E API
    Requires: pip install openai
    """
    try:
        import openai
        
        if not api_key:
            api_key = os.environ.get('OPENAI_API_KEY')
            if not api_key:
                print("Please set OPENAI_API_KEY environment variable")
                return
        
        client = openai.OpenAI(api_key=api_key)
        
        # Create output directories
        scenes_dir = Path('../scenes')
        collections_dir = Path('../collections')
        scenes_dir.mkdir(exist_ok=True)
        collections_dir.mkdir(exist_ok=True)
        
        # Generate scene images
        print("Generating movie scene images...")
        for scene in prompts_data['scenes']:
            print(f"Generating: {scene['filename']}")
            
            response = client.images.generate(
                model="dall-e-3",
                prompt=scene['prompt'],
                size="1792x1024",  # Closest to 1200x800
                quality="hd",
                n=1,
            )
            
            image_url = response.data[0].url
            print(f"Generated image URL: {image_url}")
            print(f"Please download and save as: {scenes_dir}/{scene['filename']}")
            print()
        
        # Generate collection images  
        print("\nGenerating collection images...")
        for collection in prompts_data['collections']:
            print(f"Generating: {collection['filename']}")
            
            response = client.images.generate(
                model="dall-e-3",
                prompt=collection['prompt'],
                size="1792x1024",  # Closest to 1600x900
                quality="hd",
                n=1,
            )
            
            image_url = response.data[0].url
            print(f"Generated image URL: {image_url}")
            print(f"Please download and save as: {collections_dir}/{collection['filename']}")
            print()
            
    except ImportError:
        print("OpenAI library not installed. Run: pip install openai")
    except Exception as e:
        print(f"Error generating images: {e}")

def generate_with_midjourney_prompts():
    """
    Output Midjourney-formatted prompts for manual generation
    """
    print("MIDJOURNEY PROMPTS FOR MOVIE SCENES")
    print("=" * 50)
    
    for scene in prompts_data['scenes']:
        print(f"\n{scene['movie']} - {scene['scene']}:")
        print(f"/imagine {scene['prompt']} --ar 3:2 --v 6")
        print(f"Save as: scenes/{scene['filename']}")
    
    print("\n\nMIDJOURNEY PROMPTS FOR COLLECTIONS")
    print("=" * 50)
    
    for collection in prompts_data['collections']:
        print(f"\n{collection['title']}:")
        print(f"/imagine {collection['prompt']} --ar 16:9 --v 6")
        print(f"Save as: collections/{collection['filename']}")

def create_placeholder_html():
    """
    Create HTML file with all image specifications for manual generation
    """
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CinemaEats - Image Generation Guide</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .section { margin-bottom: 40px; }
        .image-spec { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
        .prompt { background: #e8f4f8; padding: 10px; margin: 10px 0; border-left: 4px solid #2196F3; }
        h1 { color: #333; }
        h2 { color: #666; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
        .filename { color: #4CAF50; font-weight: bold; }
        .dimensions { color: #FF5722; }
    </style>
</head>
<body>
    <h1>CinemaEats - AI Image Generation Guide</h1>
    <p>This document contains all prompts and specifications for generating the required images.</p>
    
    <div class="section">
        <h2>Movie Scene Images (10 Required)</h2>
        <p>Dimensions: <span class="dimensions">1200x800px (3:2 aspect ratio)</span></p>
"""
    
    for scene in prompts_data['scenes']:
        html_content += f"""
        <div class="image-spec">
            <h3>{scene['movie']} - {scene['scene']}</h3>
            <p>Filename: <span class="filename">{scene['filename']}</span></p>
            <div class="prompt">
                <strong>Prompt:</strong><br>
                {scene['prompt']}
            </div>
            <p><strong>Style:</strong> {scene['style']}</p>
        </div>
"""
    
    html_content += """
    </div>
    
    <div class="section">
        <h2>Collection Images (4 Required)</h2>
        <p>Dimensions: <span class="dimensions">1600x900px (16:9 aspect ratio)</span></p>
"""
    
    for collection in prompts_data['collections']:
        html_content += f"""
        <div class="image-spec">
            <h3>{collection['title']}</h3>
            <p>Filename: <span class="filename">{collection['filename']}</span></p>
            <div class="prompt">
                <strong>Prompt:</strong><br>
                {collection['prompt']}
            </div>
            <p><strong>Style:</strong> {collection['style']}</p>
        </div>
"""
    
    html_content += """
    </div>
</body>
</html>
"""
    
    with open('image-generation-guide.html', 'w') as f:
        f.write(html_content)
    
    print("Created image-generation-guide.html with all specifications")

if __name__ == "__main__":
    print("CinemaEats Image Generation Script")
    print("=" * 50)
    print("\nOptions:")
    print("1. Generate with DALL-E (requires API key)")
    print("2. Get Midjourney prompts")
    print("3. Create HTML guide")
    print("4. Show all prompts")
    
    choice = input("\nSelect option (1-4): ").strip()
    
    if choice == '1':
        generate_images_with_dalle()
    elif choice == '2':
        generate_with_midjourney_prompts()
    elif choice == '3':
        create_placeholder_html()
    elif choice == '4':
        print(json.dumps(prompts_data, indent=2))
    else:
        print("Invalid choice")