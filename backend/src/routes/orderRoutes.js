const express = require('express');
const { createOrder, getUserOrders, getOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, updateOrderStatus); // Used by mock script to update status

module.exports = router;
