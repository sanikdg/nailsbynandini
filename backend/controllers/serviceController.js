import Service from '../models/Service.js';

// @desc    Get active services (public)
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all services (admin)
// @route   GET /api/services/all
// @access  Private/Admin
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({}).sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    const { title, description, image, duration, price, category, isActive, order } = req.body;

    const service = new Service({
      title,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : (image || ''),
      duration: duration || 60,
      price,
      category: category || 'General',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req, res) => {
  try {
    const { title, description, image, duration, price, category, isActive, order } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.title = title || service.title;
    service.description = description !== undefined ? description : service.description;
    service.duration = duration !== undefined ? duration : service.duration;
    service.price = price !== undefined ? price : service.price;
    service.category = category || service.category;
    service.isActive = isActive !== undefined ? isActive : service.isActive;
    service.order = order !== undefined ? order : service.order;

    if (req.file) {
      service.image = `/uploads/${req.file.filename}`;
    } else if (image !== undefined) {
      service.image = image;
    }

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.deleteOne();
    res.json({ message: 'Service removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
