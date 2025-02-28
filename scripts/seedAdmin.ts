import mongoose from "mongoose";
import { USER_ROLE } from "../constants";
import { User } from "@/models/user.model";
import { env } from "@/config";

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (adminExists) {
      console.log("Admin user already exists.");
    } else {
      const admin = new User({
        username: "Admin",
        email: "admin@example.com",
        password: "Admin@123",
        role: USER_ROLE.ADMIN,
        isVerified: true,
      });

      await admin.save();
      console.log("Admin user created successfully.");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedAdmin();
