import Appointment from '../models/Appointment.js';
import { createNotification } from './notificationController.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req, res) => {
  try {
    const { date, time, service } = req.body;

    const appointment = new Appointment({
      userId: req.user._id,
      date,
      time,
      service,
    });

    const createdAppointment = await appointment.save();

    // Create notification for admin
    await createNotification({
      type: 'new_appointment',
      title: 'New Appointment Booked',
      message: `${req.user.name} booked an appointment for ${service || 'Nail Appointment'} on ${date} at ${time}`,
      relatedId: createdAppointment._id,
    });

    res.status(201).json(createdAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req, res) => {
  try {
    const appointments = req.user.isAdmin
      ? await Appointment.find({}).populate('userId', 'name email').populate('inquiryId', 'description image status')
      : await Appointment.find({ userId: req.user._id }).populate('inquiryId', 'description image status');
      
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('userId', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only allow the appointment owner or admin to view
    if (appointment.userId._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    User responds to appointment (accept/reject proposed date)
// @route   PATCH /api/appointments/:id/respond
// @access  Private
export const respondToAppointment = async (req, res) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only the appointment owner can respond
    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (action === 'accept') {
      // If admin proposed a new date, accept it — move proposed into main date/time
      if (appointment.proposedDate) {
        appointment.date = appointment.proposedDate;
        appointment.time = appointment.proposedTime || appointment.time;
        appointment.proposedDate = undefined;
        appointment.proposedTime = undefined;
      }
      appointment.status = 'Confirmed';
      appointment.userConfirmed = true;

      await createNotification({
        type: 'appointment_accepted',
        title: 'Appointment Accepted',
        message: `${req.user.name} accepted the appointment on ${appointment.date} at ${appointment.time}`,
        relatedId: appointment._id,
      });
    } else if (action === 'reject') {
      appointment.status = 'Cancelled';
      appointment.userConfirmed = false;
      appointment.proposedDate = undefined;
      appointment.proposedTime = undefined;

      await createNotification({
        type: 'appointment_rejected',
        title: 'Appointment Rejected',
        message: `${req.user.name} rejected the proposed appointment date`,
        relatedId: appointment._id,
      });
    } else {
      return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject".' });
    }

    const updated = await appointment.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    User confirms a pending appointment
// @route   PATCH /api/appointments/:id/confirm
// @access  Private  
export const confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.userConfirmed = true;
    if (appointment.adminConfirmed) {
      appointment.status = 'Confirmed';
    }

    const updated = await appointment.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
