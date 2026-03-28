const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('ERROR: Could not connect to MongoDB. Is MongoDB running locally? >>', err.message);
        process.exit(1);
    }
};
module.exports = connectDB;
