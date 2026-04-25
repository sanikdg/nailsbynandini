import express from 'express';
import { getDesigns, createDesign, updateDesign, deleteDesign, ensureDesign } from '../controllers/designController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/adminMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route to get all designs
router.route('/')
  .get(getDesigns)
  .post(protect, checkAdmin, upload.single('image'), createDesign);

// Authenticated users can find-or-create a design (for wishlist flow)
router.post('/ensure', protect, ensureDesign);

router.route('/:id')
  .put(protect, checkAdmin, upload.single('image'), updateDesign)
  .delete(protect, checkAdmin, deleteDesign);

export default router;
