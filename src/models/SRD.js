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
  inProduction: { type: Boolean, default: false },
  
  
  status: {
    vmd: { type: String, enum: ['pending', 'in-progress', 'flagged', 'approved'], default: 'pending' },
    cad: { type: String, enum: ['pending', 'in-progress', 'flagged', 'approved'], default: 'pending' },
    commercial: { type: String, enum: ['pending', 'in-progress', 'flagged', 'approved'], default: 'pending' },
    mmc: { type: String, enum: ['pending', 'in-progress', 'flagged', 'approved'], default: 'pending' }
  },
  
  // VMD Fields
  vmdFields: {
    sampleRequestDate: String,
    sampleTargetDispatchDate: String,
    sampleType: String,
    refNo: String,
    buyer: String,
    buyerStyleRef: String,
    fit: String,
    washColor: String,
    washComments: String,
    sampleRequestSize: String,
    sampleRequestQty: Number,
    costingRequired: String,
    garmentConstruction: String,
    flyDetails: String,
    flyOpeningLength: String,
    loopLengthQty: String,
    loopFusing: String,
    wbFusing: String,
    yokeAttachment: String,
    backRiseAttachment: String,
    inseamAttachment: String,
    fabricCode: String,
    fabricType: String,
    color: String,
    fabricSupplier: String,
    secondaryFabric: String,
    fabricAvailability: String,
    addOns: String,
    beforeWashTrims: {
      topThread: String,
      bottomThread: String,
      bustedThread: String,
      embThread: String,
      trimAvailability: String,
      addOns: String
    },
    afterWashTrims: {
      puPatch: String,
      mainButton: String,
      mainButtonColor: String,
      flyButton: String,
      flyButtonColor: String,
      rivet: String,
      rivetColor: String,
      trimAvailability: String,
      overrider: String,
      addOns: String
    },
    embellishments: {
      requiredPrints: String,
      printArea: String,
      printColor: String,
      printArtwork: String,
      printAddOns: String,
      requiredEmbroidery: String,
      embroideryArea: String,
      embroideryColor: String,
      embroideryArtwork: String,
      embroideryAddOns: String
    }
  },

  // CAD Fields
  cadFields: {
    consumption: String,
    rollNo: String,
    shrinkage: String,
    width: String,
    beltTracing: String,
    consumption: String,
    Width: String
  },

  // Commercial Fields
  commercialFields: {
    requiredQty: String,
    fabricInStock: { type: Boolean, default: false },
    orderPlacedDate: Date,
    fabricReceivedDate: Date,

    beforeWashTrims: {
      inStock: { type: Boolean, default: false },
      orderPlacedDate: Date,
      receivedDate: Date
    },
    afterWashTrims: {
      inStock: { type: Boolean, default: false },
      orderPlacedDate: Date,
      receivedDate: Date
    },
    embellishments: {
      inStock: { type: Boolean, default: false },
      orderPlacedDate: Date,
      receivedDate: Date
    },

    additionalComments: String,
    actualDispatchDate: String,
    sampleDispatchDate: String,
    numberOfSamples: String,
    samplesCheckedBy: String,
    awbNumber: String
  },

  // MMC Fields
  mmcFields: {
    trimInStock: { type: Boolean, default: false },
    orderPlaced: { type: Boolean, default: false },
    orderPlacedDate: Date,
    trimReceivedDate: Date,
    materialSentDate: Date,
    materialReceivedDate: Date
  },
  
  // Images (optional)
  images: [String],

  // Dynamic fields (new non-breaking addition)
  // Each entry stores a snapshot of the field definition plus the value used for this SRD.
  // This allows field definitions to change or be deleted without losing SRD data.
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
  const approvedCount = Object.values(this.status).filter(s => s === 'approved').length;
  this.progress = Math.round((approvedCount / 4) * 100);

  // ✅ Ready for production only if all 4 are approved
  this.readyForProduction = approvedCount === 4;

  this.updatedAt = new Date();
  next();
});


export default mongoose.models.SRD || mongoose.model('SRD', srdSchema);