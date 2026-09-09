import Notification from '../models/notification.model.js';

/**
 * Helper function to create an in-app notification
 */
export const createNotification = async ({ recipient, type, title, message, link }) => {
  try {
    if (!recipient) return null;
    return await Notification.create({
      recipient,
      type: type || 'ORDER_STATUS',
      title,
      message,
      link: link || '',
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
};

/**
 * @route   GET /api/notifications
 * @desc    Get user's notifications and unread count
 * @access  Private
 */
export const getNotifications = async (req, res, next) => {
  try {
    const recipient = req.user._id;

    const notifications = await Notification.find({ recipient })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({ recipient, isRead: false });

    res.status(200).json({
      unreadCount,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a single notification as read
 * @access  Private
 */
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all user notifications as read
 * @access  Private
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
