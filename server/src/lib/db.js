import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
  }
  await mongoose.connect(uri, { dbName: 'cart_flow_appointments' });
  console.log('MongoDB connected');
}
