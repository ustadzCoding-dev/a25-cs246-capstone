import mongoose from 'mongoose'

const timelineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  type: {
    type: String,
    enum: ['milestone', 'deadline', 'submission', 'meeting', 'event'],
    required: [true, 'Type is required']
  },
  // Date and time
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  // Related to
  relatedTo: {
    type: String,
    enum: ['all', 'usecase', 'team', 'learning-group'],
    default: 'all'
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  // Priority and status
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'overdue', 'cancelled'],
    default: 'upcoming'
  },
  // Completion tracking
  completedAt: {
    type: Date,
    default: null
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Reminder
  reminderEnabled: {
    type: Boolean,
    default: true
  },
  reminderDays: {
    type: Number,
    default: 3 // Remind 3 days before
  },
  // Created by
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  // Visibility
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
timelineSchema.index({ startDate: 1, endDate: 1 })
timelineSchema.index({ status: 1 })
timelineSchema.index({ type: 1 })
timelineSchema.index({ relatedTo: 1, relatedId: 1 })

// Virtual for duration
timelineSchema.virtual('duration').get(function() {
  if (!this.startDate || !this.endDate) return null
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) // days
})

// Virtual for days remaining
timelineSchema.virtual('daysRemaining').get(function() {
  if (!this.endDate) return null
  const now = new Date()
  const diff = this.endDate - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

// Virtual for is overdue
timelineSchema.virtual('isOverdue').get(function() {
  if (this.status === 'completed' || this.status === 'cancelled') return false
  return new Date() > this.endDate
})

// Method to mark as completed
timelineSchema.methods.markCompleted = function(userId) {
  this.status = 'completed'
  this.completedAt = new Date()
  this.completedBy = userId
  return this.save()
}

// Method to check if should send reminder
timelineSchema.methods.shouldSendReminder = function() {
  if (!this.reminderEnabled) return false
  if (this.status !== 'upcoming' && this.status !== 'ongoing') return false
  
  const now = new Date()
  const daysUntilEnd = Math.ceil((this.endDate - now) / (1000 * 60 * 60 * 24))
  
  return daysUntilEnd <= this.reminderDays && daysUntilEnd > 0
}

// Pre-save hook to update status
timelineSchema.pre('save', function(next) {
  const now = new Date()
  
  // Auto-update status based on dates
  if (this.status !== 'completed' && this.status !== 'cancelled') {
    if (now < this.startDate) {
      this.status = 'upcoming'
    } else if (now >= this.startDate && now <= this.endDate) {
      this.status = 'ongoing'
    } else if (now > this.endDate) {
      this.status = 'overdue'
    }
  }
  
  next()
})

// Static method to get upcoming deadlines
timelineSchema.statics.getUpcoming = function(days = 7) {
  const now = new Date()
  const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000))
  
  return this.find({
    endDate: { $gte: now, $lte: futureDate },
    status: { $in: ['upcoming', 'ongoing'] },
    isActive: true
  })
    .sort({ endDate: 1 })
    .populate('createdBy', 'name email')
}

// Static method to get overdue items
timelineSchema.statics.getOverdue = function() {
  const now = new Date()
  
  return this.find({
    endDate: { $lt: now },
    status: { $nin: ['completed', 'cancelled'] },
    isActive: true
  })
    .sort({ endDate: 1 })
    .populate('createdBy', 'name email')
}

// Static method to get timeline for team
timelineSchema.statics.getForTeam = function(teamId) {
  return this.find({
    $or: [
      { relatedTo: 'all' },
      {
        relatedTo: 'team',
        relatedId: teamId
      }
    ],
    isActive: true
  })
    .sort({ startDate: 1 })
    .populate('createdBy', 'name email')
}

const Timeline = mongoose.model('Timeline', timelineSchema)

export default Timeline
