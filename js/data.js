// Movie food scenes data
const movieScenes = [
    {
        id: "goodfellas-prison-dinner",
        movie: {
            title: "Goodfellas",
            year: 1990,
            genre: ["Crime", "Drama"],
            director: "Martin Scorsese",
            imdbId: "tt0099685",
            studio: "Warner Bros.",
            distributor: "Warner Bros. Pictures"
        },
        scene: {
            timestamp: "1:17:30",
            description: "The iconic prison dinner scene where Paulie slices garlic with a razor blade, Vinnie makes the sauce, and Johnny Dio does the meat. A masterclass in making prison food look gourmet.",
            foodItems: ["Pasta", "Tomato Sauce", "Steak", "Garlic", "Wine"],
            thumbnailUrl: "images/scenes/goodfellas-prison-dinner.jpg",
            thumbnailAlt: "Goodfellas prison dinner scene - preparing pasta with garlic",
            videoUrl: "#",
            significance: "Shows how the mob maintains their lifestyle and standards even behind bars"
        },
        food: {
            cuisine: "Italian",
            mealType: "Dinner",
            difficulty: "Medium"
        },
        featured: true
    },
    {
        id: "ratatouille-final-dish",
        movie: {
            title: "Ratatouille",
            year: 2007,
            genre: ["Animation", "Comedy", "Family"],
            director: "Brad Bird",
            imdbId: "tt0382932",
            studio: "Pixar Animation Studios",
            distributor: "Walt Disney Pictures"
        },
        scene: {
            timestamp: "1:45:00",
            description: "Remy prepares the rustic ratatouille dish that wins over the harsh food critic Anton Ego, transporting him back to his childhood.",
            foodItems: ["Ratatouille", "Vegetables", "Herbs"],
            thumbnailUrl: "images/scenes/ratatouille-final-dish.jpg",
            thumbnailAlt: "Ratatouille - Anton Ego tasting the ratatouille dish",
            videoUrl: "#",
            significance: "Demonstrates how simple, heartfelt cooking can evoke powerful memories and emotions"
        },
        food: {
            cuisine: "French",
            mealType: "Dinner",
            difficulty: "Hard"
        },
        featured: true
    },
    {
        id: "pulp-fiction-burger",
        movie: {
            title: "Pulp Fiction",
            year: 1994,
            genre: ["Crime", "Drama"],
            director: "Quentin Tarantino",
            imdbId: "tt0110912",
            studio: "Miramax Films",
            distributor: "Miramax Films"
        },
        scene: {
            timestamp: "0:25:00",
            description: "Jules takes a bite of Brett's Big Kahuna Burger and washes it down with Sprite, creating one of cinema's most tension-filled food moments.",
            foodItems: ["Big Kahuna Burger", "Sprite", "French Fries"],
            thumbnailUrl: "images/scenes/pulp-fiction-burger.jpg",
            thumbnailAlt: "Pulp Fiction - Jules eating Big Kahuna Burger",
            videoUrl: "#",
            significance: "Uses food as a power play and intimidation tactic before violence"
        },
        food: {
            cuisine: "American",
            mealType: "Lunch",
            difficulty: "Easy"
        },
        featured: true
    },
    {
        id: "julie-julia-bruschetta",
        movie: {
            title: "Julie & Julia",
            year: 2009,
            genre: ["Biography", "Drama", "Romance"],
            director: "Nora Ephron",
            imdbId: "tt1135503",
            studio: "Columbia Pictures",
            distributor: "Sony Pictures Releasing"
        },
        scene: {
            timestamp: "0:15:00",
            description: "Julia Child discovers the simple perfection of French bruschetta topped with fresh tomatoes in a Parisian café.",
            foodItems: ["Bruschetta", "Tomatoes", "Bread", "Olive Oil"],
            thumbnailUrl: "images/scenes/julie-julia-bruschetta.jpg",
            thumbnailAlt: "Julie & Julia - Julia Child's first bruschetta in Paris",
            videoUrl: "#",
            significance: "Marks Julia's culinary awakening and love affair with French cuisine"
        },
        food: {
            cuisine: "French",
            mealType: "Lunch",
            difficulty: "Easy"
        },
        featured: false
    },
    {
        id: "spirited-away-feast",
        movie: {
            title: "Spirited Away",
            year: 2001,
            genre: ["Animation", "Adventure", "Family"],
            director: "Hayao Miyazaki",
            imdbId: "tt0245429",
            studio: "Studio Ghibli",
            distributor: "Toho (Japan) / Disney (US)"
        },
        scene: {
            timestamp: "0:45:00",
            description: "Chihiro's parents transform into pigs after greedily devouring the spirit world feast laid out before them.",
            foodItems: ["Various Japanese dishes", "Dumplings", "Roasted meats"],
            thumbnailUrl: "images/scenes/spirited-away-feast.jpg",
            thumbnailAlt: "Spirited Away - Parents transforming while eating spirit food",
            videoUrl: "#",
            significance: "Warning about greed and gluttony with stunning animated food"
        },
        food: {
            cuisine: "Japanese",
            mealType: "Dinner",
            difficulty: "Medium"
        },
        featured: true
    },
    {
        id: "eat-pray-love-pizza",
        movie: {
            title: "Eat Pray Love",
            year: 2010,
            genre: ["Biography", "Drama", "Romance"],
            director: "Ryan Murphy",
            imdbId: "tt0879870",
            studio: "Columbia Pictures",
            distributor: "Sony Pictures Releasing"
        },
        scene: {
            timestamp: "0:30:00",
            description: "Liz Gilbert enjoys her first authentic Neapolitan pizza in Italy, embracing pleasure without guilt.",
            foodItems: ["Margherita Pizza", "Wine"],
            thumbnailUrl: "images/scenes/eat-pray-love-pizza.jpg",
            thumbnailAlt: "Eat Pray Love - Elizabeth Gilbert eating pizza in Naples",
            videoUrl: "#",
            significance: "Represents self-discovery and the joy of indulgence"
        },
        food: {
            cuisine: "Italian",
            mealType: "Lunch",
            difficulty: "Medium"
        },
        featured: false
    },
    {
        id: "chef-pasta-aglio",
        movie: {
            title: "Chef",
            year: 2014,
            genre: ["Adventure", "Comedy", "Drama"],
            director: "Jon Favreau",
            imdbId: "tt2883512",
            studio: "Aldamisa Entertainment",
            distributor: "Open Road Films"
        },
        scene: {
            timestamp: "0:45:00",
            description: "Carl Casper makes pasta aglio e olio for Molly, sharing a intimate moment over simple, perfect pasta.",
            foodItems: ["Pasta", "Garlic", "Olive Oil", "Parsley", "Red Pepper"],
            thumbnailUrl: "images/scenes/chef-pasta-aglio.jpg",
            thumbnailAlt: "Chef - Carl making pasta aglio e olio for Molly",
            videoUrl: "#",
            significance: "Shows how cooking for someone is an act of love"
        },
        food: {
            cuisine: "Italian",
            mealType: "Dinner",
            difficulty: "Easy"
        },
        featured: true
    },
    {
        id: "big-night-timpano",
        movie: {
            title: "Big Night",
            year: 1996,
            genre: ["Drama", "Romance"],
            director: "Campbell Scott, Stanley Tucci",
            imdbId: "tt0115678",
            studio: "Rysher Entertainment",
            distributor: "The Samuel Goldwyn Company"
        },
        scene: {
            timestamp: "1:20:00",
            description: "The brothers unveil the timpano, a massive drum-shaped pasta creation that represents their culinary ambitions.",
            foodItems: ["Timpano", "Pasta", "Eggs", "Meatballs", "Hard-boiled eggs"],
            thumbnailUrl: "images/scenes/big-night-timpano.jpg",
            thumbnailAlt: "Big Night - The timpano reveal moment",
            videoUrl: "#",
            significance: "The ultimate expression of Italian-American culinary artistry"
        },
        food: {
            cuisine: "Italian",
            mealType: "Dinner",
            difficulty: "Hard"
        },
        featured: false
    },
    {
        id: "tampopo-ramen",
        movie: {
            title: "Tampopo",
            year: 1985,
            genre: ["Comedy"],
            director: "Juzo Itami",
            imdbId: "tt0092048",
            studio: "Itami Productions",
            distributor: "Toho (Japan)"
        },
        scene: {
            timestamp: "0:10:00",
            description: "The ramen master teaches the proper way to appreciate ramen, from admiring to slurping.",
            foodItems: ["Ramen", "Noodles", "Pork", "Egg", "Green Onions"],
            thumbnailUrl: "images/scenes/tampopo-ramen.jpg",
            thumbnailAlt: "Tampopo - Master teaching proper ramen appreciation",
            videoUrl: "#",
            significance: "Elevates ramen eating to an art form"
        },
        food: {
            cuisine: "Japanese",
            mealType: "Lunch",
            difficulty: "Hard"
        },
        featured: true
    },
    {
        id: "grand-budapest-pastries",
        movie: {
            title: "The Grand Budapest Hotel",
            year: 2014,
            genre: ["Adventure", "Comedy", "Crime"],
            director: "Wes Anderson",
            imdbId: "tt2278388",
            studio: "Fox Searchlight Pictures",
            distributor: "Fox Searchlight Pictures"
        },
        scene: {
            timestamp: "0:35:00",
            description: "The perfectly pink Mendl's pastry boxes reveal exquisite courtesan au chocolat pastries.",
            foodItems: ["Courtesan au Chocolat", "Pastries"],
            thumbnailUrl: "images/scenes/grand-budapest-pastries.jpg",
            thumbnailAlt: "Grand Budapest Hotel - Mendl's courtesan au chocolat pastries",
            videoUrl: "#",
            significance: "Wes Anderson's aesthetic perfection extends to confectionery"
        },
        food: {
            cuisine: "French",
            mealType: "Dessert",
            difficulty: "Hard"
        },
        featured: false
    },
    {
        id: "hundred-foot-journey-fusion",
        movie: {
            title: "The Hundred-Foot Journey",
            year: 2014,
            genre: ["Drama", "Romance"],
            director: "Lasse Hallström",
            imdbId: "tt2980648",
            studio: "DreamWorks Pictures",
            distributor: "Walt Disney Studios"
        },
        scene: {
            timestamp: "1:05:00",
            description: "Hassan combines Indian spices with French cooking techniques, creating a fusion that wins over Madame Mallory.",
            foodItems: ["French-Indian Fusion", "Spices", "Sauces"],
            thumbnailUrl: "images/scenes/hundred-foot-journey-fusion.jpg",
            thumbnailAlt: "The Hundred-Foot Journey - Hassan's fusion cooking",
            videoUrl: "#",
            significance: "Bridges cultures through culinary innovation"
        },
        food: {
            cuisine: "French-Indian Fusion",
            mealType: "Dinner",
            difficulty: "Hard"
        },
        featured: true
    },
    {
        id: "burnt-fine-dining",
        movie: {
            title: "Burnt",
            year: 2015,
            genre: ["Drama"],
            director: "John Wells",
            imdbId: "tt2503944",
            studio: "The Weinstein Company",
            distributor: "The Weinstein Company"
        },
        scene: {
            timestamp: "0:55:00",
            description: "Adam Jones meticulously plates a dish with surgical precision, pursuing his third Michelin star.",
            foodItems: ["Fine Dining", "Gourmet Plating"],
            thumbnailUrl: "images/scenes/burnt-fine-dining.jpg",
            thumbnailAlt: "Burnt - Adam Jones plating fine dining dish",
            videoUrl: "#",
            significance: "The obsessive pursuit of culinary perfection"
        },
        food: {
            cuisine: "French",
            mealType: "Dinner",
            difficulty: "Hard"
        },
        featured: false
    },
    {
        id: "no-reservations-kitchen",
        movie: {
            title: "No Reservations",
            year: 2007,
            genre: ["Comedy", "Drama", "Romance"],
            director: "Scott Hicks",
            imdbId: "tt0481141",
            studio: "Castle Rock Entertainment",
            distributor: "Warner Bros. Pictures"
        },
        scene: {
            timestamp: "0:40:00",
            description: "Kate prepares a perfect dish in her controlled kitchen environment, showing her culinary expertise.",
            foodItems: ["Gourmet American", "Professional Kitchen"],
            thumbnailUrl: "images/scenes/no-reservations-kitchen.jpg",
            thumbnailAlt: "No Reservations - Kate in professional kitchen",
            videoUrl: "#",
            significance: "Professional kitchen dynamics and perfection"
        },
        food: {
            cuisine: "American",
            mealType: "Dinner",
            difficulty: "Medium"
        },
        featured: false
    }
];

// Image attribution helper
const getAttribution = (movie) => {
    return `© ${movie.studio} - ${movie.title} (${movie.year})`;
};

// Collections data
const collections = {
    oscarWinners: {
        id: "oscar-winners",
        title: "Oscar Winners",
        description: "Academy Award-winning films with memorable food moments",
        sceneIds: ["goodfellas-prison-dinner", "spirited-away-feast"]
    },
    comfortFood: {
        id: "comfort-food",
        title: "Comfort Food Cinema",
        description: "Heartwarming movies featuring soul-satisfying dishes",
        sceneIds: ["ratatouille-final-dish", "julie-julia-bruschetta", "chef-pasta-aglio"]
    },
    international: {
        id: "international-flavors",
        title: "International Flavors",
        description: "A world tour of cuisine through global cinema",
        sceneIds: ["tampopo-ramen", "spirited-away-feast", "eat-pray-love-pizza"]
    },
    dateNight: {
        id: "date-night",
        title: "Date Night Picks",
        description: "Romantic movies with memorable dining scenes",
        sceneIds: ["julie-julia-bruschetta", "eat-pray-love-pizza", "big-night-timpano"]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { movieScenes, collections };
}