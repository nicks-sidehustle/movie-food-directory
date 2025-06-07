# Food In Movies Image Scrapers

This directory contains specialized web scrapers adapted for collecting movie food scene images for the Food In Movies project.

## Available Scrapers

### 1. Food Scenes Scraper (`food-scenes-scraper.py`)
**Primary scraper for high-quality editorial content**

**Sources:**
- Rotten Tomatoes food movie guides
- Taste of Cinema articles  
- Screen Rant food scene rankings
- Eater magazine features
- Food & Wine movie content
- MovieStillsDB.com

**Capabilities:**
- Extracts images from food scene articles
- Identifies movie-specific content
- Downloads images with proper attribution
- Creates metadata mapping for the app

**Usage:**
```bash
python food-scenes-scraper.py
```

### 2. Reddit Food Image Scraper (`reddit-food-image-scraper.py`)
**Community-driven content with quality validation**

**Target Subreddits:**
- r/food, r/FoodPorn, r/Cooking
- r/moviefood, r/MovieDetails
- r/movies (with food queries)

**Features:**
- Quality scoring based on upvotes and engagement
- Direct image URL extraction
- Movie identification from titles/comments
- Top 30 image downloads

**Usage:**
```bash
python reddit-food-image-scraper.py
```

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables (optional):
```bash
# For Supabase integration (food-scenes-scraper only)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

## Output Structure

### Generated Files:
- `image_metadata.json` - Full image metadata from editorial sources
- `reddit_image_metadata.json` - Reddit image data with quality scores
- `images/downloaded/` - Downloaded editorial images
- `images/reddit/` - Downloaded Reddit images
- `images/image_mapping.json` - Simplified mapping for the app

### Metadata Format:
```json
{
  "scraped_at": "2024-XX-XX",
  "total_images": 150,
  "by_movie": {
    "Goodfellas": [
      {
        "url": "https://...",
        "alt_text": "Prison dinner scene",
        "caption": "Elaborate Italian meal",
        "source_url": "https://editorial.source.com",
        "movie": "Goodfellas"
      }
    ]
  },
  "images": [...]
}
```

## Target Movies

The scrapers focus on these 10 iconic food movies:
- Goodfellas (1990)
- Ratatouille (2007) 
- Pulp Fiction (1994)
- Chef (2014)
- Julie & Julia (2009)
- Big Night (1996)
- Eat Pray Love (2010)
- The Hundred-Foot Journey (2014)
- Burnt (2015)
- No Reservations (2007)

## Rate Limiting

Both scrapers include built-in rate limiting:
- 2-3 second delays between requests
- Respectful crawling patterns
- Error handling for failed requests

## Legal Considerations

**Editorial Images:**
- Fair use for educational/commentary purposes
- Full attribution preserved in metadata
- Source URLs tracked for compliance

**Reddit Images:**
- Public posts with community engagement
- User-generated content with proper crediting
- Quality validation through upvote scores

## Integration with CinemaEats

The scrapers generate files that integrate directly with the main app:

1. **Image Loading System** (`js/image-loader.js`) can use the metadata
2. **Data Structure** (`js/data.js`) can be updated with real image URLs
3. **Attribution System** displays proper credits for all images

## Running All Scrapers

To run both scrapers sequentially:

```bash
# Run editorial scraper first (higher quality)
python food-scenes-scraper.py

# Then run Reddit scraper for additional content
python reddit-food-image-scraper.py
```

## Troubleshooting

**Common Issues:**
- SSL errors: Ensure `certifi` is updated
- Rate limiting: Increase sleep delays if needed
- Image download failures: Check network connectivity
- Missing images: Some sources may have changed URLs

**Debug Mode:**
Add `print()` statements in the scrapers to debug specific issues.

## Future Enhancements

**Potential Additions:**
- Getty Images API integration
- IMDb photo gallery parsing  
- Studio press kit scrapers
- Image quality filtering
- Automatic duplicate detection
- WebP conversion for optimization

---

*These scrapers were adapted from the filming-locations-db project specifically for Food In Movies image collection needs.*