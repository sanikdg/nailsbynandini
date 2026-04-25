import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/adminMiddleware.js';
import {
  getDashboardOverview,
  getAllUsers,
  getUserProfile,
  getAllInquiries,
  getInquiryDetails,
  updateInquiryStatusAdmin,
  createAppointmentFromInquiry,
  getAllAppointments,
  updateAppointment
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, checkAdmin);

// Dashboard
router.get('/overview', getDashboardOverview);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserProfile);

// Inquiries
router.get('/inquiries', getAllInquiries);
router.get('/inquiries/:id', getInquiryDetails);
router.patch('/inquiries/:id/status', updateInquiryStatusAdmin);

// Appointments
router.get('/appointments', getAllAppointments);
router.post('/appointments/from-inquiry', createAppointmentFromInquiry);
router.patch('/appointments/:id', updateAppointment);

export default router;
