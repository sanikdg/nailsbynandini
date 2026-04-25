import express from 'express';
import { getOffers, getAllOffers, createOffer, updateOffer, deleteOffer } from '../controllers/offerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getOffers)
  .post(protect, checkAdmin, createOffer);

// Admin-only: get ALL offers including expired
router.get('/all', protect, checkAdmin, getAllOffers);

router.route('/:id')
  .put(protect, checkAdmin, updateOffer)
  .delete(protect, checkAdmin, deleteOffer);

export default router;
