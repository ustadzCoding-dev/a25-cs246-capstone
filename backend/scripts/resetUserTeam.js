import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

async function resetUserTeam(email) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User "${email}" not found`);
      await mongoose.disconnect();
      return;
    }

    console.log(`\n📋 Found user: ${user.name} (${user.email})`);
    console.log(`   Current capstoneGroupId: ${user.capstoneGroupId || 'null'}`);

    // Reset capstoneGroupId
    user.capstoneGroupId = null;
    await user.save();

    console.log(`✅ Reset capstoneGroupId to null`);
    console.log(`\n✅ User "${email}" reset successfully!\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.log('Usage: node scripts/resetUserTeam.js "email@example.com"');
  console.log('Example: node scripts/resetUserTeam.js "nurulasna200@gmail.com"');
  process.exit(1);
}

resetUserTeam(email);
