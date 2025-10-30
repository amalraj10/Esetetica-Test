import { Router } from 'express';
import { Appointment } from '../models/Appointment.js';
import { Product } from '../models/Product.js';

const router = Router();

async function calculateTotals({ items = [], serviceTotal = 0, discount = 0 }) {
  const detailed = [];
  let productTotal = 0;
  for (const it of items) {
    const prod = await Product.findById(it.productId);
    if (!prod || it.quantity <= 0) continue;
    const unitPrice = prod.price;
    const total = unitPrice * it.quantity;
    productTotal += total;
    detailed.push({ product: prod._id, quantity: it.quantity, unitPrice, total });
  }
  const taxRate = 0.18;
  const taxAmount = (serviceTotal + productTotal - discount) * taxRate;
  const finalTotal = serviceTotal + productTotal - discount + taxAmount;
  return { detailed, productTotal, taxRate, taxAmount, finalTotal };
}

router.post('/preview', async (req, res) => {
  const { items, serviceTotal = 0, discount = 0 } = req.body;
  const { detailed, productTotal, taxRate, taxAmount, finalTotal } = await calculateTotals({ items, serviceTotal, discount });
  const populated = await Promise.all(
    detailed.map(async (d) => ({
      product: await Product.findById(d.product),
      quantity: d.quantity,
      unitPrice: d.unitPrice,
      total: d.total,
    }))
  );
  res.json({ serviceTotal, productTotal, discount, taxRate, taxAmount, finalTotal, items: populated });
});

router.post('/', async (req, res) => {
  const { userId, items, serviceTotal = 0, discount = 0 } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const { detailed, productTotal, taxRate, taxAmount, finalTotal } = await calculateTotals({ items, serviceTotal, discount });
  const invoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

  const appt = await Appointment.create({
    userId,
    items: detailed,
    serviceTotal,
    discount,
    taxRate,
    taxAmount,
    finalTotal,
    invoiceNumber,
  });

  const populated = await appt.populate('items.product');
  res.json({
    invoiceNumber,
    serviceTotal,
    productTotal,
    discount,
    taxRate,
    taxAmount,
    finalTotal,
    items: populated.items,
    id: populated._id,
  });
});

export default router;
