import mongoose from 'mongoose';

const customRequestSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    customerName: {
      type: String,
      required: true,
    },
    referenceLink: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: false,
    },
    time: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
      default: 'Pending',
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const CustomRequest = mongoose.model('CustomRequest', customRequestSchema);
export default CustomRequest;
