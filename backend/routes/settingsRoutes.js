import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSettings)
  .put(protect, checkAdmin, updateSettings);

export default router;
