import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CapstoneGroup from '../src/models/CapstoneGroup.js';
import Invitation from '../src/models/Invitation.js';
import User from '../src/models/User.js';

dotenv.config();

async function deleteTeam(teamName) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find team
    const team = await CapstoneGroup.findOne({ teamName });
    if (!team) {
      console.log(`❌ Team "${teamName}" not found`);
      await mongoose.disconnect();
      return;
    }

    console.log(`\n📋 Found team: ${team.teamName}`);
    console.log(`   ID: ${team._id}`);
    console.log(`   Members: ${team.membersUserId.length}`);

    // Delete invitations
    const deletedInvitations = await Invitation.deleteMany({ teamId: team._id });
    console.log(`\n🗑️  Deleted ${deletedInvitations.deletedCount} invitations`);

    // Reset members' capstoneGroupId
    await User.updateMany(
      { _id: { $in: team.membersUserId } },
      { $set: { capstoneGroupId: null } }
    );
    console.log(`✅ Reset ${team.membersUserId.length} members' team ID`);

    // Delete team
    await CapstoneGroup.findByIdAndDelete(team._id);
    console.log(`\n✅ Team "${teamName}" deleted successfully!\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

// Get team name from command line argument
const teamName = process.argv[2];
if (!teamName) {
  console.log('Usage: node scripts/deleteTeam.js "Team Name"');
  console.log('Example: node scripts/deleteTeam.js "Tim Koding"');
  process.exit(1);
}

deleteTeam(teamName);
