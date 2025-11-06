import mongoose from 'mongoose'

const useCaseSchema = new mongoose.Schema({
  useCaseCode: {
    type: String,
    required: [true, 'Use case code is required'],
    unique: true,
    trim: true,
    uppercase: true
    // Example: "DC-09"
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  partner: {
    type: String,
    required: [true, 'Partner is required'],
    trim: true
    // Example: "Accenture", "Dicoding"
  },
  totalSlots: {
    type: Number,
    required: [true, 'Total slots is required'],
    min: [1, 'Total slots must be at least 1']
  },
  availableSlots: {
    type: Number,
    required: true,
    min: [0, 'Available slots cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requirements: {
    learningPaths: [{
      type: String,
      enum: [
        'Front-End',
        'Back-End',
        'Android',
        'iOS',
        'Machine Learning',
        'DevOps',
        'Multi-Platform',
        'React',
        'Flutter'
      ]
    }],
    minTeamSize: {
      type: Number,
      default: 3
    },
    maxTeamSize: {
      type: Number,
      default: 5
    }
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
})

// Indexes
useCaseSchema.index({ useCaseCode: 1 })
useCaseSchema.index({ isActive: 1 })
useCaseSchema.index({ partner: 1 })

// Virtual for assigned teams count
useCaseSchema.virtual('assignedTeamsCount', {
  ref: 'CapstoneGroup',
  localField: '_id',
  foreignField: 'selectedUseCaseId',
  count: true
})

// Method to check if slots available
useCaseSchema.methods.hasAvailableSlots = function() {
  return this.availableSlots > 0 && this.isActive
}

// Method to reserve a slot
useCaseSchema.methods.reserveSlot = async function() {
  if (this.availableSlots <= 0) {
    throw new Error('No available slots')
  }
  this.availableSlots -= 1
  await this.save()
}

// Method to release a slot
useCaseSchema.methods.releaseSlot = async function() {
  if (this.availableSlots >= this.totalSlots) {
    throw new Error('Cannot release slot, already at maximum')
  }
  this.availableSlots += 1
  await this.save()
}

// Pre-save hook to set availableSlots on creation
useCaseSchema.pre('save', function(next) {
  if (this.isNew && this.availableSlots === undefined) {
    this.availableSlots = this.totalSlots
  }
  next()
})

const UseCase = mongoose.model('UseCase', useCaseSchema)

export default UseCase
