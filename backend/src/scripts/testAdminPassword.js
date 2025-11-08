import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/index.js';

dotenv.config();

const testPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const admin = await User.findOne({ email: 'admin_1@student.devacademy.id' });
    
    if (!admin) {
      console.log('❌ Admin not found!');
      process.exit(1);
    }

    console.log('Admin found:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Password hash:', admin.passwordHash);

    // Test password
    const isMatch = await bcrypt.compare('admin123', admin.passwordHash);
    console.log('\nPassword "admin123" match:', isMatch ? '✅ YES' : '❌ NO');

    if (!isMatch) {
      console.log('\n🔧 Fixing password...');
      const newHash = await bcrypt.hash('admin123', 10);
      admin.passwordHash = newHash;
      await admin.save();
      console.log('✅ Password updated!');
      
      // Test again
      const isMatchNow = await bcrypt.compare('admin123', admin.passwordHash);
      console.log('Password now match:', isMatchNow ? '✅ YES' : '❌ NO');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testPassword();
