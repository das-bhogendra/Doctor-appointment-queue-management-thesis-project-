import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/prescripto");

    console.log("Database Connected!");
  } catch (error) {
    console.log("DB Connection Error:", error);
  }
};

export default connectDB;