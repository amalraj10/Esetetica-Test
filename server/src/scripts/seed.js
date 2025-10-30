import dotenv from 'dotenv';
import { connectDB } from '../lib/db.js';
import { Product } from '../models/Product.js';

dotenv.config();

async function main() {
  await connectDB();
  const sample = [
    { name: 'Trillion Protein Transfusion', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop', category: 'Massage Therapy', price: 500 },
    { name: 'TIRTIR Mask Fit Red Cushion', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=300&fit=crop', category: 'Manicure & Pedicure', price: 3000 },
    { name: 'Kay Beauty Hydrating Foundation', image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=300&h=300&fit=crop', category: 'Hair Cut Wash & Style', price: 1200 },
    { name: 'Suroskie My Glow All-In-One', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop', category: 'Hair Cut Wash & Style', price: 800 },
    { name: "L'Oreal Professionnel Pro Longer", image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop', category: 'Hair Cut Wash & Style', price: 1500 },
    { name: "L'Oreal Professionnel Hair Spa", image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&h=300&fit=crop', category: 'Massage Therapy', price: 2000 },
  ];
  await Product.deleteMany({});
  const inserted = await Product.insertMany(sample);
  console.log(`Seeded products: ${inserted.length}`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
