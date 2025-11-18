import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const setAdminPassword = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();

    // Find admin user
    const adminEmail = 'admin_1@student.devacademy.id';
    const newPassword = 'admin123'; // Simple password for testing

    console.log(`🔍 Finding admin user: ${adminEmail}...`);
    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    console.log('✅ Password updated successfully!');
    console.log(`
📝 Login Credentials:
  Email: ${adminEmail}
  Password: ${newPassword}
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

setAdminPassword();
