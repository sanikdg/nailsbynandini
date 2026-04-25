import express from 'express';
import { createMessage, getMessages, markMessagesAsRead } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createMessage);

router.route('/:conversationId')
  .get(protect, getMessages);

router.route('/:conversationId/read')
  .put(protect, markMessagesAsRead);

export default router;
