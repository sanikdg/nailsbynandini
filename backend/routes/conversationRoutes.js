import express from 'express';
import { createConversation, getConversations, getConversationById } from '../controllers/conversationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getConversations)
  .post(protect, createConversation);

router.route('/:id')
  .get(protect, getConversationById);

export default router;
