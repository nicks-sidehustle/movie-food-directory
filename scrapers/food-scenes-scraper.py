#!/usr/bin/env python3
import sys
import asyncio
import aiohttp
from bs4 import BeautifulSoup
import re
import json
from datetime import datetime
import ssl
import certifi
import os
from typing import List, Dict, Optional
from urllib.parse import urljoin, urlparse
import base64

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

class FoodInMoviesImageScraper:
    def __init__(self):
        # Base URLs
        self.base_url = "https://www.imdb.com"
        
        # Sources for food scenes with images
        self.food_scene_sources = [
            "https://editorial.rottentomatoes.com/guide/best-food-movies/",
            "https://www.tasteofcinema.com/2015/the-30-most-memorable-food-scenes-in-movies/",
            "https://screenrant.com/best-food-movies-scenes-ever-iconic-ranked/",
            "https://www.eater.com/food-scenes-movies-tv-best-iconic",
            "https://fictionalfood.net/pages/movie-foods",
            "https://www.eatthis.com/iconic-food-scenes-movies/",
            "https://www.bonappetit.com/story/best-food-scenes-movies",
            "https://www.foodandwine.com/lifestyle/entertainment/iconic-food-scenes-movies"
        ]
        
        # Keywords for food scene identification
        self.food_keywords = [
            "food", "meal", "dinner", "breakfast", "lunch", "cook", "restaurant", 
            "chef", "dish", "recipe", "kitchen", "bake", "dessert", "feast", "cuisine",
            "pasta", "pizza", "burger", "sushi", "chocolate", "wine", "coffee", "bread"
        ]
        
        # Movie titles from our Food In Movies data
        self.target_movies = [
            "Goodfellas", "Ratatouille", "Pulp Fiction", "Chef", "Julie & Julia",
            "Big Night", "Eat Pray Love", "The Hundred-Foot Journey", 
            "Burnt", "No Reservations"
        ]
        
        # Headers for requests
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        # Image file extensions
        self.image_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    
    async def extract_images_from_food_articles(self, article_url: str) -> List[Dict]:
        """Extract food scene images from editorial articles"""
        images = []
        
        ssl_context = ssl.create_default_context(cafile=certifi.where())
        connector = aiohttp.TCPConnector(ssl=ssl_context)
        
        async with aiohttp.ClientSession(connector=connector) as session:
            try:
                print(f"Scraping images from {article_url}...")
                async with session.get(article_url, headers=self.headers) as response:
                    if response.status != 200:
                        print(f"Error {response.status} for {article_url}")
                        return images
                    
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Find images with food-related content
                    for img in soup.find_all('img'):
                        src = img.get('src', '') or img.get('data-src', '')
                        alt_text = img.get('alt', '').lower()
                        
                        if not src:
                            continue
                        
                        # Convert relative URLs to absolute
                        if src.startswith('//'):
                            src = 'https:' + src
                        elif src.startswith('/'):
                            src = urljoin(article_url, src)
                        
                        # Check if image is relevant to food/movies
                        is_food_related = any(food_word in alt_text for food_word in self.food_keywords)
                        is_movie_related = any(movie.lower() in alt_text for movie in self.target_movies)
                        
                        # Check image URL for movie names
                        if not is_movie_related:
                            is_movie_related = any(movie.lower() in src.lower() for movie in self.target_movies)
                        
                        # Also check surrounding text for context
                        caption = self._find_image_caption(img)
                        if caption:
                            is_food_related = is_food_related or any(food_word in caption.lower() for food_word in self.food_keywords)
                            is_movie_related = is_movie_related or any(movie.lower() in caption.lower() for movie in self.target_movies)
                        
                        if (is_food_related or is_movie_related) and any(ext in src.lower() for ext in self.image_extensions):
                            # Try to identify which movie this relates to
                            movie_match = None
                            for movie in self.target_movies:
                                if movie.lower() in alt_text or movie.lower() in src.lower() or (caption and movie.lower() in caption.lower()):
                                    movie_match = movie
                                    break
                            
                            images.append({
                                'url': src,
                                'alt_text': alt_text,
                                'caption': caption,
                                'source_url': article_url,
                                'movie': movie_match,
                                'is_food_related': is_food_related,
                                'is_movie_related': is_movie_related
                            })
                            
                            print(f"Found image: {movie_match or 'Unknown'} - {alt_text[:50]}...")
            
            except Exception as e:
                print(f"Error extracting images from {article_url}: {e}")
        
        return images
    
    def _find_image_caption(self, img_tag) -> Optional[str]:
        """Find caption text associated with an image"""
        # Look for various caption patterns
        
        # Check for figcaption in parent figure
        figure = img_tag.find_parent('figure')
        if figure:
            figcaption = figure.find('figcaption')
            if figcaption:
                return figcaption.get_text().strip()
        
        # Check for caption in sibling elements
        parent = img_tag.parent
        if parent:
            # Look for caption class nearby
            for sibling in parent.find_next_siblings():
                if sibling.name and ('caption' in sibling.get('class', []) or 'caption' in sibling.name):
                    return sibling.get_text().strip()
            
            # Check previous siblings too
            for sibling in parent.find_previous_siblings():
                if sibling.name and ('caption' in sibling.get('class', []) or 'caption' in sibling.name):
                    return sibling.get_text().strip()
        
        # Check for title attribute
        title = img_tag.get('title')
        if title:
            return title.strip()
        
        return None
    
    async def download_image(self, image_url: str, movie_name: str, scene_name: str) -> Optional[str]:
        """Download an image and save it locally"""
        try:
            ssl_context = ssl.create_default_context(cafile=certifi.where())
            connector = aiohttp.TCPConnector(ssl=ssl_context)
            
            async with aiohttp.ClientSession(connector=connector) as session:
                async with session.get(image_url, headers=self.headers) as response:
                    if response.status != 200:
                        return None
                    
                    content = await response.read()
                    
                    # Determine file extension
                    content_type = response.headers.get('content-type', '')
                    if 'jpeg' in content_type or 'jpg' in content_type:
                        ext = '.jpg'
                    elif 'png' in content_type:
                        ext = '.png'
                    elif 'webp' in content_type:
                        ext = '.webp'
                    else:
                        # Try to get from URL
                        for extension in self.image_extensions:
                            if extension in image_url.lower():
                                ext = extension
                                break
                        else:
                            ext = '.jpg'  # Default
                    
                    # Create safe filename
                    safe_movie = re.sub(r'[^a-zA-Z0-9]', '-', movie_name.lower())
                    safe_scene = re.sub(r'[^a-zA-Z0-9]', '-', scene_name.lower())
                    filename = f"{safe_movie}-{safe_scene}{ext}"
                    
                    # Ensure images directory exists
                    os.makedirs('images/downloaded', exist_ok=True)
                    
                    filepath = f"images/downloaded/{filename}"
                    
                    with open(filepath, 'wb') as f:
                        f.write(content)
                    
                    print(f"Downloaded: {filepath}")
                    return filepath
        
        except Exception as e:
            print(f"Error downloading {image_url}: {e}")
            return None
    
    async def scrape_moviestillsdb(self, movie_title: str) -> List[Dict]:
        """Scrape MovieStillsDB for movie stills"""
        images = []
        
        # Clean movie title for search
        search_title = movie_title.replace(' ', '%20')
        search_url = f"https://www.moviestillsdb.com/movies/search/{search_title}"
        
        ssl_context = ssl.create_default_context(cafile=certifi.where())
        connector = aiohttp.TCPConnector(ssl=ssl_context)
        
        async with aiohttp.ClientSession(connector=connector) as session:
            try:
                async with session.get(search_url, headers=self.headers) as response:
                    if response.status != 200:
                        print(f"MovieStillsDB search failed for {movie_title}")
                        return images
                    
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Find movie result links
                    movie_links = soup.find_all('a', href=re.compile(r'/movies/'))
                    
                    for link in movie_links[:3]:  # Check first 3 results
                        movie_url = urljoin(search_url, link.get('href'))
                        
                        # Get movie page
                        async with session.get(movie_url, headers=self.headers) as movie_response:
                            if movie_response.status != 200:
                                continue
                            
                            movie_html = await movie_response.text()
                            movie_soup = BeautifulSoup(movie_html, 'html.parser')
                            
                            # Find still images
                            still_imgs = movie_soup.find_all('img', class_=re.compile(r'still'))
                            
                            for img in still_imgs:
                                src = img.get('src') or img.get('data-src')
                                if src:
                                    # Convert to full resolution if needed
                                    if 'thumb' in src:
                                        src = src.replace('thumb', 'full')
                                    
                                    images.append({
                                        'url': urljoin(movie_url, src),
                                        'alt_text': img.get('alt', ''),
                                        'source_url': movie_url,
                                        'movie': movie_title,
                                        'source': 'MovieStillsDB'
                                    })
                        
                        await asyncio.sleep(2)  # Rate limiting
            
            except Exception as e:
                print(f"Error scraping MovieStillsDB for {movie_title}: {e}")
        
        return images
    
    async def get_known_food_movies_with_images(self) -> List[Dict]:
        """Get food movies and their associated images"""
        all_images = []
        
        # First, scrape from editorial sources
        for source_url in self.food_scene_sources:
            images = await self.extract_images_from_food_articles(source_url)
            all_images.extend(images)
            await asyncio.sleep(3)  # Rate limiting
        
        # Then try MovieStillsDB for each target movie
        for movie in self.target_movies:
            movie_images = await self.scrape_moviestillsdb(movie)
            all_images.extend(movie_images)
            await asyncio.sleep(3)  # Rate limiting
        
        return all_images
    
    async def save_image_metadata(self, images: List[Dict]):
        """Save image metadata to JSON file"""
        # Group images by movie
        by_movie = {}
        for img in images:
            movie = img.get('movie', 'Unknown')
            if movie not in by_movie:
                by_movie[movie] = []
            by_movie[movie].append(img)
        
        # Save metadata
        metadata = {
            'scraped_at': datetime.now().isoformat(),
            'total_images': len(images),
            'by_movie': by_movie,
            'images': images
        }
        
        with open('scrapers/image_metadata.json', 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Saved metadata for {len(images)} images to image_metadata.json")
        
        # Also create a simplified mapping for our app
        app_mapping = {}
        for img in images:
            movie = img.get('movie')
            if movie and movie in self.target_movies:
                if movie not in app_mapping:
                    app_mapping[movie] = []
                app_mapping[movie].append({
                    'url': img['url'],
                    'alt': img.get('alt_text', ''),
                    'caption': img.get('caption', ''),
                    'source': img.get('source_url', '')
                })
        
        with open('images/image_mapping.json', 'w') as f:
            json.dump(app_mapping, f, indent=2)
        
        print(f"Created image mapping for {len(app_mapping)} movies")

async def main():
    scraper = FoodInMoviesImageScraper()
    
    print("Starting Food In Movies image scraping...")
    
    # Get images from various sources
    all_images = await scraper.get_known_food_movies_with_images()
    
    print(f"\nFound {len(all_images)} images total")
    
    # Save metadata
    await scraper.save_image_metadata(all_images)
    
    # Download a sample of high-quality images
    print("\nDownloading sample images...")
    downloaded_count = 0
    
    for img in all_images:
        if img.get('movie') and downloaded_count < 20:  # Download max 20 for testing
            movie_name = img['movie']
            scene_name = img.get('alt_text', 'scene')[:30]  # First 30 chars
            
            filepath = await scraper.download_image(img['url'], movie_name, scene_name)
            if filepath:
                downloaded_count += 1
            
            await asyncio.sleep(2)  # Rate limiting
    
    print(f"Downloaded {downloaded_count} images to images/downloaded/")
    print("Image scraping complete!")

if __name__ == "__main__":
    asyncio.run(main())