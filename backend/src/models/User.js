import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// MENYIMPAN DATA USER
const userSchema = new mongoose.Schema(
  {
    // ========== GOOGLE OAUTH FIELDS (TAMBAHAN BARU) ==========
    // Google ID
    // Contoh: "1234567890"
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow null for non-Google users
      trim: true
    },

    // Profile Picture (from Google or uploaded)
    // Contoh: "https://lh3.googleusercontent.com/a/..."
    profilePicture: {
      type: String,
      default: null
    },

    // OAuth Provider
    // Contoh: "local" atau "google"
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },

    // Email Verification Status
    isEmailVerified: {
      type: Boolean,
      default: false
    },

    // Refresh Token for JWT
    refreshToken: {
      type: String,
      default: null,
      select: false
    },

    // Last Login Timestamp
    lastLogin: {
      type: Date,
      default: null
    },

    // ========== EXISTING FIELDS (TETAP) ==========
    // DicodingId
    // Contoh: "A25-CS246"
    dicodingId: {
      type: String,
      required: function () {
        // DicodingId wajib untuk local users, optional untuk Google OAuth (bisa diisi nanti)
        return this.provider === 'local';
      },
      unique: true,
      sparse: true, // Allow null/undefined
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
      required: function () {
        // Password wajib hanya untuk local users
        return this.provider === 'local';
      },
      select: false
    },

    // Learning Path ID (Reference to LearningPath)
    // Contoh: ObjectId("691f2684ae3d1a30e045a853")
    learningPathId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningPath',
      default: null
    },

    // Learning Path Name (Cached for display)
    // Contoh: "Front-End Web & Back-End with AI"
    learningPathName: {
      type: String,
      default: null
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
      trim: true,
      default: null
    },

    // Capstone Group
    // Contoh: "ObjectId of CapstoneGroup"
    capstoneGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CapstoneGroup',
      default: null
    },

    // FIX CASE 31: Member status in team (active/kedo/dropout)
    memberStatus: {
      type: String,
      enum: ['active', 'kedo', 'dropout'],
      default: 'active'
    },

    // Learning Group
    // Contoh: "ObjectId of LearningGroup"
    learningGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningGroup',
      default: null
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ========== MIDDLEWARE: HASH PASSWORD BEFORE SAVE ==========
userSchema.pre('save', async function (next) {
  // Skip hashing if password is not modified or doesn't exist
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  // ⭐ PERBAIKAN: Cek apakah password sudah di-hash sebelumnya
  // Bcrypt hash selalu dimulai dengan $2a$, $2b$, atau $2y$
  const isBcryptHash = /^\$2[ayb]\$\d{2}\$/.test(this.password);

  if (isBcryptHash) {
    // Password sudah di-hash, skip hashing
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ========== METHODS ==========

// Compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {return false;}
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user is admin
userSchema.methods.isAdmin = function () {
  return this.role === 'admin';
};

// Check if user is mentor
userSchema.methods.isMentor = function () {
  return this.role === 'mentor';
};

// ========== JSON TRANSFORMATION ==========
userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Never expose password
    delete ret.refreshToken; // Never expose refresh token
  }
});

const User = mongoose.model('User', userSchema);
export default User;
