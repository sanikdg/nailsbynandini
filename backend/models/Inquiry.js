import mongoose from 'mongoose';

const inquirySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    designId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Design',
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    preferredDate: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Discussing', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
