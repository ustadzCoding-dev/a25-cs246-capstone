import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LearningPath from '../src/models/LearningPath.js';

dotenv.config();

const migrateLearningPaths = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all existing learning paths
    const deleteResult = await LearningPath.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} old learning paths`);

    // Define new learning paths with dicodingIdPrefix
    const learningPaths = [
      {
        name: 'Front-End Web & Back-End with AI',
        code: 'FE_BE_AI',
        description: 'Fokus pada pengembangan front-end web dan back-end dengan integrasi AI',
        isActive: true,
        dicodingIdPrefix: 'FEBE'
      },
      {
        name: 'React & Back-End with AI',
        code: 'REACT_BE_AI',
        description: 'Spesialisasi dalam React framework dan back-end development dengan AI',
        isActive: true,
        dicodingIdPrefix: 'REBE'
      },
      {
        name: 'Machine Learning',
        code: 'ML',
        description: 'Fokus pada machine learning dan data science',
        isActive: true,
        dicodingIdPrefix: 'ML'
      }
    ];

    // Insert new learning paths
    const inserted = await LearningPath.insertMany(learningPaths);
    console.log(`✅ Successfully migrated ${inserted.length} learning paths:`);
    inserted.forEach(path => {
      console.log(`   • ${path.name} (${path.code}) - Prefix: ${path.dicodingIdPrefix}`);
    });

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error migrating learning paths:', err.message);
    process.exit(1);
  }
};

migrateLearningPaths();
