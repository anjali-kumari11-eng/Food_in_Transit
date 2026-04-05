const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isActive: true });
        res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ success: false, error: 'Restaurant not found' });
        }

        res.status(200).json({ success: true, data: restaurant });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get menu for a restaurant
// @route   GET /api/restaurants/:id/menu
// @access  Public
exports.getRestaurantMenu = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ restaurant: req.params.id });
        res.status(200).json({ success: true, count: menuItems.length, data: menuItems });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
