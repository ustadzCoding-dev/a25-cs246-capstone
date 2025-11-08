import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { User, CapstoneGroup } from '../models/index.js';
import logger from '../utils/logger.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB Connected for seeding');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample users data based on CSV
const usersData = [
  // Admin
  {
    dicodingId: 'ADMIN_1',
    name: 'Paramita Zulaika',
    email: 'admin_1@student.devacademy.id',
    password: 'admin123',
    role: 'admin',
    learningPath: 'Front-End',
    university: 'Dicoding Indonesia',
    phoneNumber: '081234567890'
  },
  // Front-End Students
  {
    dicodingId: 'FUI0001',
    name: 'Lutfan Gunawan',
    email: 'fui0001@student.devacademy.id',
    password: 'password123',
    role: 'student',
    learningPath: 'Front-End',
    university: 'Universitas Indonesia'
  },
  {
    dicodingId: 'FUI0002',
    name: 'Darimin Jailani',
    email: 'fui0002@student.devacademy.id',
    password: 'password123',
    role: 'student',
    learningPath: 'Front-End',
    university: 'Universitas Indonesia',
  },
  {
    dicodingId: 'FITB0004',
    name: 'Dinda Yulianti',
    email: 'fitb0004@student.devacademy.id',
    password: 'password123',
    role: 'student',
    learningPath: 'Front-End',
    university: 'Institut Teknologi Bandung'
  },
  {
    dicodingId: 'FITB0005',
    name: 'Maras Dongoran',
    email: 'fitb0005@student.devacademy.id',
    password: 'password123',
    role: 'student',
    learningPath: 'Front-End',
    university: 'Institut Teknologi Bandung',
  },
  // Machine Learning Students
  {
    dicodingId: 'MUI0021',
    name: 'Anastasia Utami',
    email: 'mui0021@student.devacademy.id',
    password: 'password123',
    role: 'student',
    learningPath: 'Machine Learning',
    university: 'Universitas Indonesia'
  },
  {
    dicodingId: 'MUI0022',
    name: 'Daliono Saptono',
    email: 'mui0022@student.devacademy.id',
    password: 'password123',
    role: 'student',
    learningPath: 'Machine Learning',
    university: 'Universitas Indonesia',
  },
  {
    dicodingId: 'MITB0024',
    name: 'Tantri Zulaika',
    email: 'mitb0024@student.devacademy.id',
    password: 'password123',
    role: 'student',
    learningPath: 'Machine Learning',
    university: 'Institut Teknologi Bandung'
  },
  {
    dicodingId: 'MITB0025',
    name: 'Icha Riyanti',
    email: 'mitb0025@student.devacademy.id',
    password: 'password123',
    role: 'student',
    learningPath: 'Machine Learning',
    university: 'Institut Teknologi Bandung',
  },
  // React Students
  {
    dicodingId: 'RUI0041',
    name: 'Cahyadi Putra',
    email: 'rui0041@student.devacademy.id',
    password: 'password123',
    role: 'student',
    learningPath: 'React',
    university: 'Universitas Indonesia'
  },
  {
    dicodingId: 'RUI0042',
    name: 'Cayadi Hakim',
    email: 'rui0042@student.devacademy.id',
    password: 'password123',
    role: 'student',
    learningPath: 'React',
    university: 'Universitas Indonesia',
  },
  {
    dicodingId: 'RITB0044',
    name: 'Diana Uyainah',
    email: 'ritb0044@student.devacademy.id',
    password: 'password123',
    role: 'student',
    learningPath: 'React',
    university: 'Institut Teknologi Bandung'
  },
  {
    dicodingId: 'RITB0045',
    name: 'Harjaya Dongoran',
    email: 'ritb0045@student.devacademy.id',
    password: 'password123',
    role: 'student',
    learningPath: 'React',
    university: 'Institut Teknologi Bandung',
  }
];

// Seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    logger.info('Cleared existing users');

    // Create users with hashed passwords
    const users = [];
    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const { password, ...userDataWithoutPassword } = userData;
      const user = await User.create({
        ...userDataWithoutPassword,
        passwordHash: hashedPassword
      });
      users.push(user);
      logger.info(`Created user: ${user.name} (${user.dicodingId})`);
    }

    return users;
  } catch (error) {
    logger.error('Error seeding users:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        logger.error(`  ${key}: ${error.errors[key].message}`);
      });
    }
    throw error;
  }
};

