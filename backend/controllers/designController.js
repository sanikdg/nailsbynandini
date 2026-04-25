import Design from '../models/Design.js';
import { deleteUploadedFile } from '../middleware/uploadMiddleware.js';

// @desc    Fetch all designs
// @route   GET /api/designs
// @access  Public
export const getDesigns = async (req, res) => {
  try {
    const designs = await Design.find({});
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a design
// @route   POST /api/designs
// @access  Private/Admin
export const createDesign = async (req, res) => {
  try {
    const { title, image, category, price } = req.body;
    
    const design = new Design({
      title,
      image: req.file ? `/uploads/${req.file.filename}` : image,
      category,
      price,
    });

    const createdDesign = await design.save();
    res.status(201).json(createdDesign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a design
// @route   PUT /api/designs/:id
// @access  Private/Admin
export const updateDesign = async (req, res) => {
  try {
    const { title, image, category, price } = req.body;

    const design = await Design.findById(req.params.id);

    if (design) {
      design.title = title || design.title;
      design.category = category || design.category;
      design.price = price || design.price;

      if (req.file) {
        // Delete old uploaded image if it was a local file
        deleteUploadedFile(design.image);
        design.image = `/uploads/${req.file.filename}`;
      } else if (image) {
        design.image = image;
      }

      const updatedDesign = await design.save();
      res.json(updatedDesign);
    } else {
      res.status(404).json({ message: 'Design not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a design
// @route   DELETE /api/designs/:id
// @access  Private/Admin
export const deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (design) {
      // Delete uploaded image file
      deleteUploadedFile(design.image);
      await design.deleteOne();
      res.json({ message: 'Design removed' });
    } else {
      res.status(404).json({ message: 'Design not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Find or create a design (for wishlist save flow)
// @route   POST /api/designs/ensure
// @access  Private (any logged-in user)
export const ensureDesign = async (req, res) => {
  try {
    const { title, image, category, price } = req.body;

    // Try to find existing design by title
    let design = await Design.findOne({ title });

    if (!design) {
      // Create it so it can be referenced by saved-designs
      design = await Design.create({
        title,
        image: image || '/sanu/hand5.jpeg',
        category: category || 'Misc',
        price: price || 0,
      });
    }

    res.status(200).json(design);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
