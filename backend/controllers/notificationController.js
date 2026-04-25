import Notification from '../models/Notification.js';

// @desc    Get notifications (admin)
// @route   GET /api/notifications
// @access  Private/Admin
export const getNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread count (admin)
// @route   GET /api/notifications/unread-count
// @access  Private/Admin
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ isRead: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private/Admin
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private/Admin
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Helper function to create a notification (used internally by other controllers)
export const createNotification = async ({ type, title, message, relatedId }) => {
  try {
    await Notification.create({ type, title, message, relatedId });
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};
