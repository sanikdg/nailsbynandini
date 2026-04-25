import mongoose from 'mongoose';

const settingsSchema = mongoose.Schema(
  {
    salonName: {
      type: String,
      default: 'Nails by Nandini',
    },
    tagline: {
      type: String,
      default: 'Premium Nail Artistry',
    },
    email: {
      type: String,
      default: 'hello@nailsbynandini.com',
    },
    phone: {
      type: String,
      default: '(555) 123-4567',
    },
    whatsapp: {
      type: String,
      default: '15551234567',
    },
    address: {
      street: { type: String, default: '123 Beauty Boulevard, Suite 4A' },
      city: { type: String, default: 'Los Angeles' },
      state: { type: String, default: 'CA' },
      zip: { type: String, default: '90015' },
    },
    businessHours: {
      type: String,
      default: 'Monday – Sunday, 11:00 AM – 9:00 PM',
    },
    socialLinks: {
      instagram: { type: String, default: 'https://www.instagram.com/' },
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    aboutText: {
      type: String,
      default: 'Premium nail artistry crafted with passion and precision. Every stroke tells a story, every design is a masterpiece tailored just for you.',
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