// Seed capstone groups
const seedCapstoneGroups = async (users) => {
  try {
    // Clear existing groups
    await CapstoneGroup.deleteMany({});
    logger.info('Cleared existing capstone groups');

    // Find users by dicodingId
    const findUser = (dicodingId) => users.find(u => u.dicodingId === dicodingId);

    // Group 1: Ready status (approved team)
    const group1Leader = findUser('FUI0001');
    const group1Members = [
      findUser('FUI0001'), // Leader
      findUser('FUI0002'), // Member
      findUser('MITB0024'), // Member (ML)
      findUser('MITB0025'), // Member (ML)
      findUser('RUI0041')  // Member (React)
    ];

    if (group1Leader && group1Members.every(m => m)) {
      const group1 = await CapstoneGroup.create({
        capstoneGroupId: 'ASAH-GROUP-001',
        teamName: 'Team Innovation',
        leaderId: group1Leader._id,
        members: group1Members.map((member, index) => ({
          userId: member._id,
          role: index === 0 ? 'leader' : 'member',
          joinedAt: new Date('2025-11-02')
        })),
        status: 'approved',
        projectTitle: 'Academic Dashboard Enhancement',
        projectDescription: 'Building a comprehensive academic dashboard for capstone project management',
        githubRepo: 'https://github.com/team-innovation/academic-dashboard',
        submittedAt: new Date('2025-11-03'),
        validatedAt: new Date('2025-11-04'),
        validatedBy: users.find(u => u.role === 'admin')?._id
      });

      // Update users' capstoneGroupId
      await User.updateMany(
        { _id: { $in: group1Members.map(m => m._id) } },
        { capstoneGroupId: group1._id }
      );

      logger.info(`Created group: ${group1.teamName} (${group1.capstoneGroupId}) - Status: ${group1.status}`);
    }

    // Group 2: Draft status (incomplete team)
    const group2Leader = findUser('MUI0021');
    const group2Members = [
      findUser('MUI0021'), // Leader (ML)
      findUser('FITB0004') // Member (FE)
    ];

    if (group2Leader && group2Members.every(m => m)) {
      const group2 = await CapstoneGroup.create({
        capstoneGroupId: 'ASAH-GROUP-002',
        teamName: 'Team Explorers',
        leaderId: group2Leader._id,
        members: group2Members.map((member, index) => ({
          userId: member._id,
          role: index === 0 ? 'leader' : 'member',
          joinedAt: new Date('2025-11-02')
        })),
        status: 'draft',
        projectTitle: 'ML-Powered Analytics Platform',
        projectDescription: 'Machine learning platform for data analytics'
      });

      // Update users' capstoneGroupId
      await User.updateMany(
        { _id: { $in: group2Members.map(m => m._id) } },
        { capstoneGroupId: group2._id }
      );

      logger.info(`Created group: ${group2.teamName} (${group2.capstoneGroupId}) - Status: ${group2.status}`);
    }

    // Group 3: Pending status (submitted, waiting approval)
    const group3Leader = findUser('RUI0042');
    const group3Members = [
      findUser('RUI0042'), // Leader (React)
      findUser('FITB0005'), // Member (FE)
      findUser('MUI0022'), // Member (ML)
      findUser('RITB0044') // Member (React)
    ];

    if (group3Leader && group3Members.every(m => m)) {
      const group3 = await CapstoneGroup.create({
        capstoneGroupId: 'ASAH-GROUP-003',
        teamName: 'Team Pioneers',
        leaderId: group3Leader._id,
        members: group3Members.map((member, index) => ({
          userId: member._id,
          role: index === 0 ? 'leader' : 'member',
          joinedAt: new Date('2025-11-02')
        })),
        status: 'pending',
        projectTitle: 'React Native Mobile App',
        projectDescription: 'Cross-platform mobile application for student management',
        githubRepo: 'https://github.com/team-pioneers/mobile-app',
        submittedAt: new Date('2025-11-03')
      });

      // Update users' capstoneGroupId
      await User.updateMany(
        { _id: { $in: group3Members.map(m => m._id) } },
        { capstoneGroupId: group3._id }
      );

      logger.info(`Created group: ${group3.teamName} (${group3.capstoneGroupId}) - Status: ${group3.status}`);
    }

    logger.info('Capstone groups seeded successfully');
  } catch (error) {
    logger.error('Error seeding capstone groups:', error);
    throw error;
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    logger.info('Starting database seeding...');
    logger.info('================================');
    
    const users = await seedUsers();
    logger.info(`✅ Seeded ${users.length} users`);
    
    await seedCapstoneGroups(users);
    logger.info('✅ Seeded capstone groups');
    
    logger.info('================================');
    logger.info('Database seeding completed successfully!');
    logger.info('');
    logger.info('Sample credentials:');
    logger.info('Admin:');
    logger.info('  Email: admin_1@student.devacademy.id');
    logger.info('  Password: admin123');
    logger.info('');
    logger.info('Students:');
    logger.info('  Email: fui0001@student.devacademy.id');
    logger.info('  Password: password123');
    logger.info('  (All students use password123)');
    logger.info('');
    
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
