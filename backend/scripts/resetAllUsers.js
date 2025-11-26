import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

async function resetAllUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users with capstoneGroupId
    const usersWithTeam = await User.find({ capstoneGroupId: { $ne: null } });
    console.log(`\n📋 Found ${usersWithTeam.length} users with capstoneGroupId`);

    if (usersWithTeam.length === 0) {
      console.log('✅ No users to reset');
      await mongoose.disconnect();
      return;
    }

    // Reset all capstoneGroupId to null
    const result = await User.updateMany(
      { capstoneGroupId: { $ne: null } },
      { $set: { capstoneGroupId: null } }
    );

    console.log(`\n✅ Reset ${result.modifiedCount} users' capstoneGroupId to null`);
    console.log(`\n✅ All users reset successfully!\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

resetAllUsers();
