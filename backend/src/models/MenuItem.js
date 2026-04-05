const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a menu item name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    category: {
        type: String,
        enum: ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Breads', 'Sides'],
        required: true
    },
    isVeg: {
        type: Boolean,
        default: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: 'default-item.jpg'
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
