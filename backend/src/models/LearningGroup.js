import mongoose from 'mongoose'

// MENYIMPAN DATA LEARNING GROUP
const learningGroupSchema = new mongoose.Schema({
  // Learning Group ID
  // Contoh: "ASAH-2025-01"
  learningGroupId: {
    type: String,
    required: [true, 'Learning group ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  // Group Name
  // Contoh: "Asah Frontend Batch 1"
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true
  },
  // Cohort
  // Contoh: "Asah 2025 Batch 1"
  cohort: {
    type: String,
    required: [true, 'Cohort is required'],
    trim: true
  },
  // Mentor Info
  mentorName: {
    type: String,
    required: [true, 'Mentor name is required'],
    trim: true
  },
  // Max Members
  // Contoh: 30
  maxMembers: {
    type: Number,
    default: 30
  },
  // Current Members
  // Contoh: 20 team members
  currentMembers: {
    type: Number,
    default: 0
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

const LearningGroup = mongoose.model('LearningGroup', learningGroupSchema)
export default LearningGroup
