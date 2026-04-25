import mongoose from 'mongoose';

const savedDesignSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    designId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Design',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only save a specific design once
savedDesignSchema.index({ userId: 1, designId: 1 }, { unique: true });

const SavedDesign = mongoose.model('SavedDesign', savedDesignSchema);
export default SavedDesign;
