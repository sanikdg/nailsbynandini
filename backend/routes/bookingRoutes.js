import express from 'express';
import {
  getAllBookings,
  getUserBookings,
  createBooking,
  acceptBooking,
  rejectBooking,
  updateBooking,
  deleteBooking,
  getBookedSlots,
  markCompleted,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Get booked time slots for a date (must be before /:id routes)
router.get('/booked-slots', protect, getBookedSlots);

// Get bookings - admin gets all, customer gets theirs
router.get('/', protect, async (req, res, next) => {
  if (req.user.isAdmin) {
    return getAllBookings(req, res);
  }
  return getUserBookings(req, res);
});

// Create booking (customer)
router.post('/', protect, createBooking);

// Accept booking (admin) - creates conversation
router.put('/:id/accept', protect, checkAdmin, acceptBooking);

// Reject booking (admin)
router.put('/:id/reject', protect, checkAdmin, rejectBooking);

// Mark booking as completed (admin)
router.put('/:id/complete', protect, checkAdmin, markCompleted);

// Update booking (admin)
router.put('/:id', protect, checkAdmin, updateBooking);

// Delete booking (admin)
router.delete('/:id', protect, checkAdmin, deleteBooking);

export default router;
