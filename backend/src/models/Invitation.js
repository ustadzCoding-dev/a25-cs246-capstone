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
    },
    // PRIORITY 3.2: Invitation expiry (30 days)
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
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

// PRIORITY 3.2: TTL index to auto-delete expired invitations
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
