import CustomRequest from '../models/CustomRequest.js';
import Booking from '../models/Booking.js';
import Conversation from '../models/Conversation.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

// @desc    Create a custom design request
// @route   POST /api/custom-requests
// @access  Private
export const createCustomRequest = async (req, res) => {
  try {
    const { customerName, referenceLink, description, date, time } = req.body;

    if (!customerName || !referenceLink || !description) {
      return res.status(400).json({ message: 'Customer name, reference link, and description are required' });
    }

    const customRequest = new CustomRequest({
      userId: req.user._id,
      customerName,
      referenceLink,
      description,
      date: date || '',
      time: time || '',
      status: 'Pending',
    });

    const createdRequest = await customRequest.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged-in customer's requests
// @route   GET /api/custom-requests/my-requests
// @access  Private
export const getMyRequests = async (req, res) => {
  try {
    const requests = await CustomRequest.find({ userId: req.user._id })
      .populate('conversationId')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all custom requests (admin)
// @route   GET /api/custom-requests
// @access  Private/Admin
export const getAllCustomRequests = async (req, res) => {
  try {
    const requests = await CustomRequest.find({})
      .populate('userId', 'name email')
      .populate('conversationId')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update custom request status (admin)
// @route   PUT /api/custom-requests/:id
// @access  Private/Admin
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Accepted', 'Rejected', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Valid status (Accepted, Rejected, or Completed) is required' });
    }

    const request = await CustomRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Custom request not found' });
    }

    // If accepting, create a conversation for chat and an appointment
    if (status === 'Accepted' && !request.conversationId) {
      // Check for time slot conflicts if date and time are provided
      if (request.date && request.time) {
        // Check for conflicting appointments
        const conflictingAppointment = await Appointment.findOne({
          date: request.date,
          time: request.time,
          status: { $nin: ['Cancelled', 'Completed'] },
        });

        if (conflictingAppointment) {
          return res.status(409).json({
            message: 'This time slot is already booked. Please choose a different time.',
          });
        }

        // Check for conflicting bookings
        const conflictingBooking = await Booking.findOne({
          date: request.date,
          time: request.time,
          status: { $nin: ['Rejected', 'Cancelled'] },
        });

        if (conflictingBooking) {
          return res.status(409).json({
            message: 'This time slot is already booked. Please choose a different time.',
          });
        }
      }

      const conversation = await Conversation.create({
        participants: [request.userId, req.user._id],
        lastMessage: `Custom design request has been accepted!`,
        lastMessageAt: new Date(),
      });

      request.conversationId = conversation._id;

      // Create an appointment from the custom request
      const appointment = new Appointment({
        userId: request.userId,
        service: 'Custom Design',
        date: request.date || new Date().toISOString().split('T')[0],
        time: request.time || '10:00 AM',
        notes: `Custom design request. Reference: ${request.referenceLink}. Description: ${request.description}`,
        status: 'Confirmed',
        adminConfirmed: true,
      });

      await appointment.save();
    }

    request.status = status;
    const updatedRequest = await request.save();

    // Populate conversationId before returning
    await updatedRequest.populate('conversationId');

    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


