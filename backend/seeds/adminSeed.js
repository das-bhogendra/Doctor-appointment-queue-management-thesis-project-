import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import "dotenv/config";

const createAdmin = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/prescripto");

    const email = "admin@gmail.com";

    const existingAdmin = await userModel.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("radhekrishna@123", 10);

    const admin = new userModel({
      name: "admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    console.log("Admin created successfully 🚀");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

createAdmin();