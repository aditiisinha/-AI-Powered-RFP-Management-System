const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');
require('dotenv').config();

const vendors = [
    {
        name: 'TechSolutions Inc.',
        email: 'contact@techsolutions.com',
        contact_person: 'John Smith',
        phone: '555-0123',
        address: '123 Tech Park, Silicon Valley, CA'
    },
    {
        name: 'SecureNet Systems',
        email: 'info@securenet.com',
        contact_person: 'Sarah Johnson',
        phone: '555-0456',
        address: '456 Security Blvd, Austin, TX'
    },
    {
        name: 'Digital Innovators',
        email: 'hello@digitalinnovators.io',
        contact_person: 'Mike Chen',
        phone: '555-0789',
        address: '789 Innovation Ave, New York, NY'
    },
    {
        name: 'DataFlow Analytics',
        email: 'support@dataflow.com',
        contact_person: 'Emily Davis',
        phone: '555-1011',
        address: '101 Data Drive, Boston, MA'
    }
];

async function seedVendors() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if vendors already exist
        const count = await Vendor.countDocuments();
        if (count > 0) {
            console.log('Vendors already exist. Skipping seed.');
        } else {
            await Vendor.insertMany(vendors);
            console.log('Vendors seeded successfully!');
        }
    } catch (error) {
        console.error('Error seeding vendors:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit();
    }
}

seedVendors();
