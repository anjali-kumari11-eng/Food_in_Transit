const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const restaurantCount = await Restaurant.countDocuments();
        const orderCount = await Order.countDocuments();
        const menuItemCount = await MenuItem.countDocuments();

        const orders = await Order.find({ status: { $ne: 'Cancelled' } });
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        // Recent orders for dashboard
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .populate('restaurant', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                users: userCount,
                restaurants: restaurantCount,
                orders: orderCount,
                menuItems: menuItemCount,
                revenue: totalRevenue,
                recentOrders
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        await user.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// ========================
// RESTAURANT CRUD
// ========================

// @desc    Get all restaurants (admin - includes inactive)
// @route   GET /api/admin/restaurants
const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create restaurant
// @route   POST /api/admin/restaurants
const createRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json({ success: true, data: restaurant });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update restaurant
// @route   PUT /api/admin/restaurants/:id
const updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!restaurant) return res.status(404).json({ success: false, error: 'Restaurant not found' });
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete restaurant
// @route   DELETE /api/admin/restaurants/:id
const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ success: false, error: 'Restaurant not found' });
        // Delete all menu items for this restaurant
        await MenuItem.deleteMany({ restaurant: req.params.id });
        await restaurant.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// ========================
// MENU ITEM CRUD
// ========================

// @desc    Get all menu items (optionally by restaurant)
// @route   GET /api/admin/menu?restaurant=xxx
const getMenuItems = async (req, res) => {
    try {
        let query = {};
        if (req.query.restaurant) {
            query.restaurant = req.query.restaurant;
        }
        const items = await MenuItem.find(query).populate('restaurant', 'name');
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create menu item
// @route   POST /api/admin/menu
const createMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update menu item
// @route   PUT /api/admin/menu/:id
const updateMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!item) return res.status(404).json({ success: false, error: 'Menu item not found' });
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete menu item
// @route   DELETE /api/admin/menu/:id
const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, error: 'Menu item not found' });
        await item.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('restaurant', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

module.exports = {
    getStats,
    getUsers,
    deleteUser,
    getRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getOrders
};
