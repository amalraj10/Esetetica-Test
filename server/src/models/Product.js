import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    category: { type: String, index: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
