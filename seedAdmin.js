import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const adminData = {
  name: "Admin",
  email: "admin@jamesonhigh.school",
  password: "Admin123!",
  role: "admin"
};

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(adminData.password, salt);

    const admin = new User({ ...adminData, password: hashed });
    await admin.save();
    console.log("Admin created:", adminData.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAdmin();