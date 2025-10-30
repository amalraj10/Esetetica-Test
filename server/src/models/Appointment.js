import mongoose from 'mongoose';

const appointmentItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true, required: true },
    items: [appointmentItemSchema],
    serviceTotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0.18 },
    taxAmount: { type: Number, required: true },
    finalTotal: { type: Number, required: true },
    invoiceNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model('Appointment', appointmentSchema);
