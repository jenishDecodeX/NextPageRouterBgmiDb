// backend/dbConnect.js
import mongoose from "mongoose";

const MONGODB_URI ="mongodb+srv://jenishdecodex:Jenish0609@jenishbgmi.snj3keb.mongodb.net/jenish_bgmi?retryWrites=true&w=majority";

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGODB_URI);

  console.log("✅ MongoDB connected to jenish-bgmi");
}

export default dbConnect;
