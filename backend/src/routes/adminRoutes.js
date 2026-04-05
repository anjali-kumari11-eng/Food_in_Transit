const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/stats', getStats);

// Users
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

// Restaurants
router.route('/restaurants')
    .get(getRestaurants)
    .post(createRestaurant);

router.route('/restaurants/:id')
    .put(updateRestaurant)
    .delete(deleteRestaurant);

// Menu Items
router.route('/menu')
    .get(getMenuItems)
    .post(createMenuItem);

router.route('/menu/:id')
    .put(updateMenuItem)
    .delete(deleteMenuItem);

// Orders
router.get('/orders', getOrders);

module.exports = router;
