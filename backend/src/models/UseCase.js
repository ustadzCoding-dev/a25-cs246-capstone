import mongoose from 'mongoose';

// MENYIMPAN DATA USE CASE
const useCaseSchema = new mongoose.Schema({
  // UsecaseId
  // Contoh: "DC-09"
  usecaseId: {
    type: String,
    required: true
  },
  // Judul
  // Contoh: "Enhancing Academic Dashboard"
  title: {
    type: String,
    required: true
  },
  // Deskripsi
  // Contoh: "Panduan lengkap pengerjaan dan submission capstone project."
  description: {
    type: String,
    required: true
  },
  // Partner
  // Contoh: "Dicoding" atau "Accenture"
  partner: {
    type: String,
    required: true
  },
  // Total Slot
  // Contoh: 5
  totalSlots: {
    type: Number,
    required: true,
    default: 1
  },
  // Capstone Groups
  // Contoh: [ObjectId of CapstoneGroup]
  capstoneGroup: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CapstoneGroup',
    default: []
  }],
  // Available Slots
  // Contoh: 5
  availableSlots: {
    type: Number,
    required: true,
    default: 1
  },
  // Difficulty
  // Contoh: "easy", "medium", "hard"
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
    default: 'medium'
  },
  // Status
  // Contoh: "open" atau "closed"
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  // Team Composition Requirements
  // Contoh: [{ learningPathId: ObjectId, learningPathName: "Front-End & Back-End with AI", count: 3 }]
  teamComposition: [{
    learningPathId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningPath',
      required: true
    },
    learningPathName: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  // Total Team Size (calculated from composition)
  // Contoh: 5
  totalTeamSize: {
    type: Number,
    default: 0
  }
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

useCaseSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString(),
    delete ret._id,
    delete ret.__v;
  }
});

const UseCase = mongoose.model('UseCase', useCaseSchema);
export default UseCase;
