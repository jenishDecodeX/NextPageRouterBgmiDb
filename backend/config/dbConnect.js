// backend/dbConnect.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGODB_URI);

  console.log("✅ MongoDB connected to jenish-bgmi");
}

export default dbConnect;
