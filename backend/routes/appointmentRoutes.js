import express from 'express';
import { createAppointment, getAppointments, getAppointmentById, respondToAppointment, confirmAppointment } from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createAppointment)
  .get(protect, getAppointments);

router.route('/:id')
  .get(protect, getAppointmentById);

router.patch('/:id/respond', protect, respondToAppointment);
router.patch('/:id/confirm', protect, confirmAppointment);

export default router;
