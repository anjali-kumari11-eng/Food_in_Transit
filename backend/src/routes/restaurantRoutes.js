const express = require('express');
const { getRestaurants, getRestaurant, getRestaurantMenu } = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurant);
router.get('/:id/menu', getRestaurantMenu);

module.exports = router;
