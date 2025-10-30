import { Router } from 'express';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';

const router = Router();

router.get('/', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const cart = await Cart.findOne({ userId }).populate('items.product');
  res.json(cart || { userId, items: [] });
});

router.post('/sync', async (req, res) => {
  const { userId, items } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const normalized = [];
  for (const it of items || []) {
    const prod = await Product.findById(it.productId);
    if (prod && it.quantity > 0) normalized.push({ product: prod._id, quantity: it.quantity });
  }
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { userId, items: normalized },
    { new: true, upsert: true }
  ).populate('items.product');
  res.json(cart);
});

export default router;
