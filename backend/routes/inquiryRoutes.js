import express from 'express';
import { createInquiry, getInquiries, updateInquiryStatus } from '../controllers/inquiryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createInquiry)
  .get(protect, getInquiries);

router.route('/:id')
  .put(protect, updateInquiryStatus);

export default router;
