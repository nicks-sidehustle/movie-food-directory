import asyncio
import aiohttp
import re
from typing import List, Dict, Optional
import json
from datetime import datetime
import os
from urllib.parse import urlparse

class RedditFoodImageScraper:
    def __init__(self):
        # Food and movie-related subreddits
        self.subreddits = [
            'food',
            'FoodPorn', 
            'Cooking',
            'moviefood',
            'MovieDetails',
            'movies',
            'CookingForOne',
            'MealPrepSunday',
            'tonightsdinner',
            'DailyFood',
            'FoodPics'
        ]
        
        # Our target movies from Food In Movies
        self.target_movies = [
            "Goodfellas", "Ratatouille", "Pulp Fiction", "Chef", "Julie & Julia",
            "Big Night", "Eat Pray Love", "The Hundred-Foot Journey", 
            "Burnt", "No Reservations", "Julie and Julia"
        ]
        
        # Food keywords
        self.food_keywords = [
            'food', 'meal', 'dinner', 'breakfast', 'lunch', 'cook', 'restaurant',
            'chef', 'dish', 'recipe', 'kitchen', 'bake', 'dessert', 'feast', 'cuisine',
            'pasta', 'pizza', 'burger', 'sushi', 'chocolate', 'wine', 'coffee', 'bread',
            'ratatouille', 'aglio e olio', 'bruschetta', 'cannoli', 'big kahuna burger',
            'prison dinner', 'cooking scene', 'food scene'
        ]
        
        self.base_url = 'https://www.reddit.com'
        self.headers = {
            'User-Agent': 'FoodInMoviesImageScraper/1.0'
        }
        
        # Image extensions
        self.image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        
    async def search_subreddit_for_food_images(self, subreddit: str, query: str = None) -> List[Dict]:
        """Search a subreddit for food-related posts with images"""
        food_images = []
        
        # Different search strategies
        if query:
            search_queries = [query]
        else:
            search_queries = [
                'movie food',
                'film food scene',
                'cooking movie',
                'food in movies',
                'iconic food scene'
            ] + self.target_movies
        
        for search_query in search_queries:
            # Reddit JSON API
            url = f"{self.base_url}/r/{subreddit}/search.json"
            params = {
                'q': search_query,
                'restrict_sr': 'true',
                'sort': 'top',
                'limit': 50,
                't': 'all'  # All time for best results
            }
            
            async with aiohttp.ClientSession() as session:
                try:
                    async with session.get(url, headers=self.headers, params=params) as response:
                        if response.status != 200:
                            continue
                        
                        data = await response.json()
                        
                        for post in data.get('data', {}).get('children', []):
                            post_data = post.get('data', {})
                            
                            # Check if post contains images and food content
                            image_info = self._extract_food_image_info(post_data)
                            
                            if image_info:
                                image_info.update({
                                    'subreddit': subreddit,
                                    'source_url': f"https://reddit.com{post_data.get('permalink', '')}",
                                    'created_at': datetime.fromtimestamp(post_data.get('created_utc', 0)).isoformat(),
                                    'upvotes': post_data.get('ups', 0),
                                    'num_comments': post_data.get('num_comments', 0),
                                    'search_query': search_query
                                })
                                food_images.append(image_info)
                
                except Exception as e:
                    print(f"Error searching r/{subreddit} for '{search_query}': {e}")
                
                # Rate limiting
                await asyncio.sleep(1)
        
        return food_images
    
    def _extract_food_image_info(self, post_data: Dict) -> Optional[Dict]:
        """Extract food and image information from a Reddit post"""
        title = post_data.get('title', '').lower()
        selftext = post_data.get('selftext', '').lower()
        url = post_data.get('url', '')
        
        combined_text = f"{title} {selftext}"
        
        # Check if post mentions food or movies
        has_food_keyword = any(keyword in combined_text for keyword in self.food_keywords)
        has_movie_reference = any(movie.lower() in combined_text for movie in self.target_movies)
        
        if not (has_food_keyword or has_movie_reference):
            return None
        
        # Check for direct image URLs
        image_url = None
        
        # Direct image links
        if any(ext in url.lower() for ext in self.image_extensions):
            image_url = url
        
        # Reddit image hosting
        elif 'i.redd.it' in url:
            image_url = url
        
        # Imgur links
        elif 'imgur.com' in url:
            # Convert imgur page URLs to direct image URLs
            if '/gallery/' in url or '/a/' in url:
                # Gallery/album - would need additional parsing
                pass
            else:
                # Single image
                imgur_id = url.split('/')[-1].split('.')[0]
                image_url = f"https://i.imgur.com/{imgur_id}.jpg"
        
        # Check if post has media/preview
        elif post_data.get('preview'):
            preview = post_data['preview']
            if 'images' in preview and preview['images']:
                # Get the highest resolution preview
                resolutions = preview['images'][0].get('resolutions', [])
                if resolutions:
                    # Get highest resolution
                    highest_res = max(resolutions, key=lambda x: x.get('width', 0))
                    image_url = highest_res.get('url', '').replace('&amp;', '&')
                else:
                    # Fall back to source
                    source = preview['images'][0].get('source')
                    if source:
                        image_url = source.get('url', '').replace('&amp;', '&')
        
        if not image_url:
            return None
        
        # Identify which movie this might relate to
        movie_match = None
        for movie in self.target_movies:
            if movie.lower() in combined_text:
                movie_match = movie
                break
        
        # Extract food items mentioned
        food_items = []
        for keyword in self.food_keywords:
            if keyword in combined_text and keyword not in ['food', 'meal', 'cook']:
                food_items.append(keyword)
        
        return {
            'title': post_data.get('title', ''),
            'description': post_data.get('selftext', ''),
            'image_url': image_url,
            'movie': movie_match,
            'food_items': food_items,
            'has_food_keyword': has_food_keyword,
            'has_movie_reference': has_movie_reference,
            'reddit_id': post_data.get('id', ''),
            'author': post_data.get('author', ''),
            'original_url': post_data.get('url', '')
        }
    
    async def download_image(self, image_url: str, filename: str) -> Optional[str]:
        """Download an image from URL"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(image_url, headers=self.headers) as response:
                    if response.status != 200:
                        return None
                    
                    content = await response.read()
                    
                    # Ensure download directory exists
                    os.makedirs('images/reddit', exist_ok=True)
                    
                    # Create safe filename
                    safe_filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
                    filepath = f"images/reddit/{safe_filename}"
                    
                    with open(filepath, 'wb') as f:
                        f.write(content)
                    
                    print(f"Downloaded: {filepath}")
                    return filepath
        
        except Exception as e:
            print(f"Error downloading {image_url}: {e}")
            return None
    
    async def scrape_food_images_from_reddit(self) -> List[Dict]:
        """Scrape food images from all configured subreddits"""
        all_images = []
        
        for subreddit in self.subreddits:
            print(f"Scraping r/{subreddit} for food images...")
            
            # General food search
            images = await self.search_subreddit_for_food_images(subreddit)
            all_images.extend(images)
            
            # Also search for specific movies if it's a general subreddit
            if subreddit in ['movies', 'MovieDetails']:
                for movie in self.target_movies[:5]:  # Search for top 5 movies
                    movie_images = await self.search_subreddit_for_food_images(subreddit, f"{movie} food")
                    all_images.extend(movie_images)
                    await asyncio.sleep(2)  # Rate limiting
            
            await asyncio.sleep(3)  # Rate limiting between subreddits
        
        return all_images
    
    async def save_image_metadata(self, images: List[Dict]):
        """Save image metadata and download high-quality images"""
        # Filter and rank images
        ranked_images = []
        
        for img in images:
            # Calculate quality score
            score = 0
            
            # Upvotes factor (normalized)
            upvotes = img.get('upvotes', 0)
            score += min(upvotes / 100, 10)  # Max 10 points for upvotes
            
            # Movie reference bonus
            if img.get('movie'):
                score += 20
            
            # Food keyword bonus
            if img.get('food_items'):
                score += len(img['food_items']) * 2
            
            # Comments engagement
            comments = img.get('num_comments', 0)
            score += min(comments / 10, 5)  # Max 5 points for comments
            
            img['quality_score'] = score
            ranked_images.append(img)
        
        # Sort by quality score
        ranked_images.sort(key=lambda x: x['quality_score'], reverse=True)
        
        # Save metadata
        metadata = {
            'scraped_at': datetime.now().isoformat(),
            'total_images': len(ranked_images),
            'by_subreddit': {},
            'by_movie': {},
            'images': ranked_images
        }
        
        # Group by subreddit and movie
        for img in ranked_images:
            subreddit = img.get('subreddit', 'unknown')
            movie = img.get('movie', 'unidentified')
            
            if subreddit not in metadata['by_subreddit']:
                metadata['by_subreddit'][subreddit] = []
            metadata['by_subreddit'][subreddit].append(img)
            
            if movie != 'unidentified':
                if movie not in metadata['by_movie']:
                    metadata['by_movie'][movie] = []
                metadata['by_movie'][movie].append(img)
        
        # Save full metadata
        with open('scrapers/reddit_image_metadata.json', 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Saved metadata for {len(ranked_images)} images")
        
        # Download top images
        print("Downloading top-rated images...")
        downloaded = 0
        
        for img in ranked_images[:30]:  # Download top 30
            if img.get('image_url'):
                movie_name = img.get('movie', 'unknown')
                reddit_id = img.get('reddit_id', 'unknown')
                
                # Determine file extension
                parsed_url = urlparse(img['image_url'])
                ext = os.path.splitext(parsed_url.path)[1]
                if not ext:
                    ext = '.jpg'
                
                filename = f"{movie_name}_{reddit_id}{ext}"
                
                filepath = await self.download_image(img['image_url'], filename)
                if filepath:
                    img['local_filepath'] = filepath
                    downloaded += 1
                
                await asyncio.sleep(2)  # Rate limiting
        
        print(f"Downloaded {downloaded} images")
        
        # Save updated metadata with local file paths
        with open('scrapers/reddit_image_metadata.json', 'w') as f:
            json.dump(metadata, f, indent=2)

async def main():
    scraper = RedditFoodImageScraper()
    
    print("Starting Reddit food image scraping for Food In Movies...")
    
    # Scrape images
    images = await scraper.scrape_food_images_from_reddit()
    
    print(f"Found {len(images)} food-related images from Reddit")
    
    # Save metadata and download top images
    await scraper.save_image_metadata(images)
    
    # Create summary
    movie_counts = {}
    for img in images:
        movie = img.get('movie', 'Unidentified')
        movie_counts[movie] = movie_counts.get(movie, 0) + 1
    
    print("\nImages found by movie:")
    for movie, count in sorted(movie_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {movie}: {count} images")
    
    print("Reddit image scraping complete!")

if __name__ == "__main__":
    asyncio.run(main())