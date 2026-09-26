import mongoose from "mongoose";

export async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI, { family: 4, maxPoolSize: 5, serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB Atlas connected");
}