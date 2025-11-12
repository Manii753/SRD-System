import mongoose from 'mongoose';
import SRD from '../models/SRD.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/srd-system';

async function fixSRDStatus() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all SRDs
    const srds = await SRD.find({});
    console.log(`Found ${srds.length} SRDs to check`);

    let fixed = 0;
    const excludedRoles = ['admin', 'production-manager'];

    for (const srd of srds) {
      let needsUpdate = false;

      // Check if status has admin or production-manager
      if (srd.status) {
        for (const role of excludedRoles) {
          if (srd.status.has(role)) {
            srd.status.delete(role);
            needsUpdate = true;
            console.log(`Removed ${role} from SRD ${srd.refNo}`);
          }
        }
      }

      // Save if updated (this will trigger pre-save hook to recalculate)
      if (needsUpdate) {
        await srd.save();
        fixed++;
        console.log(`Fixed SRD ${srd.refNo} - readyForProduction: ${srd.readyForProduction}, progress: ${srd.progress}%`);
      }
    }

    console.log(`\n✅ Fixed ${fixed} SRDs`);
    console.log(`✅ ${srds.length - fixed} SRDs were already correct`);

    // Show ready for production count
    const readyCount = await SRD.countDocuments({ readyForProduction: true, inProduction: false });
    console.log(`\n📊 SRDs ready for production: ${readyCount}`);

  } catch (error) {
    console.error('Error fixing SRD status:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

fixSRDStatus();
