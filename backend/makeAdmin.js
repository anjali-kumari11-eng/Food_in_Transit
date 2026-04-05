const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config(); // Load variables from .env

const email = process.argv[2];
if (!email) {
    console.log("❌ Please provide the email of the account you want to make an admin.");
    console.log("Usage: node makeAdmin.js your_email@example.com");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food_in_transit')
    .then(async () => {
        const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
        if (user) {
            console.log(`✅ Successfully promoted ${user.email} to Admin!`);
        } else {
            console.log(`❌ No user found with the email: ${email}`);
            console.log(`Please make sure you have created an account on the website first.`);
        }
        process.exit(0);
    })
    .catch(err => {
        console.error("Database connection error:", err);
        process.exit(1);
    });
