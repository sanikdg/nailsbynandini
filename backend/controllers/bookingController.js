import Booking from '../models/Booking.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'name email')
      .populate('designId', 'title image price')
      .populate('conversationId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's bookings (customer)
// @route   GET /api/bookings?userId=:id
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const bookings = await Booking.find({ userId })
      .populate('designId', 'title image price')
      .populate('conversationId')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booked time slots for a specific date
// @route   GET /api/bookings/booked-slots?date=YYYY-MM-DD
// @access  Private
export const getBookedSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'date query parameter is required' });
    }

    console.log(`[DEBUG] Fetching booked slots for date: ${date}`);

    // Find all bookings for this date that are not rejected or cancelled
    const bookings = await Booking.find({
      date,
      status: { $nin: ['Rejected', 'Cancelled'] },
    }).select('time status');

    console.log(`[DEBUG] Found ${bookings.length} bookings:`, bookings.map(b => ({ time: b.time, status: b.status })));

    // Find all appointments for this date that are not cancelled or completed
    const appointments = await Appointment.find({
      date,
      status: { $nin: ['Cancelled', 'Completed'] },
    }).select('time status');

    console.log(`[DEBUG] Found ${appointments.length} appointments:`, appointments.map(a => ({ time: a.time, status: a.status })));

    // Combine booked times from both bookings and appointments
    const bookedTimes = [
      ...bookings.map((b) => b.time),
      ...appointments.map((a) => a.time),
    ];

    // Remove duplicates
    const uniqueBookedTimes = [...new Set(bookedTimes)];

    console.log(`[DEBUG] Final booked times:`, uniqueBookedTimes);

    res.json({ date, bookedTimes: uniqueBookedTimes });
  } catch (error) {
    console.error('[ERROR] getBookedSlots:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { userId, customerName, designId, designName, date, time } = req.body;

    // Validate required fields
    if (!userId || !customerName || !designName || !date || !time) {
      return res.status(400).json({ message: 'Customer name, design name, date, and time are required' });
    }

    // Check for duplicate booking (same date + time, not rejected/cancelled)
    const existingBooking = await Booking.findOne({
      date,
      time,
      status: { $nin: ['Rejected', 'Cancelled'] },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: 'This time slot is already booked. Please choose a different time.',
      });
    }

    const booking = new Booking({
      userId,
      customerName,
      designId,
      designName,
      date,
      time,
      status: 'Pending',
    });

    const createdBooking = await booking.save();
    const populatedBooking = await createdBooking.populate('designId', 'title image price');
    
    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Accept booking (admin) - creates conversation
// @route   PUT /api/bookings/:id/accept
// @access  Private/Admin
export const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Get admin user (current user)
    const admin = await User.findById(req.user._id);
    const customer = await User.findById(booking.userId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Create conversation if it doesn't exist
    let conversation = await Conversation.findOne({
      bookingId: booking._id,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [booking.userId, req.user._id],
        bookingId: booking._id,
        designId: booking.designId,
        lastMessage: `Booking for ${booking.designName} has been accepted!`,
        lastMessageAt: new Date(),
      });
    }

    // Update booking
    booking.status = 'Confirmed';
    booking.conversationId = conversation._id;
    await booking.save();

    const updatedBooking = await booking.populate('designId', 'title image price');
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Reject booking (admin)
// @route   PUT /api/bookings/:id/reject
// @access  Private/Admin
export const rejectBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'Rejected';
    booking.notes = reason || 'Booking rejected by admin';
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
export const updateBooking = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (status) booking.status = status;
    if (notes) booking.notes = notes;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark booking as completed (admin)
// @route   PUT /api/bookings/:id/complete
// @access  Private/Admin
export const markCompleted = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!['Confirmed', 'Accepted'].includes(booking.status)) {
      return res.status(400).json({ message: 'Only confirmed or accepted bookings can be marked as completed' });
    }

    booking.status = 'Completed';
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete booking (admin)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
