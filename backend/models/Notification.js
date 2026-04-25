import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['new_inquiry', 'new_message', 'new_appointment', 'new_user', 'inquiry_update'],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
