import express from 'express';
import { getTestimonials, getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, submitCustomerReview } from '../controllers/testimonialController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Customer review submission endpoint (must be before /:id route)
router.post('/submit-review', protect, submitCustomerReview);

router.route('/')
  .get(getTestimonials)
  .post(protect, checkAdmin, createTestimonial);

router.get('/all', protect, checkAdmin, getAllTestimonials);

router.route('/:id')
  .put(protect, checkAdmin, updateTestimonial)
  .delete(protect, checkAdmin, deleteTestimonial);

export default router;
