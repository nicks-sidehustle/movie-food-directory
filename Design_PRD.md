# Design Product Requirements Document
## Food In Movies - Movie Food Scenes Directory

### 1. Design Vision
Create an immersive, visually-driven platform that celebrates the intersection of cinema and cuisine through beautiful imagery, intuitive navigation, and engaging storytelling.

### 2. Brand Identity

#### 2.1 Brand Personality
- **Sophisticated**: Curated, high-quality content
- **Nostalgic**: Celebrating classic cinema moments
- **Accessible**: Welcoming to both film buffs and casual viewers
- **Appetizing**: Making users hungry through visual design

#### 2.2 Visual Language
- **Color Palette**:
  - Primary: Deep burgundy (#8B0000) - wine/cinema curtains
  - Secondary: Warm gold (#FFD700) - popcorn/awards
  - Accent: Sage green (#87A96B) - fresh ingredients
  - Neutrals: Charcoal (#36454F), Cream (#FFF8DC)
  
- **Typography**:
  - Headers: Bebas Neue (cinematic, bold)
  - Body: Inter (clean, readable)
  - Accent: Playfair Display (elegant, editorial)

- **Imagery Style**:
  - High-contrast, cinematic stills
  - Warm, appetizing food photography
  - Film grain overlay for authenticity
  - 16:9 aspect ratio for movie feel

### 3. User Experience Principles

#### 3.1 Information Architecture
```
Home
├── Browse
│   ├── By Movie Genre
│   ├── By Cuisine Type
│   ├── By Decade
│   └── By Meal Type
├── Search
├── Featured Collections
│   ├── Oscar Winners
│   ├── Comfort Food Cinema
│   ├── International Flavors
│   └── Date Night Picks
├── About
└── Submit a Scene
```

#### 3.2 User Flows
1. **Discovery Flow**: Home → Browse → Filter → Scene Detail → Related Scenes
2. **Search Flow**: Search Bar → Results → Quick Preview → Full Detail
3. **Save Flow**: Scene → Add to Favorites → View Collection → Share

### 4. Component Design

#### 4.1 Navigation
- **Desktop**: Sticky header with search, minimal height (60px)
- **Mobile**: Bottom navigation with key actions
- **Search**: Prominent placement with autocomplete dropdown

#### 4.2 Content Cards
- **Grid Layout**: 3 columns desktop, 1 column mobile
- **Card Elements**:
  - Movie still (16:9)
  - Movie title & year
  - Food item name
  - Genre tags
  - Quick action buttons (favorite, share)
- **Hover State**: Subtle zoom, show description overlay

#### 4.3 Detail Page
- **Hero Section**: Full-width video/image with gradient overlay
- **Content Layout**: 
  - Left: Video player or image gallery
  - Right: Scene details, quotes, trivia
- **Below Fold**: Related recipes, similar scenes, comments

### 5. Interaction Design

#### 5.1 Micro-interactions
- **Favorite**: Heart animation with confetti burst
- **Share**: Slide-up modal with preview
- **Filter**: Smooth accordion expansion
- **Loading**: Film reel spinner

#### 5.2 Animations
- **Page Transitions**: Cinematic fade/wipe effects
- **Scroll Triggers**: Parallax on hero images
- **Card Entry**: Staggered fade-in on scroll
- **Success States**: Toast notifications with movie quotes

### 6. Responsive Design

#### 6.1 Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px - 1440px
- Large: 1440px+

#### 6.2 Mobile Considerations
- Touch-friendly targets (44px minimum)
- Swipeable image galleries
- Collapsible filters
- Bottom sheet for details

### 7. Accessibility

#### 7.1 Standards
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- High contrast mode

#### 7.2 Features
- Alt text for all images
- Closed captions for video clips
- Focus indicators
- Reduced motion option

### 8. Content Strategy

#### 8.1 Scene Presentation
- **Title Format**: "The [Food] Scene from [Movie]"
- **Description**: 100-150 words mixing plot context and food focus
- **Metadata**: Timestamp, actors involved, filming location
- **Trivia**: Behind-the-scenes facts, recipe authenticity

#### 8.2 Editorial Voice
- Knowledgeable but not pretentious
- Enthusiastic about both film and food
- Inclusive of all cuisine types and film genres
- Light humor when appropriate

### 9. Special Features

#### 9.1 Curated Collections
- "Method Actor Meals" - Actors who learned to cook
- "Animated Appetites" - Pixar, Ghibli food scenes
- "Historical Feasts" - Period piece dining
- "Street Food Cinema" - Food truck/vendor scenes

#### 9.2 Interactive Elements
- "Guess the Movie" quiz from food images
- Recipe difficulty ratings
- User polls for best food scenes
- Seasonal collections (holiday meals, summer BBQs)

### 10. Design System

#### 10.1 Component Library
- Buttons: Primary, Secondary, Ghost
- Cards: Movie, Recipe, Collection
- Forms: Search, Filter, Submit
- Modals: Video, Share, Login

#### 10.2 Design Tokens
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px

--radius-sm: 4px
--radius-md: 8px
--radius-lg: 16px

--shadow-sm: 0 2px 4px rgba(0,0,0,0.1)
--shadow-md: 0 4px 8px rgba(0,0,0,0.15)
--shadow-lg: 0 8px 16px rgba(0,0,0,0.2)
```

### 11. Image Sourcing Guidelines

#### 11.1 Image Requirements
- **Scene Thumbnails**: 16:9 aspect ratio, 800x450px minimum
- **Hero Images**: 1920x1080px for desktop, 1200x675px for mobile
- **Collection Covers**: 600x800px with gradient overlay capability
- **File Formats**: WebP with JPEG fallback
- **File Size**: <200KB for thumbnails, <500KB for hero images

#### 11.2 Sourcing Strategy
1. **Primary Source - Fair Use Screenshots**
   - Capture directly from films at key food moments
   - Maintain consistent color grading
   - Apply subtle film grain overlay for authenticity
   - Include timestamp reference for verification

2. **Secondary Source - Stock Photography**
   - Licensed editorial content from:
     - Shutterstock Editorial
     - Getty Images Entertainment
     - Alamy Movie Stills Collection
   - Ensure proper licensing for web use

3. **Tertiary Source - Original Photography**
   - Recreate iconic dishes with food stylists
   - Match lighting and composition to film scenes
   - More flexible for hero images and collections

#### 11.3 Legal Compliance
- **Attribution Format**: "© [Studio/Distributor] - [Movie Title] ([Year])"
- **Fair Use Guidelines**:
  - Low resolution for thumbnails (max 800px wide)
  - Educational/editorial purpose clearly stated
  - No direct video embedding without license
  - Link to official sources where possible

#### 11.4 Image Optimization
- **Responsive Images**: Serve different sizes based on viewport
- **Lazy Loading**: Implement for below-fold images
- **Blur-up Technique**: Show blurred placeholder while loading
- **CDN Delivery**: Use Cloudflare or similar for global distribution

#### 11.5 Fallback Strategy
- **Missing Images**: Elegant placeholder with movie poster + food icon
- **Loading States**: Skeleton screens matching aspect ratios
- **Error Handling**: Graceful degradation to text-only cards

#### 11.6 Image Sourcing Process
1. **Screenshot Capture**
   - Use high-quality streaming sources (4K preferred)
   - Capture at exact timestamp of best food shot
   - Multiple angles when available
   - Tools: VLC Media Player, OBS Studio

2. **Stock Licensing**
   - Budget: $20-50 per editorial image
   - Bulk licensing packages available
   - Required metadata: Movie title, year, distributor
   - Download highest resolution available

3. **AI-Generated Alternatives**
   - For hero images and collections
   - Prompt engineering for movie-accurate styling
   - Tools: Midjourney, DALL-E 3, Stable Diffusion
   - Style reference: "[Food] in the style of [Movie] cinematography"

4. **Image Processing Pipeline**
   - Color correction to match film aesthetic
   - Consistent cropping (16:9 for scenes)
   - Film grain overlay application
   - Compression without quality loss
   - Tools: Photoshop, ImageOptim, Squoosh

#### 11.7 Specific Image Requirements
**Hero Section**
- Collage featuring 6-8 iconic food moments
- Gradient overlay for text readability
- Mobile version with fewer scenes

**Scene Thumbnails** (10 required)
1. Goodfellas - Prison garlic slicing scene
2. Ratatouille - Anton Ego tasting moment
3. Pulp Fiction - Big Kahuna Burger bite
4. Julie & Julia - First bruschetta bite
5. Spirited Away - Parents eating feast
6. Eat Pray Love - Napoli pizza scene
7. Chef - Scarlett Johansson pasta scene
8. Big Night - Timpano reveal
9. Tampopo - Ramen eating instruction
10. Grand Budapest - Mendl's box opening

**Collection Covers** (4 required)
1. Oscar Winners - Gold-tinted montage
2. Comfort Food - Warm, cozy dishes
3. International - World map with dishes
4. Date Night - Romantic dining scenes

### 12. Future Design Considerations
- AR features for recipe visualization
- Social features for movie night planning
- Cookbook companion app
- Integration with streaming services for "watch now" CTAs