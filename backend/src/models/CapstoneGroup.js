import mongoose from "mongoose";

// MENYIMPAN DATA TIM
const capstoneGroupSchema = new mongoose.Schema({
  // Captone Group ID
  // Contoh: "A25-CS246"
  capstoneGroupId: {
    type: String,
    required: true,
    unique: true,
  },
  // ID Unik Usecase
  // Contoh: "DC-09"
  useCaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usecase",
    required: true,
  },
  // Nama Tim
  // Contoh: "Tim Hebat A25"
  teamName: {
    type: String,
    required: true,
  },
  // Data Anggota Tim
  membersUserId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // Status (Sesuai permintaan Anda)
  // Contoh: "pending"
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  // Tanggal Submit (Sesuai permintaan Anda)
  // Contoh: "2025-10-31T23:59:59.000Z"
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  // Validasi oleh
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  // Tanggal Validasi (Sesuai permintaan Anda)
  // Contoh: "2025-10-31T23:59:59.000Z"
  validatedAt: {
    type: Date,
    default: null,
  },
  // Alasan penolakan
  rejectionReason: {
    type: String,
    default: null,
  },
});

capstoneGroupSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    try {
      const User = mongoose.model("User");
      await User.updateMany(
        { _id: { $in: doc.membersUserId } },
        { $set: { capstoneGroupId: null } }
      );
    } catch (error) {
      console.log('Gagal membersihkan teamId di user:', error);
    }
  }
});

const CapstoneGroup = mongoose.model("CapstoneGroup", capstoneGroupSchema);
export default CapstoneGroup;
