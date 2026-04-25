import express from 'express';
import {
  addToBrowseHistory,
  getBrowseHistory,
  clearBrowseHistory,
} from '../controllers/browseHistoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addToBrowseHistory)
  .get(protect, getBrowseHistory)
  .delete(protect, clearBrowseHistory);

export default router;
