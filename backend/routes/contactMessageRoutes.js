import express from 'express';
import {
  createContactMessage,
  getAllContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from '../controllers/contactMessageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public: Create contact message (no auth required)
router.post('/', createContactMessage);

// Admin only: Get all messages, update status, delete
router.get('/', protect, checkAdmin, getAllContactMessages);
router.put('/:id', protect, checkAdmin, updateContactMessageStatus);
router.delete('/:id', protect, checkAdmin, deleteContactMessage);

export default router;
