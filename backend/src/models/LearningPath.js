import mongoose from 'mongoose';

const learningPathSchema = new mongoose.Schema(
  {
    // Learning Path Name
    // Contoh: "Front-End Web & Back-End with AI"
    name: {
      type: String,
      required: [true, 'Learning path name is required'],
      unique: true,
      trim: true
    },

    // Learning Path Code (for internal use)
    // Contoh: "FE_BE_AI"
    code: {
      type: String,
      required: [true, 'Learning path code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },

    // Description
    // Contoh: "Fokus pada front-end dan back-end development dengan AI integration"
    description: {
      type: String,
      default: null,
      trim: true
    },

    // Is Active
    // Jika false, tidak akan ditampilkan di dropdown
    isActive: {
      type: Boolean,
      default: true
    },

    // Dicoding ID Prefix (for generating student IDs)
    // Contoh: "FEBE" untuk "Front-End Web & Back-End with AI"
    // Hasil: FEBE00001AI
    dicodingIdPrefix: {
      type: String,
      required: [true, 'Dicoding ID prefix is required'],
      uppercase: true,
      trim: true,
      minlength: [2, 'Prefix must be at least 2 characters'],
      maxlength: [10, 'Prefix must not exceed 10 characters']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('LearningPath', learningPathSchema);
