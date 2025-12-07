const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');
require('dotenv').config();

const vendorEmails = [
    'python7760@gmail.com',
    'aditisinha778@gmail.com',
    'aditisinha0706@gmail.com',
    'aditisinha3276@gmail.com'
];

async function updateVendorEmails() {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGODB_URI not found in .env');
        }

        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        const vendors = await Vendor.find().sort({ created_at: 1 });
        console.log(`Found ${vendors.length} vendors.`);

        for (let i = 0; i < vendors.length; i++) {
            if (i < vendorEmails.length) {
                vendors[i].email = vendorEmails[i];
                await vendors[i].save();
                console.log(`Updated vendor ${vendors[i].name} with email ${vendors[i].email}`);
            }
        }

        console.log('Vendor emails updated successfully!');
    } catch (error) {
        console.error('Error updating vendor emails:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit();
    }
}

updateVendorEmails();
