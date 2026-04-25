import ContactMessage from '../models/ContactMessage.js';
import { createNotification } from './notificationController.js';

// @desc    Create a new contact message
// @route   POST /api/contact-messages
// @access  Public
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
    });

    const createdMessage = await contactMessage.save();

    // Create notification for admin
    await createNotification({
      type: 'new_contact_message',
      title: 'New Contact Message',
      message: `${name} sent a message: "${message.substring(0, 80)}${message.length > 80 ? '...' : ''}"`,
      relatedId: createdMessage._id,
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: createdMessage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact messages (admin only)
// @route   GET /api/contact-messages
// @access  Private/Admin
export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contact message status (admin only)
// @route   PUT /api/contact-messages/:id
// @access  Private/Admin
export const updateContactMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['New', 'Read', 'Replied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete contact message (admin only)
// @route   DELETE /api/contact-messages/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({ message: 'Contact message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
