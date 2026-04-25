import express from 'express';
import { getServices, getAllServices, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/adminMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, checkAdmin, upload.single('image'), createService);

router.get('/all', protect, checkAdmin, getAllServices);

router.route('/:id')
  .put(protect, checkAdmin, upload.single('image'), updateService)
  .delete(protect, checkAdmin, deleteService);

export default router;
