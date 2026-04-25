import mongoose from 'mongoose';

const offerSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
    discount: {
      type: Number, // Storing as percentage value or fixed discount easily
      required: true,
      min: 0,
      max: 100,
    },
    code: {
      type: String,
      required: false,
      default: '',
    },
    expiry: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
