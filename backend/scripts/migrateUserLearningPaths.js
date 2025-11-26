import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import LearningPath from '../src/models/LearningPath.js';

dotenv.config();

const migrateUserLearningPaths = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all learning paths
    const learningPaths = await LearningPath.find();
    console.log(`📚 Found ${learningPaths.length} learning paths`);

    // Create mapping from name to ID
    const pathNameToId = {};
    learningPaths.forEach(lp => {
      pathNameToId[lp.name] = lp._id;
    });

    // Find all users with learningPath (old field)
    const usersWithOldField = await User.find({
      learningPath: { $exists: true, $ne: null }
    });

    console.log(`👥 Found ${usersWithOldField.length} users with old learningPath field`);

    // Migrate each user
    let migratedCount = 0;
    for (const user of usersWithOldField) {
      const learningPathName = user.learningPath;
      const learningPathId = pathNameToId[learningPathName];

      if (learningPathId) {
        await User.updateOne(
          { _id: user._id },
          {
            learningPathId: learningPathId,
            learningPathName: learningPathName
          }
        );
        migratedCount++;
        console.log(`✅ Migrated: ${user.email} → ${learningPathName}`);
      } else {
        console.log(`⚠️  Skipped: ${user.email} (learning path not found: ${learningPathName})`);
      }
    }

    console.log(`\n✅ Migration completed! Migrated ${migratedCount} users`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error migrating users:', err.message);
    process.exit(1);
  }
};

migrateUserLearningPaths();
