import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import CapstoneGroup from '../models/CapstoneGroup.js';
import Document from '../models/Document.js';
import Timeline from '../models/Timeline.js';
import Announcement from '../models/Announcement.js';
import UseCase from '../models/UseCase.js';
import LearningGroup from '../models/LearningGroup.js';

dotenv.config();

const clearDatabase = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();

    console.log('🗑️  Clearing all collections...');

    // Clear all collections
    await User.deleteMany({});
    console.log('✅ Users cleared');

    await CapstoneGroup.deleteMany({});
    console.log('✅ CapstoneGroups cleared');

    await Document.deleteMany({});
    console.log('✅ Documents cleared');

    await Timeline.deleteMany({});
    console.log('✅ Timelines cleared');

    await Announcement.deleteMany({});
    console.log('✅ Announcements cleared');

    await UseCase.deleteMany({});
    console.log('✅ UseCases cleared');

    await LearningGroup.deleteMany({});
    console.log('✅ LearningGroups cleared');

    console.log('\n✨ Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
