import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LearningPath from '../src/models/LearningPath.js';

dotenv.config();

const seedLearningPaths = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if learning paths already exist
    const existingCount = await LearningPath.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Learning paths already exist (${existingCount} found)`);
      console.log('📝 Skipping seed...');
      process.exit(0);
    }

    // Define learning paths
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

    // Insert learning paths
    const inserted = await LearningPath.insertMany(learningPaths);
    console.log(`✅ Successfully seeded ${inserted.length} learning paths:`);
    inserted.forEach(path => {
      console.log(`   • ${path.name} (${path.code})`);
    });

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding learning paths:', err.message);
    process.exit(1);
  }
};

seedLearningPaths();
