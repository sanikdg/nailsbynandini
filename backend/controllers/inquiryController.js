import Inquiry from '../models/Inquiry.js';
import { createNotification } from './notificationController.js';

// @desc    Create a new inquiry
// @route   POST /api/inquiries
// @access  Private
export const createInquiry = async (req, res) => {
  try {
    const { designId, image, referenceImage, description, preferredDate, clientName, clientEmail } = req.body;

    const inquiry = new Inquiry({
      userId: req.user._id,
      designId,
      image: image || referenceImage,
      description,
      preferredDate: preferredDate || undefined,
    });

    const createdInquiry = await inquiry.save();

    // Create notification for admin
    await createNotification({
      type: 'new_inquiry',
      title: 'New Inquiry Received',
      message: `${req.user.name} submitted a new inquiry: "${description.substring(0, 80)}${description.length > 80 ? '...' : ''}"`,
      relatedId: createdInquiry._id,
    });

    res.status(201).json(createdInquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all inquiries (or user specific)
// @route   GET /api/inquiries
// @access  Private
export const getInquiries = async (req, res) => {
  try {
    // If admin, return all. If user, return only theirs. Look at req.user.isAdmin for future scaling.
    const inquiries = req.user.isAdmin 
      ? await Inquiry.find({}).populate('userId', 'name email') 
      : await Inquiry.find({ userId: req.user._id });
      
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);

    if (inquiry) {
      inquiry.status = status || inquiry.status;
      const updatedInquiry = await inquiry.save();
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
