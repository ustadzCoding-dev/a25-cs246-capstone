import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/index.js';
import logger from '../utils/logger.js';

dotenv.config();

const fixAdminRole = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB Connected');

    // Update admin role
    const result = await User.updateOne(
      { email: 'admin_1@student.devacademy.id' },
      { $set: { role: 'admin' } }
    );

    if (result.modifiedCount > 0) {
      logger.info('✅ Admin role updated successfully');
      
      // Verify
      const admin = await User.findOne({ email: 'admin_1@student.devacademy.id' });
      logger.info(`Admin: ${admin.name} - Role: ${admin.role}`);
    } else {
      logger.warn('⚠️  No changes made - admin might already have correct role');
      
      const admin = await User.findOne({ email: 'admin_1@student.devacademy.id' });
      if (admin) {
        logger.info(`Current admin role: ${admin.role}`);
      } else {
        logger.error('Admin user not found!');
      }
    }

    process.exit(0);
  } catch (error) {
    logger.error('Error:', error);
    process.exit(1);
  }
};

fixAdminRole();
