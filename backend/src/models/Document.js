import mongoose from 'mongoose'

// MENYIMPAN DATA DOKUMEN
const documentSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  // Description
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  // File Info
  // Contoh: "guideline.pdf"
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  // Contoh: "https://storage.example.com/documents/guideline.pdf"
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
    trim: true
  },
  // Category
  // Contoh: "guideline"
  category: {
    type: String,
    enum: ['guideline', 'template', 'reference', 'submission', 'announcement', 'other'],
    required: [true, 'Category is required']
  },
  // Visibility
  // Contoh: "public"
  visibility: {
    type: String,
    enum: ['public', 'team-only', 'admin-only'],
    default: 'public'
  },
  // Uploader Info
  // Contoh: "ObjectId of User"
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  // Download Info
  // Contoh: 9
  downloadCount: {
    type: Number,
    default: 0
  },
  // Contoh: "2024-10-31T23:59:59.000Z"
  lastDownloadedAt: {
    type: Date,
    default: null
  },
  // Status
  // Contoh: true
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

documentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString(),
    delete ret._id,
    delete ret.__v
  }
})


const Document = mongoose.model('Document', documentSchema)
export default Document
