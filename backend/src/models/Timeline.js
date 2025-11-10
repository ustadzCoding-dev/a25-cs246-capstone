import mongoose from 'mongoose'

// MENYIMPAN DATA TIMELINE
const timelineSchema = new mongoose.Schema({
  // Judul
  // Contoh: "Submission Capstone Project"
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  // Deskripsi
  // Contoh: "Deadline untuk submission capstone project tahap akhir."
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  // Type of timeline item
  // Contoh: "deadline"
  type: {
    type: String,
    enum: ['milestone', 'deadline', 'submission', 'meeting', 'event'],
    required: [true, 'Type is required']
  },
  // Start date range
  // Contoh: "2023-06-01"
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  // End date range
  // Contoh: "2023-06-30"
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  // Status
  // Contoh: "upcoming"
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'overdue', 'cancelled'],
    default: 'upcoming'
  },
  // Priority
  // Contoh: "medium"
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  // Days Remaining
  // Contoh: 5
  daysRemaining: {
    type: Number,
    default: null
  },
  // Overdue
  // Contoh: true
  isOverdue: {
    type: Boolean,
    default: false
  },
  // Created by
  // Contoh: "ObjectId of User"
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

timelineSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString(),
    delete ret._id,
    delete ret.__v
  }
})

const Timeline = mongoose.model('Timeline', timelineSchema)
export default Timeline
