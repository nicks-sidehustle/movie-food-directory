#!/bin/bash

# CinemaEats Batch Image Generation Helper
# This script helps organize the AI image generation process

echo "CinemaEats Image Generation Helper"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "image-generation-prompts.json" ]; then
    echo "Error: Please run this script from the ai-generated directory"
    exit 1
fi

# Create output directories if they don't exist
mkdir -p generated/scenes
mkdir -p generated/collections

echo "Image Generation Options:"
echo "1. Display all scene prompts"
echo "2. Display all collection prompts"
echo "3. Open HTML guide in browser"
echo "4. Check generation progress"
echo "5. Copy placeholders to use temporarily"
echo ""

read -p "Select option (1-5): " choice

case $choice in
    1)
        echo ""
        echo "MOVIE SCENE PROMPTS"
        echo "==================="
        python3 -c "
import json
with open('image-generation-prompts.json', 'r') as f:
    data = json.load(f)
    for i, scene in enumerate(data['scenes'], 1):
        print(f'\n{i}. {scene[\"movie\"]} - {scene[\"scene\"]}')
        print(f'   Filename: {scene[\"filename\"]}')
        print(f'   Dimensions: {scene[\"dimensions\"]}')
        print(f'   Prompt:')
        print(f'   {scene[\"prompt\"]}')
        print('-' * 80)
"
        ;;
    
    2)
        echo ""
        echo "COLLECTION PROMPTS"
        echo "=================="
        python3 -c "
import json
with open('image-generation-prompts.json', 'r') as f:
    data = json.load(f)
    for i, coll in enumerate(data['collections'], 1):
        print(f'\n{i}. {coll[\"title\"]}')
        print(f'   Filename: {coll[\"filename\"]}')
        print(f'   Dimensions: {coll[\"dimensions\"]}')
        print(f'   Prompt:')
        print(f'   {coll[\"prompt\"]}')
        print('-' * 80)
"
        ;;
    
    3)
        echo "Opening HTML guide..."
        if command -v open &> /dev/null; then
            open image-generation-guide.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open image-generation-guide.html
        else
            echo "Please open image-generation-guide.html manually"
        fi
        ;;
    
    4)
        echo ""
        echo "Generation Progress:"
        echo "==================="
        echo ""
        echo "Placeholders created:"
        ls -1 ../scenes/*-placeholder.svg 2>/dev/null | wc -l | xargs echo "  Scene placeholders:"
        ls -1 ../collections/*-placeholder.svg 2>/dev/null | wc -l | xargs echo "  Collection placeholders:"
        echo ""
        echo "Generated images:"
        ls -1 generated/scenes/*.jpg 2>/dev/null | wc -l | xargs echo "  Scene images:"
        ls -1 generated/collections/*.jpg 2>/dev/null | wc -l | xargs echo "  Collection images:"
        ;;
    
    5)
        echo ""
        echo "This would copy all placeholder SVGs to be used as temporary images"
        echo "Are you sure you want to do this? (y/n)"
        read -p "> " confirm
        if [ "$confirm" = "y" ]; then
            # Note: This is just for demonstration
            echo "Placeholders are already in place at:"
            echo "  - /images/scenes/*-placeholder.svg"
            echo "  - /images/collections/*-placeholder.svg"
        fi
        ;;
    
    *)
        echo "Invalid option"
        ;;
esac

echo ""
echo "Done!"