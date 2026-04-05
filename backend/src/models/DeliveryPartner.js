const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    status: {
        type: String,
        enum: ['Available', 'Busy', 'Offline'],
        default: 'Available'
    },
    currentLocation: {
        lat: Number,
        lng: Number
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 4.5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
