const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.ObjectId,
                ref: 'MenuItem',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Picked', 'Out_for_delivery', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    deliveryPartner: {
        type: mongoose.Schema.ObjectId,
        ref: 'DeliveryPartner'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    orderedAt: {
        type: Date,
        default: Date.now
    },
    pickedAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    }
});

module.exports = mongoose.model('Order', orderSchema);
