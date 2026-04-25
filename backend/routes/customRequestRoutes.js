import express from 'express';
import {
  createCustomRequest,
  getMyRequests,
  getAllCustomRequests,
  updateRequestStatus,
} from '../controllers/customRequestController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Customer: get own requests (must be before /:id)
router.get('/my-requests', protect, getMyRequests);

// Admin: get all requests
router.get('/', protect, checkAdmin, getAllCustomRequests);

// Customer: create a request
router.post('/', protect, createCustomRequest);

// Admin: update request status
router.put('/:id', protect, checkAdmin, updateRequestStatus);

export default router;
