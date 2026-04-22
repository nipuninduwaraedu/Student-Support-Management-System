import mongoose from "mongoose";

const connectDB = async () => {
  const uri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student_support";
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log("MongoDB connected");
};

export default connectDB;
