const Order = require('../models/Order');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { restaurant, items, totalAmount, deliveryAddress } = req.body;

        const order = await Order.create({
            user: req.user.id,
            restaurant,
            items,
            totalAmount,
            deliveryAddress,
            status: 'Pending'
        });

        // Emit socket event to the specific room (order string ID)
        if (req.io) {
            req.io.to(order._id.toString()).emit('orderStatusUpdate', {
                status: order.status,
                message: 'Order created locally successfully'
            });
        }

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get user orders history
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('restaurant').sort('-orderedAt');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get single order tracking info
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('restaurant', 'name address phone')
            .populate('deliveryPartner', 'name phone rating currentLocation');

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to view this order' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Update Order Status (Simulating admin/restaurant actions)
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        let order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        
        order.status = status;
        
        if(status === 'Picked') {
            order.pickedAt = Date.now();
        } else if(status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        await order.save();

        if (req.io) {
            req.io.to(order._id.toString()).emit('orderStatusUpdate', {
                status: order.status,
                message: `Order is now ${status}`
            });
        }

        res.status(200).json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
