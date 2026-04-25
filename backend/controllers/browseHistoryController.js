import BrowseHistory from '../models/BrowseHistory.js';

// @desc    Add design to browse history
// @route   POST /api/browse-history
// @access  Private
export const addToBrowseHistory = async (req, res) => {
  try {
    const { designId } = req.body;

    if (!designId) {
      return res.status(400).json({ message: 'designId is required' });
    }

    // Check if already exists
    const exists = await BrowseHistory.findOne({
      userId: req.user._id,
      designId,
    });

    if (exists) {
      // Update timestamp to mark as recently viewed
      exists.updatedAt = new Date();
      await exists.save();
      return res.json(exists);
    }

    // Create new browse history entry
    const history = await BrowseHistory.create({
      userId: req.user._id,
      designId,
    });

    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's browse history
// @route   GET /api/browse-history
// @access  Private
export const getBrowseHistory = async (req, res) => {
  try {
    const history = await BrowseHistory.find({ userId: req.user._id })
      .populate('designId')
      .sort({ updatedAt: -1 })
      .limit(20);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear browse history
// @route   DELETE /api/browse-history
// @access  Private
export const clearBrowseHistory = async (req, res) => {
  try {
    await BrowseHistory.deleteMany({ userId: req.user._id });
    res.json({ message: 'Browse history cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
