import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

export const createConversation = async (req, res) => {
  try {
    const { participantId, designId, inquiryId, appointmentId } = req.body;
    
    // In our nail salon, all clients talk to an admin.
    const admin = await User.findOne({ isAdmin: true });
    
    if (!admin) {
      return res.status(500).json({ message: 'No admin configured to chat with' });
    }

    // Check if conversation already exists
    let conversation;
    if (appointmentId) {
       conversation = await Conversation.findOne({ appointmentId, participants: { $in: [req.user._id] } });
    } else if (inquiryId) {
       conversation = await Conversation.findOne({ inquiryId, participants: { $in: [req.user._id] } });
    } else if (designId) {
       conversation = await Conversation.findOne({ designId, participants: { $in: [req.user._id] } });
    } else {
       // Find direct chat
       conversation = await Conversation.findOne({
          participants: { $all: [req.user._id, participantId || admin._id] },
          designId: { $exists: false },
          inquiryId: { $exists: false },
          appointmentId: { $exists: false }
       });
    }

    if (conversation) {
      await conversation.populate('participants', 'name email isAdmin');
      await conversation.populate('designId', 'title image price category');
      await conversation.populate('inquiryId', 'description status image preferredDate');
      return res.status(200).json(conversation);
    }

    // Create new conversation
    const newConversation = await Conversation.create({
      participants: [req.user._id, participantId || admin._id],
      designId,
      inquiryId,
      appointmentId
    });

    await newConversation.populate('participants', 'name email isAdmin');
    await newConversation.populate('designId', 'title image price category');
    await newConversation.populate('inquiryId', 'description status image preferredDate');

    res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] }
    })
    .populate('participants', 'name email isAdmin')
    .populate('designId', 'title image price category')
    .populate('inquiryId', 'description status image preferredDate')
    .populate('appointmentId', 'date time service status proposedDate proposedTime')
    .sort({ lastMessageAt: -1, createdAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'name email isAdmin')
      .populate('designId', 'title image price category')
      .populate('inquiryId', 'description status image preferredDate')
      .populate('appointmentId', 'date time service status proposedDate proposedTime');

    if (!conversation) {
       return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Auth check
    if (!conversation.participants.some(p => p._id.toString() === req.user._id.toString()) && !req.user.isAdmin) {
       return res.status(403).json({ message: 'Not authorized for this conversation' });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
