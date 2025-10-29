Use the existing SRD system project in which this CLI is running.  
Do not rebuild the project — only update and extend the existing SRD model, forms, and department logic as described below.  
Make sure all updates follow the same structure, Shadcn UI, and JavaScript-only code style.

---

### 🔧 TASK: Add Missing Department Fields + Logic

Update the SRD model, forms, and API handling for the following departments exactly as described.

---

### 🧩 1. VMD Department
Add the following object structure inside the SRD schema under `vmdFields`:

```js
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
}
cadFields: {
  consumption: String,
  rollNo: String,
  shrinkage: String,
  width: String,
  beltTracing: String,
  consumptionWidth: String
},
cadSubprocesses: {
  sewing: { type: String, default: "pending" },
  stitching: { type: String, default: "pending" },
  cutting: { type: String, default: "pending" },
  finishing: { type: String, default: "pending" }
}
Each subprocess must have a toggle or dropdown for status (pending, in-progress, done),
and when all are done, CAD automatically updates status to approved.

💰 3. Commercial Department

Add these fields to the SRD schema under commercialFields:

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
}

Logic:

fabricInStock, and each inStock under trims & embellishments must be a boolean toggle in the UI.

If true → mark as available, no further inputs shown.

If false → automatically show input fields for:

orderPlacedDate

receivedDate

The department manager will fill these dates after contacting the supplier.

Once receivedDate is set, the status should update to “received”.

🧵 4. MMC Department

Add this structure:

mmcFields: {
  trimInStock: String,
  orderPlaced: String,
  orderPlacedDate: String,
  trimReceivedDate: String,
  materialSentDate: String,
  materialReceivedDate: String
}

🚨 5. Shared Logic & API Behavior

Each department form (VMD, CAD, Commercial, MMC) should show only its own fields.

When a department flags an SRD, require a mandatory comment field (reason).

Save the comment inside comments[] and emit Pusher event srd:flag.

/api/srd/[id]/department/:dept endpoint should handle updates to only that department’s fields.

/api/srd/[id]/flag should handle flag reason saving and status change.

🎨 UI Integration (Shadcn)

Use Shadcn components for all new toggles, inputs, and modals.

Use dynamic rendering: if a field depends on a boolean (like inStock), conditionally render date inputs.

Add toasts for success/error updates.

Keep using JavaScript — no TypeScript.