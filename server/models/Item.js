import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // URL to image
  location: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Available', 'Claimed'], default: 'Available' }
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
