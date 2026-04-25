import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const createMessage = async (req, res) => {
  try {
    const { conversationId, text, imageUrl, messageType } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const newMessage = await Message.create({
      conversationId,
      senderId: req.user._id,
      text,
      imageUrl,
      messageType,
      readBy: [req.user._id]
    });

    // Update conversation last message
    conversation.lastMessage = messageType === 'text' ? text : (messageType === 'image' ? 'Sent an image' : 'Sent a link');
    conversation.lastMessageAt = Date.now();
    await conversation.save();

    await newMessage.populate('senderId', 'name email');
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate('senderId', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    await Message.updateMany(
      { conversationId, readBy: { $ne: req.user._id } },
      { $push: { readBy: req.user._id } }
    );
    
    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
