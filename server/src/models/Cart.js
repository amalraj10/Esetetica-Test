import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true, required: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model('Cart', cartSchema);
