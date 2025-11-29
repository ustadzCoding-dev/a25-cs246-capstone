/**
 * Migration Script: Fix Local File Paths in Worksheet Evidence
 *
 * This script migrates worksheet evidence URLs from local file paths
 * (file:///C:/Users/...) to HTTP URLs (/uploads/...) or optionally
 * uploads them to Cloudinary.
 *
 * Usage:
 *   node scripts/migrateWorksheetEvidence.js [--dry-run] [--cloudinary]
 *
 * Options:
 *   --dry-run    Show what would be changed without making changes
 *   --cloudinary Upload local files to Cloudinary instead of just fixing URLs
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Worksheet from '../src/models/Worksheet.js';
import { uploadWorksheetEvidence } from '../src/services/CloudinaryService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const USE_CLOUDINARY = args.includes('--cloudinary');

// Backend base URL (for converting to HTTP URLs)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

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

/**
 * Check if a path is a local file path
 */
function isLocalFilePath(filePath) {
  if (!filePath) return false;
  return (
    filePath.startsWith('file:///') ||
    filePath.startsWith('C:\\') ||
    filePath.startsWith('C:/') ||
    filePath.startsWith('/Users/') ||
    filePath.startsWith('/home/') ||
    (filePath.includes('\\uploads\\') && !filePath.startsWith('http'))
  );
}

/**
 * Extract relative path from local file path
 */
function extractRelativePath(localPath) {
  // Handle file:/// protocol
  if (localPath.startsWith('file:///')) {
    localPath = localPath.replace('file:///', '');
    // On Windows, it might be file:///C:/...
    if (localPath.match(/^[A-Z]:\//i)) {
      // It's a Windows path
    }
  }

  // Decode URI components
  localPath = decodeURIComponent(localPath);

  // Find the uploads directory in the path
  const uploadsIndex = localPath.toLowerCase().indexOf('uploads');
  if (uploadsIndex !== -1) {
    // Extract from 'uploads' onwards
    let relativePath = localPath.substring(uploadsIndex);
    // Normalize path separators
    relativePath = relativePath.replace(/\\/g, '/');
    return '/' + relativePath;
  }

  return null;
}

/**
 * Get the actual file path on disk
 */
function getLocalFilePath(relativePath) {
  // Remove leading slash if present
  const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  return path.join(__dirname, '..', cleanPath);
}

/**
 * Convert local path to HTTP URL
 */
function convertToHttpUrl(localPath) {
  const relativePath = extractRelativePath(localPath);
  if (!relativePath) return null;
  return `${BACKEND_URL}${relativePath}`;
}

/**
 * Migrate a single evidence item
 */
async function migrateEvidence(evidence, userId, periodId) {
  const filePath = evidence.filePath || evidence.fileUrl;

  if (!isLocalFilePath(filePath)) {
    return { status: 'skipped', reason: 'Already HTTP URL or Cloudinary' };
  }

  const relativePath = extractRelativePath(filePath);
  if (!relativePath) {
    return { status: 'error', reason: 'Could not extract relative path' };
  }

  if (USE_CLOUDINARY) {
    // Upload to Cloudinary
    const localFilePath = getLocalFilePath(relativePath);

    if (!fs.existsSync(localFilePath)) {
      return { status: 'error', reason: `File not found: ${localFilePath}` };
    }

    try {
      const cloudinaryResult = await uploadWorksheetEvidence(
        localFilePath,
        evidence.originalName,
        userId.toString(),
        periodId.toString()
      );

      return {
        status: 'migrated',
        newData: {
          fileName: cloudinaryResult.publicId,
          filePath: cloudinaryResult.url,
          fileUrl: cloudinaryResult.url,
          publicId: cloudinaryResult.publicId,
          resourceType: cloudinaryResult.resourceType
        }
      };
    } catch (error) {
      return { status: 'error', reason: `Cloudinary upload failed: ${error.message}` };
    }
  } else {
    // Just convert to HTTP URL
    const httpUrl = convertToHttpUrl(filePath);
    if (!httpUrl) {
      return { status: 'error', reason: 'Could not convert to HTTP URL' };
    }

    return {
      status: 'migrated',
      newData: {
        filePath: httpUrl,
        fileUrl: httpUrl
      }
    };
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('='.repeat(60));
  console.log('Worksheet Evidence Migration Script');
  console.log('='.repeat(60));
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log(`Target: ${USE_CLOUDINARY ? 'Cloudinary' : 'HTTP URLs'}`);
  console.log('='.repeat(60));

  await connectDB();

  // Find all worksheets with evidence
  const worksheets = await Worksheet.find({
    'evidence.0': { $exists: true }
  });

  console.log(`\nFound ${worksheets.length} worksheets with evidence\n`);

  let totalEvidence = 0;
  let migratedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const worksheet of worksheets) {
    console.log(`\n📋 Worksheet: ${worksheet._id}`);
    console.log(`   User: ${worksheet.userId}`);
    console.log(`   Period: ${worksheet.periodId}`);
    console.log(`   Evidence count: ${worksheet.evidence.length}`);

    let hasChanges = false;

    for (let i = 0; i < worksheet.evidence.length; i++) {
      const evidence = worksheet.evidence[i];
      totalEvidence++;

      console.log(`\n   📎 Evidence ${i + 1}: ${evidence.originalName}`);
      console.log(`      Current path: ${evidence.filePath || evidence.fileUrl}`);

      const result = await migrateEvidence(evidence, worksheet.userId, worksheet.periodId);

      if (result.status === 'migrated') {
        console.log(`      ✅ ${result.status.toUpperCase()}`);
        if (result.newData.fileUrl) {
          console.log(`      New URL: ${result.newData.fileUrl}`);
        }

        if (!DRY_RUN) {
          // Apply changes
          Object.assign(worksheet.evidence[i], result.newData);
          hasChanges = true;
        }
        migratedCount++;
      } else if (result.status === 'skipped') {
        console.log(`      ⏭️  SKIPPED: ${result.reason}`);
        skippedCount++;
      } else {
        console.log(`      ❌ ERROR: ${result.reason}`);
        errorCount++;
      }
    }

    if (hasChanges && !DRY_RUN) {
      await worksheet.save();
      console.log(`\n   💾 Worksheet saved`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Migration Summary');
  console.log('='.repeat(60));
  console.log(`Total evidence files: ${totalEvidence}`);
  console.log(`Migrated: ${migratedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Errors: ${errorCount}`);

  if (DRY_RUN) {
    console.log('\n⚠️  This was a DRY RUN. No changes were made.');
    console.log('   Run without --dry-run to apply changes.');
  }

  console.log('='.repeat(60));
}

// Run migration
migrate()
  .then(() => {
    console.log('\n✅ Migration completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
