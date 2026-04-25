import mongoose from 'mongoose';

const browseHistorySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    designId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Design',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
browseHistorySchema.index({ userId: 1, createdAt: -1 });
browseHistorySchema.index({ userId: 1, designId: 1 }, { unique: true });

const BrowseHistory = mongoose.model('BrowseHistory', browseHistorySchema);
export default BrowseHistory;
