const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const DeliveryPartner = require('../models/DeliveryPartner');

// @desc    Seed mock data
// @route   POST /api/seed
// @access  Public (for demo purposes)
exports.seedData = async (req, res) => {
    try {
        await Restaurant.deleteMany();
        await MenuItem.deleteMany();
        await DeliveryPartner.deleteMany();

        const restaurants = await Restaurant.insertMany([
            {
                name: "Domino's Pizza",
                description: "Famous for pizza and fast food. Freshly baked with premium toppings.",
                address: { street: "123 Main St", city: "New York", state: "NY", zipcode: "10001" },
                phone: "+1-212-555-0101",
                openTime: "10:00",
                closeTime: "23:00",
                rating: 4.2,
                numReviews: 328,
                deliveryTime: "30 mins",
                deliveryFee: 1.99,
                cuisines: ["Pizza", "Italian", "Fast Food"],
                featured: true,
                image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80"
            },
            {
                name: "KFC",
                description: "Finger Lickin' Good fried chicken. Crispy, juicy, and irresistible.",
                address: { street: "456 Oak St", city: "New York", state: "NY", zipcode: "10002" },
                phone: "+1-212-555-0202",
                openTime: "09:00",
                closeTime: "22:00",
                rating: 4.5,
                numReviews: 512,
                deliveryTime: "45 mins",
                deliveryFee: 2.49,
                cuisines: ["American", "Chicken", "Fast Food"],
                featured: true,
                image: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=600&auto=format&fit=crop&q=80"
            },
            {
                name: "Burger King",
                description: "Home of the Whopper. Flame-grilled burgers made your way.",
                address: { street: "789 Pine St", city: "New York", state: "NY", zipcode: "10003" },
                phone: "+1-212-555-0303",
                openTime: "08:00",
                closeTime: "00:00",
                rating: 4.0,
                numReviews: 245,
                deliveryTime: "25 mins",
                deliveryFee: 1.49,
                cuisines: ["Burger", "American", "Fast Food"],
                featured: false,
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"
            },
            {
                name: "Taj Mahal Indian Cuisine",
                description: "Authentic Indian curries, tandoori specialties, and freshly baked breads.",
                address: { street: "101 Elm St", city: "New York", state: "NY", zipcode: "10004" },
                phone: "+1-212-555-0404",
                openTime: "11:00",
                closeTime: "23:30",
                rating: 4.8,
                numReviews: 679,
                deliveryTime: "50 mins",
                deliveryFee: 2.99,
                cuisines: ["Indian", "Curry", "Tandoori"],
                featured: true,
                image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80"
            },
            {
                name: "Sushi Palace",
                description: "Premium Japanese sushi and sashimi. Fresh from the ocean to your plate.",
                address: { street: "202 Cherry Ln", city: "New York", state: "NY", zipcode: "10005" },
                phone: "+1-212-555-0505",
                openTime: "11:30",
                closeTime: "22:30",
                rating: 4.6,
                numReviews: 412,
                deliveryTime: "40 mins",
                deliveryFee: 3.49,
                cuisines: ["Japanese", "Sushi", "Asian"],
                featured: false,
                image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80"
            },
            {
                name: "Green Bowl Salads",
                description: "Healthy, fresh salads and smoothie bowls for the health-conscious.",
                address: { street: "303 Vine St", city: "New York", state: "NY", zipcode: "10006" },
                phone: "+1-212-555-0606",
                openTime: "07:00",
                closeTime: "20:00",
                rating: 4.4,
                numReviews: 198,
                deliveryTime: "20 mins",
                deliveryFee: 0.99,
                cuisines: ["Healthy", "Salads", "Vegan"],
                featured: false,
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80"
            }
        ]);

        await DeliveryPartner.insertMany([
            { name: "John Doe", phone: "1234567890", status: "Available", rating: 4.8 },
            { name: "Jane Smith", phone: "0987654321", status: "Available", rating: 4.9 },
            { name: "Ravi Kumar", phone: "5556667777", status: "Available", rating: 4.7 }
        ]);

        await MenuItem.insertMany([
            // Domino's Pizza menu
            {
                name: "Margherita Pizza",
                description: "Classic plain cheese pizza with fresh basil and mozzarella",
                price: 12.99, discount: 10, category: "Main Course", isVeg: true,
                restaurant: restaurants[0]._id,
                image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Pepperoni Pizza",
                description: "Spicy pepperoni over melted cheese on a crispy crust",
                price: 14.99, discount: 0, category: "Main Course", isVeg: false,
                restaurant: restaurants[0]._id,
                image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Garlic Bread",
                description: "Toasted bread with garlic butter and herbs",
                price: 4.99, discount: 0, category: "Sides", isVeg: true,
                restaurant: restaurants[0]._id,
                image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Coca-Cola",
                description: "Chilled 500ml can",
                price: 1.99, discount: 0, category: "Beverages", isVeg: true,
                restaurant: restaurants[0]._id,
                image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&auto=format&fit=crop&q=80"
            },
            // KFC menu
            {
                name: "Zinger Burger",
                description: "Spicy crispy chicken burger with mayo and lettuce",
                price: 8.99, discount: 15, category: "Main Course", isVeg: false,
                restaurant: restaurants[1]._id,
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Chicken Wings (6 pcs)",
                description: "Hot and crispy buffalo-style wings",
                price: 5.99, discount: 0, category: "Starters", isVeg: false,
                restaurant: restaurants[1]._id,
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Coleslaw",
                description: "Fresh creamy coleslaw side dish",
                price: 2.49, discount: 0, category: "Sides", isVeg: true,
                restaurant: restaurants[1]._id,
                image: "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=500&auto=format&fit=crop&q=80"
            },
            // Burger King menu
            {
                name: "Whopper",
                description: "Quarter-pound flame-grilled beef patty with all the fixings",
                price: 9.99, discount: 20, category: "Main Course", isVeg: false,
                restaurant: restaurants[2]._id,
                image: "https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Veggie Burger",
                description: "Plant-based patty with fresh vegetables",
                price: 7.99, discount: 0, category: "Main Course", isVeg: true,
                restaurant: restaurants[2]._id,
                image: "https://images.unsplash.com/photo-1520072959219-c595e6cdc07a?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Onion Rings",
                description: "Crispy golden battered onion rings",
                price: 3.49, discount: 0, category: "Starters", isVeg: true,
                restaurant: restaurants[2]._id,
                image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&auto=format&fit=crop&q=80"
            },
            // Taj Mahal menu
            {
                name: "Chicken Tikka Masala",
                description: "Creamy, spiced tomato-based curry with tender chicken pieces",
                price: 15.99, discount: 0, category: "Main Course", isVeg: false,
                restaurant: restaurants[3]._id,
                image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Paneer Butter Masala",
                description: "Rich and creamy cottage cheese curry",
                price: 13.99, discount: 10, category: "Main Course", isVeg: true,
                restaurant: restaurants[3]._id,
                image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Garlic Naan",
                description: "Fresh wood-fired flatbread with garlic and butter",
                price: 3.99, discount: 0, category: "Breads", isVeg: true,
                restaurant: restaurants[3]._id,
                image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Samosa (2 pcs)",
                description: "Crispy fried pastry filled with spiced potatoes and peas",
                price: 4.49, discount: 0, category: "Starters", isVeg: true,
                restaurant: restaurants[3]._id,
                image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Mango Lassi",
                description: "Sweet yogurt-based mango smoothie",
                price: 3.99, discount: 5, category: "Beverages", isVeg: true,
                restaurant: restaurants[3]._id,
                image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&auto=format&fit=crop&q=80"
            },
            // Sushi Palace menu
            {
                name: "Salmon Sashimi",
                description: "8 pieces of fresh premium Atlantic salmon",
                price: 18.99, discount: 0, category: "Main Course", isVeg: false,
                restaurant: restaurants[4]._id,
                image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "California Roll",
                description: "Crab, avocado, and cucumber roll with sesame",
                price: 12.99, discount: 15, category: "Main Course", isVeg: false,
                restaurant: restaurants[4]._id,
                image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Miso Soup",
                description: "Traditional Japanese soybean soup with tofu and seaweed",
                price: 3.99, discount: 0, category: "Starters", isVeg: true,
                restaurant: restaurants[4]._id,
                image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=80"
            },
            // Green Bowl menu
            {
                name: "Caesar Salad",
                description: "Romaine lettuce, croutons, parmesan with creamy caesar dressing",
                price: 9.99, discount: 0, category: "Main Course", isVeg: true,
                restaurant: restaurants[5]._id,
                image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Acai Smoothie Bowl",
                description: "Blended acai topped with granola, berries, and honey",
                price: 11.99, discount: 10, category: "Desserts", isVeg: true,
                restaurant: restaurants[5]._id,
                image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&auto=format&fit=crop&q=80"
            },
            {
                name: "Green Detox Juice",
                description: "Kale, celery, apple, ginger fresh pressed juice",
                price: 6.99, discount: 0, category: "Beverages", isVeg: true,
                restaurant: restaurants[5]._id,
                image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500&auto=format&fit=crop&q=80"
            }
        ]);

        res.status(200).json({ success: true, message: 'Data Seeded Successfully! 6 restaurants, 21 menu items, 3 delivery partners.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
