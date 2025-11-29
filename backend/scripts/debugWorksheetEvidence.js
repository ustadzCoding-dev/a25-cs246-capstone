/**
 * Debug Script: Inspect Worksheet Evidence Data
 *
 * This script inspects worksheet evidence data in the database
 * to help diagnose issues with file URLs and evidence IDs.
 *
 * Usage:
 *   node scripts/debugWorksheetEvidence.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Worksheet from '../src/models/Worksheet.js';
import User from '../src/models/User.js';
import WorksheetPeriod from '../src/models/WorksheetPeriod.js';

// Connect to MongoDB
async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/capstone-dicoding';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function debugEvidence() {
  console.log('='.repeat(60));
  console.log('Worksheet Evidence Debug');
  console.log('='.repeat(60));

  await connectDB();

  // Find all worksheets with evidence
  const worksheets = await Worksheet.find({
    'evidence.0': { $exists: true }
  })
    .populate('userId', 'name email')
    .populate('periodId', 'title periodNumber');

  console.log(`\nFound ${worksheets.length} worksheets with evidence\n`);

  for (const worksheet of worksheets) {
    console.log('-'.repeat(60));
    console.log(`📋 Worksheet ID: ${worksheet._id}`);
    console.log(
      `   User: ${worksheet.userId?.name || worksheet.userId} (${worksheet.userId?.email || 'N/A'})`
    );
    console.log(
      `   Period: ${worksheet.periodId?.title || worksheet.periodId} (#${worksheet.periodId?.periodNumber || 'N/A'})`
    );
    console.log(`   Is Submitted: ${worksheet.isSubmitted}`);
    console.log(`   Evidence count: ${worksheet.evidence.length}`);

    for (let i = 0; i < worksheet.evidence.length; i++) {
      const ev = worksheet.evidence[i];
      console.log(`\n   📎 Evidence ${i + 1}:`);
      console.log(`      _id: ${ev._id || 'UNDEFINED'}`);
      console.log(`      originalName: ${ev.originalName || 'UNDEFINED'}`);
      console.log(`      fileName: ${ev.fileName || 'UNDEFINED'}`);
      console.log(`      publicId: ${ev.publicId || 'UNDEFINED'}`);
      console.log(`      mimeType: ${ev.mimeType || 'UNDEFINED'}`);
      console.log(`      fileSize: ${ev.fileSize || 'UNDEFINED'}`);
      console.log(`      resourceType: ${ev.resourceType || 'UNDEFINED'}`);
      console.log(`      filePath: ${ev.filePath || 'UNDEFINED'}`);
      console.log(`      fileUrl: ${ev.fileUrl || 'UNDEFINED'}`);

      // Check URL type
      const url = ev.fileUrl || ev.filePath;
      if (url) {
        if (url.startsWith('http://') || url.startsWith('https://')) {
          if (url.includes('cloudinary.com')) {
            console.log(`      URL Type: ✅ Cloudinary URL`);
          } else {
            console.log(`      URL Type: ✅ HTTP URL`);
          }
        } else if (url.startsWith('file:///')) {
          console.log(`      URL Type: ❌ Local file:// URL (needs migration)`);
        } else {
          console.log(`      URL Type: ⚠️ Unknown format`);
        }
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));

  // Count URL types
  let cloudinaryCount = 0;
  let httpCount = 0;
  let localCount = 0;
  let unknownCount = 0;
  let noIdCount = 0;

  for (const worksheet of worksheets) {
    for (const ev of worksheet.evidence) {
      if (!ev._id) {
        noIdCount++;
      }

      const url = ev.fileUrl || ev.filePath;
      if (url) {
        if (url.includes('cloudinary.com')) {
          cloudinaryCount++;
        } else if (url.startsWith('http://') || url.startsWith('https://')) {
          httpCount++;
        } else if (url.startsWith('file:///')) {
          localCount++;
        } else {
          unknownCount++;
        }
      }
    }
  }

  console.log(`Cloudinary URLs: ${cloudinaryCount}`);
  console.log(`HTTP URLs: ${httpCount}`);
  console.log(`Local file:// URLs: ${localCount} ${localCount > 0 ? '(needs migration!)' : ''}`);
  console.log(`Unknown format: ${unknownCount}`);
  console.log(
    `Evidence without _id: ${noIdCount} ${noIdCount > 0 ? '(will cause delete issues!)' : ''}`
  );

  console.log('='.repeat(60));
}

// Run debug
debugEvidence()
  .then(() => {
    console.log('\n✅ Debug completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Debug failed:', error);
    process.exit(1);
  });
