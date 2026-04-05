const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a restaurant name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    phone: {
        type: String,
        default: ''
    },
    openTime: {
        type: String,
        default: '09:00'
    },
    closeTime: {
        type: String,
        default: '23:00'
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must can not be more than 5'],
        default: 4.0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    deliveryTime: {
        type: String,
        required: true,
        default: "30-45 mins"
    },
    deliveryFee: {
        type: Number,
        default: 2.99
    },
    cuisines: {
        type: [String],
        required: true
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    featured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
