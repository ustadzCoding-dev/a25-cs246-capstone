import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

dotenv.config();

async function fixAdminRole() {
  try {
    await connectDB();
    logger.info('Connected to database');

    // Admin email from CSV
    const adminEmail = 'admin_1@student.devacademy.id';

    // Find admin user
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      logger.error(`Admin user not found: ${adminEmail}`);
      process.exit(1);
    }

    logger.info(`Found user: ${adminUser.email}`);
    logger.info(`Current role: ${adminUser.role}`);

    // Update role to admin if not already
    if (adminUser.role !== 'admin') {
      adminUser.role = 'admin';
      await adminUser.save();
      logger.info(`✅ Updated role to: ${adminUser.role}`);
    } else {
      logger.info(`✅ Role already set to admin`);
    }

    logger.info('✅ Admin role fix complete!');
    process.exit(0);
  } catch (error) {
    logger.error('Error fixing admin role:', error);
    process.exit(1);
  }
}

fixAdminRole();
