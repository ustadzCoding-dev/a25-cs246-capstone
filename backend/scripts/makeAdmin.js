import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const makeAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'nadhifmood@gmail.com';

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`👤 Found user: ${user.name} (${user.email})`);
    console.log(`📝 Current role: ${user.role}`);

    // Update role to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ Role updated to: ${user.role}`);
    console.log(`✅ User ${email} is now SUPER ADMIN!`);
    console.log(`\n📝 NEXT STEPS:`);
    console.log(`1. Logout dari aplikasi (click "Keluar dari akun")`);
    console.log(`2. Login lagi dengan Google`);
    console.log(`3. Seharusnya langsung ke admin dashboard`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

makeAdmin();
