import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import LearningPath from '../src/models/LearningPath.js';

dotenv.config();

const setUserLearningPaths = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the Front-End learning path
    const frontEndPath = await LearningPath.findOne({
      name: 'Front-End Web & Back-End with AI'
    });

    if (!frontEndPath) {
      console.error('❌ Front-End Web & Back-End with AI learning path not found');
      process.exit(1);
    }

    console.log(`📍 Found learning path: ${frontEndPath.name} (ID: ${frontEndPath._id})`);

    // Set learning path for specific users
    const emails = [
      'nurulasna200@gmail.com',
      'ngodingilza609@gmail.com'
    ];

    for (const email of emails) {
      const result = await User.updateOne(
        { email: email },
        {
          learningPathId: frontEndPath._id,
          learningPathName: frontEndPath.name
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated: ${email}`);
      } else {
        console.log(`⚠️  User not found: ${email}`);
      }
    }

    console.log('\n✅ Done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

setUserLearningPaths();
