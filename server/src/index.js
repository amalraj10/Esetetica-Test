import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import appointmentsRouter from './routes/appointments.js';

dotenv.config();
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/appointments', appointmentsRouter);

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
