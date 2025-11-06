import mongoose from 'mongoose'

const capstoneGroupSchema = new mongoose.Schema({
  capstoneGroupId: {
    type: String,
    required: [true, 'Capstone group ID is required'],
    unique: true,
    trim: true,
    uppercase: true
    // Example: "A25-CS246"
  },
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true
  },
  // Team members
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['leader', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Team leader is required']
  },
  // Selected use case
  selectedUseCaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UseCase',
    default: null
  },
  // Project details
  projectTitle: {
    type: String,
    trim: true,
    default: null
  },
  projectDescription: {
    type: String,
    default: null
  },
  githubRepo: {
    type: String,
    trim: true,
    default: null,
    match: [/^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+/, 'Please provide a valid GitHub repository URL']
  },
  demoUrl: {
    type: String,
    trim: true,
    default: null
  },
  // Status and validation
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'completed'],
    default: 'draft'
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  validatedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  },
  // Submission
  submittedAt: {
    type: Date,
    default: null
  },
  // Scoring
  finalScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  feedback: {
    type: String,
    default: null
  },
  // Metadata
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
capstoneGroupSchema.index({ capstoneGroupId: 1 })
capstoneGroupSchema.index({ status: 1 })
capstoneGroupSchema.index({ selectedUseCaseId: 1 })
capstoneGroupSchema.index({ 'members.userId': 1 })

// Virtual for member count
capstoneGroupSchema.virtual('memberCount').get(function() {
  return this.members.length
})

// Virtual for use case details
capstoneGroupSchema.virtual('useCase', {
  ref: 'UseCase',
  localField: 'selectedUseCaseId',
  foreignField: '_id',
  justOne: true
})

// Virtual for leader details
capstoneGroupSchema.virtual('leader', {
  ref: 'User',
  localField: 'leaderId',
  foreignField: '_id',
  justOne: true
})

// Method to add member
capstoneGroupSchema.methods.addMember = function(userId, role = 'member') {
  const exists = this.members.some(m => m.userId.toString() === userId.toString())
  if (exists) {
    throw new Error('User is already a member')
  }
  
  this.members.push({
    userId,
    role,
    joinedAt: new Date()
  })
  
  return this.save()
}

// Method to remove member
capstoneGroupSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(m => m.userId.toString() !== userId.toString())
  return this.save()
}

// Method to validate team composition
capstoneGroupSchema.methods.validateComposition = async function() {
  await this.populate('members.userId')
  
  const learningPaths = this.members.map(m => m.userId.learningPath)
  const uniquePaths = [...new Set(learningPaths)]
  
  // Check if team has required diversity
  // Example: At least 2 different learning paths
  if (uniquePaths.length < 2) {
    return {
      isValid: false,
      message: 'Team must have at least 2 different learning paths'
    }
  }
  
  // Check team size
  if (this.members.length < 3 || this.members.length > 5) {
    return {
      isValid: false,
      message: 'Team must have 3-5 members'
    }
  }
  
  return {
    isValid: true,
    message: 'Team composition is valid'
  }
}

// Method to submit for validation
capstoneGroupSchema.methods.submitForValidation = async function() {
  const validation = await this.validateComposition()
  
  if (!validation.isValid) {
    throw new Error(validation.message)
  }
  
  this.status = 'pending'
  this.submittedAt = new Date()
  
  return this.save()
}

// Method to approve team
capstoneGroupSchema.methods.approve = function(adminId) {
  this.status = 'approved'
  this.validatedBy = adminId
  this.validatedAt = new Date()
  this.rejectionReason = null
  
  return this.save()
}

// Method to reject team
capstoneGroupSchema.methods.reject = function(adminId, reason) {
  this.status = 'rejected'
  this.validatedBy = adminId
  this.validatedAt = new Date()
  this.rejectionReason = reason
  
  return this.save()
}

const CapstoneGroup = mongoose.model('CapstoneGroup', capstoneGroupSchema)

export default CapstoneGroup
