const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food_in_transit')
    .then(async () => {
        let user = await User.findOne({ email: '23je0193@iitism.ac.in' });
        if (user) {
            user.role = 'admin';
            user.password = 'Preeti_01!';
            await user.save();
            console.log('User already existed. Updated their password and made them admin!');
        } else {
            await User.create({
                name: 'Admin Preeti',
                email: '23je0193@iitism.ac.in',
                password: 'Preeti_01!',
                role: 'admin'
            });
            console.log('Created new Admin user successfully!');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error("Database connection error:", err);
        process.exit(1);
    });
