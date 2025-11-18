import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import UseCase from '../models/UseCase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvDir = path.join(__dirname, '../../../docs/DataSetTim_CSV_Export');

/**
 * Parse CSV file
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

/**
 * Setup test data from CSV
 */
const setupTestData = async () => {
  try {
    console.log('🔧 Setting up test data from CSV...');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Import users from CSV
    console.log('📥 Importing users from CSV...');
    const csvPath = path.join(csvDir, 'users.csv');
    const csvData = await parseCSV(csvPath);

    // Hash passwords
    const testPassword = await bcrypt.hash('TestPassword123!', 10);

    // Map CSV data to user objects
    const users = csvData.map((row) => ({
      dicodingId: row.id || 'TEMP_' + Math.random().toString(36).substr(2, 9),
      email: row.email,
      name: row.name,
      learningPath: row.learning_path || null,
      university: row.university || null,
      role: (row.role || 'STUDENT').toLowerCase(),
      provider: 'local',
      isEmailVerified: true,
      password: testPassword
    }));

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Imported ${createdUsers.length} users from CSV`);

    // Create test use cases if not exist
    const existingUseCases = await UseCase.countDocuments();
    if (existingUseCases === 0) {
      const testUseCases = [
        {
          usecaseId: 'UC001',
          title: 'E-Commerce Platform',
          description: 'Build a full-stack e-commerce platform',
          partner: 'Dicoding',
          totalSlots: 10,
          availableSlots: 10,
          difficulty: 'intermediate',
          status: 'open'
        },
        {
          usecaseId: 'UC002',
          title: 'Social Media App',
          description: 'Build a social media application',
          partner: 'Dicoding',
          totalSlots: 8,
          availableSlots: 8,
          difficulty: 'advanced',
          status: 'open'
        }
      ];

      await UseCase.insertMany(testUseCases);
      console.log(`✅ Created ${testUseCases.length} test use cases`);
    } else {
      console.log(`⏭️  Use cases already exist (${existingUseCases})`);
    }

    // Find admin and students for display
    const admin = users.find(u => u.role === 'admin');
    const students = users.filter(u => u.role === 'student').slice(0, 3);

    console.log('\n✅ Test data setup complete!');
    console.log('\n📝 Test Accounts (Password: TestPassword123!):');

    if (admin) {
      console.log('\nADMIN:');
      console.log(`  Email: ${admin.email}`);
      console.log(`  Name: ${admin.name}`);
      console.log('  Password: TestPassword123!');
    }

    students.forEach((student, index) => {
      console.log(`\nSTUDENT ${index + 1}:`);
      console.log(`  Email: ${student.email}`);
      console.log(`  Name: ${student.name}`);
      console.log(`  Learning Path: ${student.learningPath}`);
      console.log('  Password: TestPassword123!');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up test data:', error.message);
    process.exit(1);
  }
};

// Run setup
setupTestData();
