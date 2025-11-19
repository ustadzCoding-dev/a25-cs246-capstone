import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
  {
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CapstoneGroup',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    rejectionReason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
invitationSchema.index({ memberId: 1, status: 1 });
invitationSchema.index({ teamId: 1 });
invitationSchema.index({ leaderId: 1 });

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
