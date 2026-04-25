import Testimonial from '../models/Testimonial.js';

// @desc    Get active testimonials (public)
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all testimonials (admin)
// @route   GET /api/testimonials/all
// @access  Private/Admin
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = async (req, res) => {
  try {
    const { name, role, text, rating, isActive, order } = req.body;

    const testimonial = new Testimonial({
      name,
      role: role || 'Client',
      text,
      rating: rating || 5,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });

    const createdTestimonial = await testimonial.save();
    res.status(201).json(createdTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req, res) => {
  try {
    const { name, role, text, rating, isActive, order } = req.body;

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    testimonial.name = name || testimonial.name;
    testimonial.role = role !== undefined ? role : testimonial.role;
    testimonial.text = text || testimonial.text;
    testimonial.rating = rating !== undefined ? rating : testimonial.rating;
    testimonial.isActive = isActive !== undefined ? isActive : testimonial.isActive;
    testimonial.order = order !== undefined ? order : testimonial.order;

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await testimonial.deleteOne();
    res.json({ message: 'Testimonial removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Submit a customer review
// @route   POST /api/testimonials/submit-review
// @access  Private
export const submitCustomerReview = async (req, res) => {
  try {
    console.log('=== REVIEW SUBMISSION START ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    
    const { text, rating } = req.body;
    
    // Check if user is authenticated
    if (!req.user) {
      console.log('User not authenticated');
      return res.status(401).json({ message: 'Not authenticated. Please log in.' });
    }

    const { name } = req.user;
    console.log('User name:', name);

    if (!text || !rating) {
      console.log('Missing text or rating');
      return res.status(400).json({ message: 'Review text and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      console.log('Invalid rating:', rating);
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const testimonial = new Testimonial({
      name,
      role: 'Customer',
      text,
      rating,
      isActive: false, // Requires admin approval
      order: 0,
    });

    console.log('Testimonial object created:', testimonial);
    const createdTestimonial = await testimonial.save();
    console.log('Testimonial saved:', createdTestimonial);
    console.log('=== REVIEW SUBMISSION SUCCESS ===');
    
    res.status(201).json({ 
      message: 'Review submitted successfully! It will be displayed after admin approval.',
      testimonial: createdTestimonial 
    });
  } catch (error) {
    console.error('=== ERROR SUBMITTING REVIEW ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(400).json({ message: error.message || 'Failed to submit review' });
  }
};
