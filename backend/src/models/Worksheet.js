import mongoose from 'mongoose';

// MENYIMPAN DATA WORKSHEET / CHECK-IN PROGRESS INDIVIDU
const worksheetSchema = new mongoose.Schema(
  {
    // User ID (Reference to User)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },

    // Period ID (Reference to WorksheetPeriod)
    periodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorksheetPeriod',
      required: [true, 'Period ID is required']
    },

    // Deskripsi Aktivitas
    // Peserta menjelaskan aktivitas yang dilakukan selama periode tersebut
    // Note: Validation for minlength is done at submit time, not at save time
    // This allows users to upload evidence before filling in the description
    activityDescription: {
      type: String,
      default: '',
      trim: true,
      maxlength: [5000, 'Activity description cannot exceed 5000 characters']
    },

    // Bukti / Evidence
    // Array of files stored in Cloudinary
    evidence: [
      {
        // Nama file asli
        originalName: {
          type: String,
          required: true
        },
        // Nama file di Cloudinary (public_id)
        fileName: {
          type: String,
          required: true
        },
        // URL file di Cloudinary atau local path
        filePath: {
          type: String,
          required: true
        },
        // URL file (alias untuk kemudahan akses)
        // Not required for backward compatibility with legacy local uploads
        fileUrl: {
          type: String,
          required: false,
          default: null
        },
        // Cloudinary public ID untuk delete
        // Not required for backward compatibility with legacy local uploads
        publicId: {
          type: String,
          required: false,
          default: null
        },
        // MIME type
        mimeType: {
          type: String,
          required: true
        },
        // Ukuran file dalam bytes
        fileSize: {
          type: Number,
          required: true
        },
        // Cloudinary resource type (image or raw for PDF)
        resourceType: {
          type: String,
          enum: ['image', 'raw'],
          default: 'image'
        },
        // Tanggal upload
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // Tanggal Submit
    submittedAt: {
      type: Date,
      default: null
    },

    // Status Validasi
    // - pending: belum divalidasi
    // - completed: selesai tepat waktu dan sesuai ketentuan
    // - completed_late: selesai tapi terlambat
    // - incomplete: tidak mengisi worksheet sama sekali
    validationStatus: {
      type: String,
      enum: ['pending', 'completed', 'completed_late', 'incomplete'],
      default: 'pending'
    },

    // Catatan dari Admin (opsional)
    adminNotes: {
      type: String,
      trim: true,
      default: null
    },

    // Admin yang melakukan validasi
    validatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // Tanggal validasi
    validatedAt: {
      type: Date,
      default: null
    },

    // Flag apakah sudah di-submit
    isSubmitted: {
      type: Boolean,
      default: false
    },

    // Flag apakah terlambat submit
    isLate: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ========== INDEXES ==========
// Unique constraint: satu user hanya bisa punya satu worksheet per periode
worksheetSchema.index({ userId: 1, periodId: 1 }, { unique: true });
worksheetSchema.index({ periodId: 1, validationStatus: 1 });
worksheetSchema.index({ userId: 1, isSubmitted: 1 });

// ========== VIRTUALS ==========
// Get validation status label in Indonesian
worksheetSchema.virtual('validationStatusLabel').get(function () {
  const labels = {
    pending: 'Menunggu Validasi',
    completed: 'Selesai',
    completed_late: 'Selesai, Terlambat',
    incomplete: 'Tidak Selesai'
  };
  return labels[this.validationStatus] || this.validationStatus;
});

// Get evidence count
worksheetSchema.virtual('evidenceCount').get(function () {
  return this.evidence ? this.evidence.length : 0;
});

// ========== METHODS ==========

// Submit worksheet
worksheetSchema.methods.submit = async function (deadline) {
  this.isSubmitted = true;
  this.submittedAt = new Date();

  // Check if submission is late
  if (deadline && this.submittedAt > deadline) {
    this.isLate = true;
  }

  return this.save();
};

// Validate worksheet (by admin)
// Note: Using 'setValidation' instead of 'validate' to avoid mongoose internal method conflict
worksheetSchema.methods.setValidation = async function (adminId, status, notes = null) {
  this.validationStatus = status;
  this.validatedBy = adminId;
  this.validatedAt = new Date();
  if (notes) {
    this.adminNotes = notes;
  }
  return this.save();
};

// ========== STATICS ==========

// Find worksheets by period
worksheetSchema.statics.findByPeriod = function (periodId) {
  return this.find({ periodId })
    .populate('userId', 'name email dicodingId learningPathName')
    .populate('periodId', 'periodNumber title deadline')
    .sort({ submittedAt: -1 });
};

// Find worksheets by user
worksheetSchema.statics.findByUser = function (userId) {
  return this.find({ userId })
    .populate('periodId', 'periodNumber title startDate deadline')
    .sort({ createdAt: -1 });
};

// Get submission statistics for a period
worksheetSchema.statics.getStatsByPeriod = async function (periodId) {
  const stats = await this.aggregate([
    { $match: { periodId: new mongoose.Types.ObjectId(periodId) } },
    {
      $group: {
        _id: '$validationStatus',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    total: 0,
    pending: 0,
    completed: 0,
    completed_late: 0,
    incomplete: 0
  };

  stats.forEach((stat) => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });

  return result;
};

// ========== JSON TRANSFORMATION ==========
worksheetSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

const Worksheet = mongoose.model('Worksheet', worksheetSchema);
export default Worksheet;
