import mongoose from 'mongoose'

const learningGroupSchema = new mongoose.Schema({
  learningGroupId: {
    type: String,
    required: [true, 'Learning group ID is required'],
    unique: true,
    trim: true,
    uppercase: true
    // Example: "ASAH-2025-01"
  },
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true
  },
  cohort: {
    type: String,
    required: [true, 'Cohort is required'],
    trim: true
    // Example: "Asah 2025 Batch 1"
  },
  mentor: {
    type: String,
    required: [true, 'Mentor name is required'],
    trim: true
  },
  mentorEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  // Members
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxMembers: {
    type: Number,
    default: 30
  },
  // Schedule
  schedule: {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    time: {
      type: String
      // Example: "19:00-21:00"
    },
    timezone: {
      type: String,
      default: 'Asia/Jakarta'
    }
  },
  // Program details
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
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

// Indexes
learningGroupSchema.index({ learningGroupId: 1 })
learningGroupSchema.index({ cohort: 1 })
learningGroupSchema.index({ isActive: 1 })

// Virtual for member count
learningGroupSchema.virtual('memberCount').get(function() {
  return this.members.length
})

// Virtual for available slots
learningGroupSchema.virtual('availableSlots').get(function() {
  return this.maxMembers - this.members.length
})

// Virtual for is full
learningGroupSchema.virtual('isFull').get(function() {
  return this.members.length >= this.maxMembers
})

// Method to add member
learningGroupSchema.methods.addMember = function(userId) {
  if (this.isFull) {
    throw new Error('Learning group is full')
  }
  
  const exists = this.members.some(m => m.toString() === userId.toString())
  if (exists) {
    throw new Error('User is already a member')
  }
  
  this.members.push(userId)
  return this.save()
}

// Method to remove member
learningGroupSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(m => m.toString() !== userId.toString())
  return this.save()
}

// Static method to get active groups
learningGroupSchema.statics.getActive = function() {
  return this.find({ isActive: true })
    .populate('members', 'name email learningPath')
    .sort({ startDate: -1 })
}

// Static method to get groups by cohort
learningGroupSchema.statics.getByCohort = function(cohort) {
  return this.find({ cohort, isActive: true })
    .populate('members', 'name email learningPath')
    .sort({ learningGroupId: 1 })
}

const LearningGroup = mongoose.model('LearningGroup', learningGroupSchema)

export default LearningGroup
