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
    },
    audit: [
      {
        action: 'SRD Created',
        department: 'vmd',
        author: 'VMD Manager',
        timestamp: new Date(Date.now() - 86400000 * 2),
        details: {},
      },
      {
        action: 'VMD Status Updated',
        department: 'vmd',
        author: 'VMD Manager',
        timestamp: new Date(Date.now() - 86400000),
        details: { status: 'approved' },
      },
    ],
    comments: [
      {
        department: 'vmd',
        author: 'VMD Manager',
        role: 'vmd',
        text: 'Initial design brief submitted.',
        date: new Date(Date.now() - 86400000 * 1.5),
      },
    ],
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
    },
    audit: [
      {
        action: 'SRD Created',
        department: 'vmd',
        author: 'VMD Manager',
        timestamp: new Date(Date.now() - 86400000 * 5),
        details: {},
      },
      {
        action: 'VMD Status Updated',
        department: 'vmd',
        author: 'VMD Manager',
        timestamp: new Date(Date.now() - 86400000 * 4),
        details: { status: 'approved' },
      },
      {
        action: 'CAD Status Updated',
        department: 'cad',
        author: 'CAD Manager',
        timestamp: new Date(Date.now() - 86400000 * 3),
        details: { status: 'approved' },
      },
    ],
    comments: [
      {
        department: 'vmd',
        author: 'VMD Manager',
        role: 'vmd',
        text: 'Winter collection initial concept.',
        date: new Date(Date.now() - 86400000 * 4.5),
      },
      {
        department: 'cad',
        author: 'CAD Manager',
        role: 'cad',
        text: 'Pattern development complete.',
        date: new Date(Date.now() - 86400000 * 2.5),
      },
    ],
  }
];