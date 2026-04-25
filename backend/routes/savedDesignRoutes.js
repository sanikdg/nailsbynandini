import express from 'express';
import { saveDesign, getSavedDesigns, removeSavedDesign } from '../controllers/savedDesignController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, saveDesign)
  .get(protect, getSavedDesigns);

router.route('/:id')
  .delete(protect, removeSavedDesign);

export default router;
