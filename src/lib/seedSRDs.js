export const seedSRDs = [
  {
    refNo: "SRD-001",
    title: "Fall Collection Sample",
    description: "A sample for the upcoming fall collection.",
    createdBy: {
      id: "vmd@demo.com",
      name: "VMD Manager",
      role: "vmd"
    },
    status: {
      vmd: 'approved',
      cad: 'in-progress',
      commercial: 'pending',
      mmc: 'pending'
    }
  },
  {
    refNo: "SRD-002",
    title: "Winter Collection Sample",
    description: "A sample for the upcoming winter collection.",
    createdBy: {
      id: "vmd@demo.com",
      name: "VMD Manager",
      role: "vmd"
    },
    status: {
      vmd: 'approved',
      cad: 'approved',
      commercial: 'in-progress',
      mmc: 'pending'
    }
  }
];