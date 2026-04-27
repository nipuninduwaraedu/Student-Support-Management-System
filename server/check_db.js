import mongoose from "mongoose";

async function run() {
  await mongoose.connect("mongodb://127.0.0.1:27017/mern-auth");
  const db = mongoose.connection.db;
  const notifs = await db.collection("notifications").find({}).toArray();
  console.log("Notifications:", notifs);
  const users = await db.collection("users").find({}).toArray();
  console.log("Users:", users);
  process.exit();
}
run();
