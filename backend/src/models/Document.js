import mongoose from 'mongoose';

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
    default: null,
    trim: true
  },
  // External link (optional alternative to file upload)
  // Contoh: "https://drive.google.com/file/d/..."
  link: {
    type: String,
    default: null,
    trim: true
  },
  // Category
  // Contoh: "Panduan", "Template", "Referensi", "Lainnya"
  category: {
    type: String,
    enum: ['Panduan', 'Template', 'Referensi', 'Lainnya'],
    required: [true, 'Category is required']
  },
  // Visibility
  // Contoh: "public", "private"
  visibility: {
    type: String,
    enum: ['public', 'private'],
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

documentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString(),
    delete ret._id,
    delete ret.__v;
  }
});


const Document = mongoose.model('Document', documentSchema);
export default Document;
