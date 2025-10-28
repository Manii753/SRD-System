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
  
  status: {
    vmd: { type: String, enum: ['pending', 'in-progress', 'flagged', 'approved'], default: 'pending' },
    cad: { type: String, enum: ['pending', 'in-progress', 'flagged', 'approved'], default: 'pending' },
    commercial: { type: String, enum: ['pending', 'in-progress', 'flagged', 'approved'], default: 'pending' },
    mmc: { type: String, enum: ['pending', 'in-progress', 'flagged', 'approved'], default: 'pending' }
  },
  
  // VMD Fields
  vmdFields: {
    priority: String,
    deadline: Date,
    materialType: String,
    quantity: Number,
    specifications: String
  },
  
  // CAD Fields
  cadFields: {
    consumption: Number,
    rollNumber: String,
    shrinkage: Number,
    width: Number,
    beltTracing: String,
    consumptionWidth: Number,
    cadFile: String,
    patternNumber: String
  },
  
  // Commercial Fields
  commercialFields: {
    supplier: String,
    cost: Number,
    leadTime: Number,
    availability: String,
    quotation: String
  },
  
  // MMC Fields
  mmcFields: {
    machineRequirements: String,
    productionTime: Number,
    qualityCheck: String,
    packaging: String,
    shipping: String
  },
  
  // CAD Subprocesses
  cadSubprocesses: {
    sewing: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending' },
    stitching: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending' },
    cutting: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending' },
    finishing: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending' }
  },
  
  comments: [commentSchema],
  audit: [auditSchema]
});

// Calculate progress before saving
srdSchema.pre('save', function(next) {
  const approvedCount = Object.values(this.status).filter(status => status === 'approved').length;
  this.progress = Math.round((approvedCount / 4) * 100);
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.SRD || mongoose.model('SRD', srdSchema);