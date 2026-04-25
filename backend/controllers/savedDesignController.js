import SavedDesign from '../models/SavedDesign.js';

export const saveDesign = async (req, res) => {
  try {
    const { designId } = req.body;

    const exists = await SavedDesign.findOne({ userId: req.user._id, designId });
    if (exists) {
      return res.status(400).json({ message: 'Design already saved' });
    }

    const saved = await SavedDesign.create({
      userId: req.user._id,
      designId
    });

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedDesigns = async (req, res) => {
  try {
    const saved = await SavedDesign.find({ userId: req.user._id }).populate('designId');
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSavedDesign = async (req, res) => {
  try {
    const saved = await SavedDesign.findOneAndDelete({ userId: req.user._id, designId: req.params.id });
    if (!saved) {
      return res.status(404).json({ message: 'Saved design not found' });
    }
    res.status(200).json({ message: 'Saved design removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
