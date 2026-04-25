import Settings from '../models/Settings.js';

// @desc    Get site settings (public)
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings exist, create with defaults
    if (!settings) {
      settings = await Settings.create({});
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update site settings (admin)
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    const {
      salonName,
      tagline,
      email,
      phone,
      whatsapp,
      address,
      businessHours,
      socialLinks,
      aboutText,
    } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({});
    }

    if (salonName !== undefined) settings.salonName = salonName;
    if (tagline !== undefined) settings.tagline = tagline;
    if (email !== undefined) settings.email = email;
    if (phone !== undefined) settings.phone = phone;
    if (whatsapp !== undefined) settings.whatsapp = whatsapp;
    if (businessHours !== undefined) settings.businessHours = businessHours;
    if (aboutText !== undefined) settings.aboutText = aboutText;

    if (address) {
      settings.address = {
        street: address.street !== undefined ? address.street : settings.address.street,
        city: address.city !== undefined ? address.city : settings.address.city,
        state: address.state !== undefined ? address.state : settings.address.state,
        zip: address.zip !== undefined ? address.zip : settings.address.zip,
      };
    }

    if (socialLinks) {
      settings.socialLinks = {
        instagram: socialLinks.instagram !== undefined ? socialLinks.instagram : settings.socialLinks.instagram,
        facebook: socialLinks.facebook !== undefined ? socialLinks.facebook : settings.socialLinks.facebook,
        youtube: socialLinks.youtube !== undefined ? socialLinks.youtube : settings.socialLinks.youtube,
        tiktok: socialLinks.tiktok !== undefined ? socialLinks.tiktok : settings.socialLinks.tiktok,
      };
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
