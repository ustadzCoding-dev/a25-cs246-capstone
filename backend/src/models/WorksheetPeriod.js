import mongoose from 'mongoose';

// MENYIMPAN DATA PERIODE CHECK-IN WORKSHEET
// Periode check-in dibagi menjadi 3 periode (bi-weekly)
const worksheetPeriodSchema = new mongoose.Schema(
  {
    // Nomor Periode (1, 2, atau 3)
    periodNumber: {
      type: Number,
      required: [true, 'Period number is required'],
      min: [1, 'Period number must be at least 1'],
      max: [10, 'Period number cannot exceed 10']
    },

    // Judul Periode
    // Contoh: "Check-in Periode 1", "Bi-weekly Report #2"
    title: {
      type: String,
      required: [true, 'Period title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },

    // Deskripsi Periode (opsional)
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: null
    },

    // Tanggal Mulai Periode
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },

    // Deadline Pengisian Worksheet
    deadline: {
      type: Date,
      required: [true, 'Deadline is required']
    },

    // Tanggal Validasi Otomatis
    // Setelah tanggal ini, sistem akan otomatis memvalidasi worksheet
    autoValidationDate: {
      type: Date,
      required: [true, 'Auto validation date is required']
    },

    // Status Periode
    // - draft: periode belum aktif
    // - active: periode sedang berlangsung, peserta bisa mengisi
    // - closed: periode sudah tutup, tidak bisa mengisi lagi
    // - validated: sudah divalidasi
    status: {
      type: String,
      enum: ['draft', 'active', 'closed', 'validated'],
      default: 'draft'
    },

    // Flag apakah validasi otomatis sudah dijalankan
    isAutoValidated: {
      type: Boolean,
      default: false
    },

    // Tanggal validasi otomatis dijalankan
    autoValidatedAt: {
      type: Date,
      default: null
    },

    // Admin yang membuat periode
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // Notifikasi reminder
    reminderSettings: {
      // Kirim reminder H-3 sebelum deadline
      reminderDaysBefore: {
        type: Number,
        default: 3
      },
      // Flag apakah reminder sudah dikirim
      reminderSent: {
        type: Boolean,
        default: false
      },
      // Tanggal reminder dikirim
      reminderSentAt: {
        type: Date,
        default: null
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ========== INDEXES ==========
worksheetPeriodSchema.index({ periodNumber: 1 });
worksheetPeriodSchema.index({ status: 1 });
worksheetPeriodSchema.index({ deadline: 1 });
worksheetPeriodSchema.index({ autoValidationDate: 1 });

// ========== VIRTUALS ==========

// Check if period is currently active (within start and deadline)
worksheetPeriodSchema.virtual('isCurrentlyActive').get(function () {
  const now = new Date();
  return this.status === 'active' && now >= this.startDate && now <= this.deadline;
});

// Check if deadline has passed
worksheetPeriodSchema.virtual('isDeadlinePassed').get(function () {
  return new Date() > this.deadline;
});

// Days remaining until deadline
worksheetPeriodSchema.virtual('daysRemaining').get(function () {
  const now = new Date();
  const deadline = new Date(this.deadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Status label in Indonesian
worksheetPeriodSchema.virtual('statusLabel').get(function () {
  const labels = {
    draft: 'Draft',
    active: 'Aktif',
    closed: 'Ditutup',
    validated: 'Sudah Divalidasi'
  };
  return labels[this.status] || this.status;
});

// ========== METHODS ==========

// Activate period
worksheetPeriodSchema.methods.activate = async function () {
  this.status = 'active';
  return this.save();
};

// Close period
worksheetPeriodSchema.methods.close = async function () {
  this.status = 'closed';
  return this.save();
};

// Mark as validated
worksheetPeriodSchema.methods.markAsValidated = async function () {
  this.status = 'validated';
  this.isAutoValidated = true;
  this.autoValidatedAt = new Date();
  return this.save();
};

// Mark reminder as sent
worksheetPeriodSchema.methods.markReminderSent = async function () {
  this.reminderSettings.reminderSent = true;
  this.reminderSettings.reminderSentAt = new Date();
  return this.save();
};

// ========== STATICS ==========

// Find active period
worksheetPeriodSchema.statics.findActivePeriod = function () {
  return this.findOne({ status: 'active' }).sort({ periodNumber: 1 });
};

// Find all periods sorted by period number
worksheetPeriodSchema.statics.findAllSorted = function () {
  return this.find().sort({ periodNumber: 1 });
};

// Find periods that need auto-validation
worksheetPeriodSchema.statics.findPeriodsForAutoValidation = function () {
  const now = new Date();
  return this.find({
    status: 'closed',
    isAutoValidated: false,
    autoValidationDate: { $lte: now }
  });
};

// Find periods that need reminder
worksheetPeriodSchema.statics.findPeriodsForReminder = function () {
  const now = new Date();
  return this.find({
    status: 'active',
    'reminderSettings.reminderSent': false,
    deadline: {
      $gte: now,
      $lte: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    }
  });
};

// ========== PRE-SAVE MIDDLEWARE ==========
worksheetPeriodSchema.pre('save', function (next) {
  // Ensure autoValidationDate is after deadline
  if (this.autoValidationDate && this.deadline && this.autoValidationDate < this.deadline) {
    this.autoValidationDate = new Date(this.deadline.getTime() + 24 * 60 * 60 * 1000); // 1 day after deadline
  }
  next();
});

// ========== JSON TRANSFORMATION ==========
worksheetPeriodSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

const WorksheetPeriod = mongoose.model('WorksheetPeriod', worksheetPeriodSchema);
export default WorksheetPeriod;
