/**
 * Fix Legacy Evidence Data
 *
 * This script fixes legacy worksheet evidence data by:
 * 1. Adding fileUrl field if missing (copied from filePath)
 * 2. Adding publicId field if missing (set to fileName or a generated value)
 *
 * Usage:
 *   node scripts/fixLegacyEvidence.js [--dry-run]
 *
 * Options:
 *   --dry-run    Show what would be changed without making changes
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Worksheet from '../src/models/Worksheet.js';
import User from '../src/models/User.js';
import WorksheetPeriod from '../src/models/WorksheetPeriod.js';

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

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

async function fixLegacyEvidence() {
  console.log('='.repeat(60));
  console.log('Fix Legacy Evidence Data');
  console.log('='.repeat(60));
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log('='.repeat(60));

  await connectDB();

  // Find all worksheets with evidence
  const worksheets = await Worksheet.find({
    'evidence.0': { $exists: true }
  });

  console.log(`\nFound ${worksheets.length} worksheets with evidence\n`);

  let totalFixed = 0;
  let totalSkipped = 0;

  for (const worksheet of worksheets) {
    console.log('-'.repeat(60));
    console.log(`📋 Worksheet ID: ${worksheet._id}`);
    console.log(`   Evidence count: ${worksheet.evidence.length}`);

    let hasChanges = false;

    for (let i = 0; i < worksheet.evidence.length; i++) {
      const ev = worksheet.evidence[i];
      let evidenceChanged = false;
      const changes = [];

      // Fix missing fileUrl
      if (!ev.fileUrl && ev.filePath) {
        ev.fileUrl = ev.filePath;
        changes.push(`fileUrl set to filePath`);
        evidenceChanged = true;
      }

      // Fix missing publicId
      if (!ev.publicId) {
        // Generate a publicId from fileName or create one
        ev.publicId = ev.fileName || `legacy-${worksheet._id}-${i}`;
        changes.push(`publicId set to "${ev.publicId}"`);
        evidenceChanged = true;
      }

      if (evidenceChanged) {
        console.log(`   📎 Evidence ${i + 1} (${ev.originalName}):`);
        changes.forEach(change => console.log(`      ✏️  ${change}`));
        hasChanges = true;
        totalFixed++;
      } else {
        totalSkipped++;
      }
    }

    if (hasChanges && !DRY_RUN) {
      // Use updateOne with $set to bypass validation during save
      await Worksheet.updateOne(
        { _id: worksheet._id },
        { $set: { evidence: worksheet.evidence } }
      );
      console.log(`   💾 Worksheet saved`);
    } else if (hasChanges) {
      console.log(`   ⏭️  Would save (dry run)`);
    } else {
      console.log(`   ✅ No changes needed`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`Evidence items fixed: ${totalFixed}`);
  console.log(`Evidence items skipped (already OK): ${totalSkipped}`);

  if (DRY_RUN) {
    console.log('\n⚠️  This was a DRY RUN. No changes were made.');
    console.log('   Run without --dry-run to apply changes.');
  }

  console.log('='.repeat(60));
}

// Run fix
fixLegacyEvidence()
  .then(() => {
    console.log('\n✅ Fix completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
