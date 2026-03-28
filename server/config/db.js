import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(
      "ERROR: Could not connect to MongoDB. Check your MONGO_URI in .env >>",
      err.message
    );
    process.exit(1);
  }
};

export default connectDB;