import Offer from '../models/Offer.js';

// @desc    Fetch active offers (public)
// @route   GET /api/offers
// @access  Public
export const getOffers = async (req, res) => {
  try {
    // Return all offers created by admin
    const offers = await Offer.find({}).sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch ALL offers including expired (admin)
// @route   GET /api/offers/all
// @access  Private/Admin
export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find({}).sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new offer
// @route   POST /api/offers
// @access  Private/Admin
export const createOffer = async (req, res) => {
  try {
    const { title, description, discount, expiry, code } = req.body;

    const offer = new Offer({
      title,
      description,
      discount,
      expiry,
      code: code || '',
    });

    const createdOffer = await offer.save();
    res.status(201).json(createdOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
export const updateOffer = async (req, res) => {
  try {
    const { title, description, discount, expiry, code } = req.body;

    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    offer.title = title || offer.title;
    offer.description = description !== undefined ? description : offer.description;
    offer.discount = discount !== undefined ? discount : offer.discount;
    offer.expiry = expiry || offer.expiry;
    offer.code = code !== undefined ? code : offer.code;

    const updatedOffer = await offer.save();
    res.json(updatedOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    await offer.deleteOne();
    res.json({ message: 'Offer removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
