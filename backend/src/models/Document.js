import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
    trim: true
  },
  fileSize: {
    type: Number, // in bytes
    default: 0
  },
  fileType: {
    type: String,
    trim: true
    // Example: "application/pdf", "image/png"
  },
  // Categorization
  category: {
    type: String,
    enum: ['guideline', 'template', 'reference', 'submission', 'announcement', 'other'],
    required: [true, 'Category is required']
  },
  tags: [{
    type: String,
    trim: true
  }],
  // Visibility and access control
  visibility: {
    type: String,
    enum: ['public', 'team-only', 'admin-only'],
    default: 'public'
  },
  // Related to
  relatedTo: {
    type: String,
    enum: ['general', 'usecase', 'team', 'learning-group'],
    default: 'general'
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
    // Can reference UseCase, CapstoneGroup, or LearningGroup
  },
  // Upload info
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  // Download tracking
  downloadCount: {
    type: Number,
    default: 0
  },
  lastDownloadedAt: {
    type: Date,
    default: null
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
documentSchema.index({ category: 1 })
documentSchema.index({ visibility: 1 })
documentSchema.index({ uploadedBy: 1 })
documentSchema.index({ relatedTo: 1, relatedId: 1 })
documentSchema.index({ isActive: 1 })

// Virtual for uploader details
documentSchema.virtual('uploader', {
  ref: 'User',
  localField: 'uploadedBy',
  foreignField: '_id',
  justOne: true
})

// Method to increment download count
documentSchema.methods.incrementDownload = function() {
  this.downloadCount += 1
  this.lastDownloadedAt = new Date()
  return this.save()
}

// Method to check if user can access
documentSchema.methods.canAccess = function(user) {
  // Public documents can be accessed by anyone
  if (this.visibility === 'public') {
    return true
  }
  
  // Admin-only documents
  if (this.visibility === 'admin-only') {
    return user.role === 'admin'
  }
  
  // Team-only documents
  if (this.visibility === 'team-only') {
    if (user.role === 'admin') return true
    
    // Check if user is in the related team
    if (this.relatedTo === 'team' && this.relatedId) {
      return user.capstoneGroupId && 
             user.capstoneGroupId.toString() === this.relatedId.toString()
    }
  }
  
  return false
}

// Static method to get documents by category
documentSchema.statics.getByCategory = function(category, options = {}) {
  const query = { category, isActive: true }
  
  if (options.visibility) {
    query.visibility = options.visibility
  }
  
  return this.find(query)
    .populate('uploadedBy', 'name email role')
    .sort({ createdAt: -1 })
}

// Static method to get documents for a team
documentSchema.statics.getForTeam = function(teamId) {
  return this.find({
    $or: [
      { visibility: 'public' },
      {
        visibility: 'team-only',
        relatedTo: 'team',
        relatedId: teamId
      }
    ],
    isActive: true
  })
    .populate('uploadedBy', 'name email role')
    .sort({ createdAt: -1 })
}

const Document = mongoose.model('Document', documentSchema)

export default Document
