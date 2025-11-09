import mongoose from 'mongoose'

// MENYIMPAN DATA USER
const userSchema = new mongoose.Schema({
  // DidicodingId
  // Contoh: "A25-CS246"
  dicodingId: {
    type: String,
    required: [true, 'Dicoding ID is required'],
    unique: true,
    trim: true
  },
  // Name
  // Contoh: "John Doe"
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  // Email
  // Contoh: "nVf3o@example.com"
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  // Password Hash
  // Contoh: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6LhY5Pq7vH6jIW3e"
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  // Learning Path
  // Contoh: "Front-End Web & Back-End with AI"
  learningPath: {
    type: String,
    enum: [
      'Front-End Web & Back-End with AI',
      'React & Back-End with AI',
      'Machine Learning'
    ],
    required: [true, 'Learning path is required']
  },
  // Role
  // Contoh: "student"
  role: {
    type: String,
    enum: ['student', 'admin', 'mentor'],
    default: 'student'
  },
  // University
  // Contoh: "Institut Teknologi Bandung"
  university: {
    type: String,
    trim: true
  },
  // Capstone Group
  // Contoh: "ObjectId of CapstoneGroup"
  capstoneGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CapstoneGroup',
    default: null
  },
  // Learning Group
  // Contoh: "ObjectId of LearningGroup"
  learningGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningGroup',
    default: null
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString(),
    delete ret._id,
    delete ret.__v
  }
})

const User = mongoose.model('User', userSchema)
export default User
