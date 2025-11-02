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
    consumptionWidth: String
  },

  // Commercial Fields
  commercialFields: {
    requiredQty: String,
    fabricInStock: Boolean,
    orderPlacedDate: Date,
    fabricReceivedDate: Date,

    beforeWashTrims: {
      inStock: Boolean,
      orderPlacedDate: Date,
      receivedDate: Date
    },
    afterWashTrims: {
      inStock: Boolean,
      orderPlacedDate: Date,
      receivedDate: Date
    },
    embellishments: {
      inStock: Boolean,
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
    trimInStock: String,
    orderPlaced: String,
    orderPlacedDate: String,
    trimReceivedDate: String,
    materialSentDate: String,
    materialReceivedDate: String
  },

  // CAD Subprocesses
  cadSubprocesses: {
    sewing: { type: String, default: "pending" },
    stitching: { type: String, default: "pending" },
    cutting: { type: String, default: "pending" },
    finishing: { type: String, default: "pending" }
  },
  
  // Images (optional)
  images: [String],
  
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