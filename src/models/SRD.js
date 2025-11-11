import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  department: String,
  author: String,
  role: String,
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const auditSchema = new mongoose.Schema({
  action: String,
  department: String,
  author: String,
  timestamp: { type: Date, default: Date.now },
  details: Object
});

const srdSchema = new mongoose.Schema({
  refNo: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  
  createdBy: { 
    id: String, 
    name: String, 
    role: String 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  progress: { type: Number, default: 0, min: 0, max: 100 },
  readyForProduction: { type: Boolean, default: false },
  inProduction: { type: Boolean, ault: false },
  
  
  status: {
    type: Map,
    of: {
      type: String,
      enum: ['pending', 'in-progress', 'flagged', 'approved'],
      default: 'pending'
    }
  },

  
  // Images (optional)
  images: [String],

  dynamicFields: [{
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field' },
    department: { type: String },
    name: { type: String },
    slug: { type: String },
    type: { type: String },
    value: { type: mongoose.Schema.Types.Mixed },
    isRequired: { type: Boolean, default: false }
  }],
  
  comments: [commentSchema],
  audit: [auditSchema]
});

// Calculate progress and readyforproduction before saving
srdSchema.pre('save', function (next) {
  if (this.status && this.status.size > 0) {
    const approvedCount = Array.from(this.status.values()).filter(s => s === 'approved').length;
    const totalDepts = this.status.size;
    this.progress = Math.round((approvedCount / totalDepts) * 100);
    this.readyForProduction = approvedCount === totalDepts;
  } else {
    this.progress = 0;
    this.readyForProduction = false;
  }

  this.updatedAt = new Date();
  next();
});


export default mongoose.models.SRD || mongoose.model('SRD', srdSchema);