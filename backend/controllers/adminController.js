import User from '../models/User.js';
import Inquiry from '../models/Inquiry.js';
import Appointment from '../models/Appointment.js';
import Design from '../models/Design.js';
import Offer from '../models/Offer.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import SavedDesign from '../models/SavedDesign.js';
import { createNotification } from './notificationController.js';

// Dashboard Overview
export const getDashboardOverview = async (req, res) => {
  try {
    // Today boundaries
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalUsers, pendingInquiries, confirmedAppointments,
      publishedDesigns, activeOffers, activeConversations,
      completedAppointments, totalAppointments,
      todayAppointments, todayInquiries, todayUsers,
      rescheduledPending
    ] = await Promise.all([
      User.countDocuments({ isAdmin: false }),
      Inquiry.countDocuments({ status: 'Pending' }),
      Appointment.countDocuments({ status: 'Confirmed' }),
      Design.countDocuments(),
      Offer.countDocuments({ expiry: { $gte: new Date() } }),
      Conversation.countDocuments(),
      Appointment.countDocuments({ status: 'Completed' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ date: { $gte: todayStart, $lte: todayEnd } }),
      Inquiry.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
      User.countDocuments({ isAdmin: false, createdAt: { $gte: todayStart, $lte: todayEnd } }),
      Appointment.countDocuments({ status: 'Rescheduled' })
    ]);

    // Revenue estimation: avg ₹800 per confirmed/completed appointment
    const avgServicePrice = 800;
    const totalRevenue = (confirmedAppointments + completedAppointments) * avgServicePrice;
    const todayRevenue = todayAppointments * avgServicePrice;

    // Peak time calculation from appointment times
    const allAppointmentsWithTime = await Appointment.find({ time: { $exists: true } }).select('time');
    const hourCounts = {};
    allAppointmentsWithTime.forEach(a => {
      if (a.time) {
        const hour = a.time.split(':')[0] || a.time.split(' ')[0];
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });
    const peakTime = Object.keys(hourCounts).length > 0
      ? Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0] + ':00'
      : 'N/A';

    // Appointment status breakdown
    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusBreakdown = {};
    appointmentsByStatus.forEach(s => { statusBreakdown[s._id] = s.count; });

    // Get recent inquiries for activity
    const recentInquiries = await Inquiry.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get upcoming appointments
    const upcomingAppointments = await Appointment.find({
      status: { $in: ['Confirmed', 'Pending'] },
      date: { $gte: todayStart }
    })
      .populate('userId', 'name email')
      .sort({ date: 1 })
      .limit(5);

    // Unified recent activity timeline
    const recentInquiriesForTimeline = await Inquiry.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(4);

    const recentAppointmentsForTimeline = await Appointment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(4);

    const activityTimeline = [
      ...recentInquiriesForTimeline.map(i => ({
        _id: i._id,
        type: 'inquiry',
        title: `New inquiry from ${i.userId?.name || 'Unknown'}`,
        description: i.description?.substring(0, 80) || '',
        status: i.status,
        timestamp: i.createdAt,
        userName: i.userId?.name,
        userEmail: i.userId?.email
      })),
      ...recentAppointmentsForTimeline.map(a => ({
        _id: a._id,
        type: 'appointment',
        title: `${a.status} appointment — ${a.userId?.name || 'Unknown'}`,
        description: `${a.service || 'Nail Appointment'} on ${new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${a.time}`,
        status: a.status,
        timestamp: a.createdAt,
        userName: a.userId?.name,
        userEmail: a.userId?.email
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8);

    res.json({
      metrics: {
        totalUsers,
        pendingInquiries,
        confirmedAppointments,
        publishedDesigns,
        activeOffers,
        activeConversations,
        completedAppointments,
        totalAppointments,
        totalRevenue,
        todayRevenue
      },
      today: {
        appointments: todayAppointments,
        inquiries: todayInquiries,
        newUsers: todayUsers,
        revenue: todayRevenue
      },
      peakTime,
      pendingActions: pendingInquiries + rescheduledPending,
      statusBreakdown,
      recentInquiries,
      upcomingAppointments,
      activityTimeline
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select('-password')
      .sort({ createdAt: -1 });

    // Enrich with inquiry and appointment counts
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const inquiryCount = await Inquiry.countDocuments({ userId: user._id });
        const appointmentCount = await Appointment.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          inquiryCount,
          appointmentCount
        };
      })
    );

    res.json(enrichedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const inquiries = await Inquiry.find({ userId: user._id }).sort({ createdAt: -1 });
    const appointments = await Appointment.find({ userId: user._id }).sort({ date: -1 });
    const savedDesigns = await SavedDesign.find({ userId: user._id }).populate('designId');

    res.json({
      user,
      inquiries,
      appointments,
      savedDesigns,
      stats: {
        totalInquiries: inquiries.length,
        totalAppointments: appointments.length,
        pendingInquiries: inquiries.filter(i => i.status === 'Pending').length,
        savedDesignsCount: savedDesigns.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all inquiries with client info
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('userId', 'name email')
      .populate('designId', 'title image')
      .sort({ createdAt: -1 });

    // Enrich with unread message count
    const enrichedInquiries = await Promise.all(
      inquiries.map(async (inquiry) => {
        const conversation = await Conversation.findOne({ inquiryId: inquiry._id });
        let unreadCount = 0;
        if (conversation) {
          const unreadMessages = await Message.countDocuments({
            conversationId: conversation._id,
            readBy: { $ne: req.user._id }
          });
          unreadCount = unreadMessages;
        }
        return {
          ...inquiry.toObject(),
          conversationId: conversation?._id,
          unreadCount
        };
      })
    );

    res.json(enrichedInquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inquiry details
export const getInquiryDetails = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('userId', 'name email createdAt')
      .populate('designId', 'title image price category');

    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    const conversation = await Conversation.findOne({ inquiryId: inquiry._id })
      .populate('participants', 'name email');

    const messages = conversation ? await Message.find({ conversationId: conversation._id })
      .populate('senderId', 'name email')
      .sort({ createdAt: 1 }) : [];

    res.json({
      inquiry,
      conversation,
      messages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update inquiry status
export const updateInquiryStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create appointment from inquiry (approve flow)
export const createAppointmentFromInquiry = async (req, res) => {
  try {
    const { inquiryId, date, time, notes } = req.body;
    const inquiry = await Inquiry.findById(inquiryId).populate('userId', 'name email');

    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    // Create the appointment
    const appointment = await Appointment.create({
      userId: inquiry.userId._id || inquiry.userId,
      inquiryId,
      service: inquiry.description?.substring(0, 60) || 'Custom Nail Design',
      date,
      time,
      notes: notes || inquiry.description,
      status: 'Confirmed',
      adminConfirmed: true
    });

    // Update inquiry status to Confirmed
    inquiry.status = 'Confirmed';
    await inquiry.save();

    // Create notification for the customer
    await createNotification({
      type: 'inquiry_approved',
      title: 'Design Request Approved!',
      message: `Your design request has been approved. Appointment on ${date} at ${time}`,
      relatedId: appointment._id,
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('userId', 'name email')
      .populate('inquiryId', 'description image status');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'name email')
      .populate('inquiryId', 'description image status preferredDate')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment (admin can propose new date or update status)
export const updateAppointment = async (req, res) => {
  try {
    const { status, date, time, notes, proposedDate, proposedTime, adminNotes } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // If admin is proposing a new date
    if (proposedDate) {
      appointment.proposedDate = proposedDate;
      appointment.proposedTime = proposedTime || appointment.time;
      appointment.adminNotes = adminNotes || '';
      appointment.status = 'Rescheduled';
      appointment.adminConfirmed = true;
      appointment.userConfirmed = false;
    } else {
      // Direct status/field updates
      if (status) appointment.status = status;
      if (date) appointment.date = date;
      if (time) appointment.time = time;
      if (notes !== undefined) appointment.notes = notes;

      // If admin confirms directly
      if (status === 'Confirmed') {
        appointment.adminConfirmed = true;
      }
    }

    const updated = await appointment.save();
    const populated = await Appointment.findById(updated._id).populate('userId', 'name email');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

