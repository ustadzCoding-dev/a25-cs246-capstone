import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  dicodingId: {
    type: String,
    required: [true, 'Dicoding ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    select: false // Don't include in queries by default
  },
  learningPath: {
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
    ],
    required: [true, 'Learning path is required']
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'mentor'],
    default: 'student'
  },
  university: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  // References
  capstoneGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CapstoneGroup',
    default: null
  },
  learningGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningGroup',
    default: null
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
userSchema.index({ email: 1 })
userSchema.index({ dicodingId: 1 })
userSchema.index({ capstoneGroupId: 1 })

// Virtual for capstone group
userSchema.virtual('capstoneGroup', {
  ref: 'CapstoneGroup',
  localField: 'capstoneGroupId',
  foreignField: '_id',
  justOne: true
})

// Virtual for learning group
userSchema.virtual('learningGroup', {
  ref: 'LearningGroup',
  localField: 'learningGroupId',
  foreignField: '_id',
  justOne: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.passwordHash)
  } catch (error) {
    throw error
  }
}

// Method to generate auth token (will be implemented with JWT)
userSchema.methods.generateAuthToken = function() {
  // Will be implemented in auth controller
  return null
}

// Remove sensitive data from JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.passwordHash
  delete user.__v
  return user
}

const User = mongoose.model('User', userSchema)

export default User
