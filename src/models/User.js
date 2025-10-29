import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'vmd', 'cad', 'commercial', 'mmc'], 
    required: true 
  },
  department: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

export default mongoose.models.User || mongoose.model('User', userSchema);