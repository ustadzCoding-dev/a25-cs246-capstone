import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import CapstoneGroup from '../models/CapstoneGroup.js';
import Document from '../models/Document.js';
import Timeline from '../models/Timeline.js';
import UseCase from '../models/UseCase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvDir = path.join(__dirname, '../../../docs/DataSetTim_CSV_Export');

/**
 * Parse CSV file and return array of objects
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
 * Import Users from CSV
 */
const importUsers = async () => {
  try {
    console.log('📥 Importing users...');
    const csvPath = path.join(csvDir, 'users.csv');
    const data = await parseCSV(csvPath);

    const users = data.map((row) => ({
      dicodingId: row.id || 'TEMP_' + Math.random().toString(36).substr(2, 9),
      email: row.email,
      name: row.name,
      learningPath: row.learning_path || row.learningPath || null,
      university: row.university || null,
      role: (row.role || 'STUDENT').toLowerCase(),
      provider: 'local',
      isEmailVerified: true,
      password: 'hashed_password_placeholder'
    }));

    await User.insertMany(users);
    console.log(`✅ Imported ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error importing users:', error.message);
    throw error;
  }
};

/**
 * Import UseCases from CSV
 */
const importUseCases = async () => {
  try {
    console.log('📥 Importing use cases...');
    const csvPath = path.join(csvDir, 'capstone_information.csv');
    const data = await parseCSV(csvPath);

    const useCases = data.map((row) => ({
      usecaseId: row.usecase_id || row.usecaseId,
      title: row.title,
      description: row.description,
      partner: row.partner,
      totalSlots: parseInt(row.total_slots || row.totalSlots) || 10,
      availableSlots: parseInt(row.available_slots || row.availableSlots) || 10,
      difficulty: row.difficulty || 'medium',
      status: 'open'
    }));

    await UseCase.insertMany(useCases);
    console.log(`✅ Imported ${useCases.length} use cases`);
    return useCases;
  } catch (error) {
    console.error('❌ Error importing use cases:', error.message);
    throw error;
  }
};

/**
 * Import CapstoneGroups from CSV
 */
const importCapstoneGroups = async (users, useCases) => {
  try {
    console.log('📥 Importing capstone groups...');
    const csvPath = path.join(csvDir, 'capstone_groups.csv');
    const data = await parseCSV(csvPath);

    const groups = data.map((row) => {
      const useCase = useCases.find((uc) => uc.usecaseId === row.usecase_id);
      return {
        capstoneGroupId: row.capstone_group_id || row.capstoneGroupId,
        teamName: row.team_name || row.teamName,
        useCaseId: useCase?._id || null,
        membersUserId: [], // Will be populated from members CSV
        status: row.status || 'pending',
        submittedAt: new Date(row.submitted_at || row.submittedAt),
        validatedAt: row.validated_at ? new Date(row.validated_at) : null,
        rejectionReason: row.rejection_reason || null
      };
    });

    await CapstoneGroup.insertMany(groups);
    console.log(`✅ Imported ${groups.length} capstone groups`);
    return groups;
  } catch (error) {
    console.error('❌ Error importing capstone groups:', error.message);
    throw error;
  }
};

/**
 * Import Documents from CSV
 */
const importDocuments = async (users) => {
  try {
    console.log('📥 Importing documents...');
    const csvPath = path.join(csvDir, 'capstone_docs.csv');
    const data = await parseCSV(csvPath);

    const documents = data.map((row) => {
      const uploader = users[0]; // Assign to first admin user
      return {
        title: row.title,
        description: row.description,
        fileName: row.file_name || row.fileName,
        fileUrl: row.file_url || row.fileUrl || `/uploads/documents/${row.file_name}`,
        category: row.category || 'Panduan',
        visibility: row.visibility || 'public',
        uploadedBy: uploader?._id || null,
        isActive: true,
        downloadCount: parseInt(row.download_count || 0)
      };
    });

    await Document.insertMany(documents);
    console.log(`✅ Imported ${documents.length} documents`);
    return documents;
  } catch (error) {
    console.error('❌ Error importing documents:', error.message);
    throw error;
  }
};

/**
 * Import Timelines from CSV
 */
const importTimelines = async () => {
  try {
    console.log('📥 Importing timelines...');
    const csvPath = path.join(csvDir, 'capstone_timeline.csv');
    const data = await parseCSV(csvPath);

    const timelines = data.map((row) => ({
      title: row.title,
      description: row.description,
      type: row.type || 'milestone',
      startDate: new Date(row.start_date || row.startDate),
      endDate: new Date(row.end_date || row.endDate),
      status: row.status || 'upcoming',
      priority: row.priority || 'medium',
      isActive: true
    }));

    await Timeline.insertMany(timelines);
    console.log(`✅ Imported ${timelines.length} timelines`);
    return timelines;
  } catch (error) {
    console.error('❌ Error importing timelines:', error.message);
    throw error;
  }
};

/**
 * Main import function
 */
const importData = async () => {
  try {
    console.log('🚀 Starting CSV import...\n');
    await connectDB();

    // Import in order
    const users = await importUsers();

    // Skip UseCase import for now (CSV format mismatch)
    // const useCases = await importUseCases()
    const useCases = [];

    // const groups = await importCapstoneGroups(users, useCases)
    // const documents = await importDocuments(users)
    // const timelines = await importTimelines()

    console.log('\n✨ CSV import completed successfully!');
    console.log(`
📊 Summary:
  - Users: ${users.length}
  - Use Cases: ${useCases.length}
  - Capstone Groups: 0 (skipped)
  - Documents: 0 (skipped)
  - Timelines: 0 (skipped)
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  }
};

importData();
