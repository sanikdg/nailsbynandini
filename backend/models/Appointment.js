import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    inquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inquiry',
      required: false,
    },
    service: {
      type: String,
      required: false,
      default: 'Nail Appointment',
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Pending',
    },
    // Admin can propose a different date/time
    proposedDate: {
      type: String,
      required: false,
    },
    proposedTime: {
      type: String,
      required: false,
    },
    adminNotes: {
      type: String,
      required: false,
    },
    // Tracking confirmation from both sides
    userConfirmed: {
      type: Boolean,
      default: false,
    },
    adminConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;

