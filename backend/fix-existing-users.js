const mongoose = require('mongoose');
const User = require('./models/user.model');
require('dotenv').config();

const fixExistingUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/drop-central');
    console.log('Connected to MongoDB');

    // Find all users with old data structure
    const users = await User.find({
      role: { $in: ['seller', 'supplier'] },
      $or: [
        { businessName: { $exists: true } },
        { gstNumber: { $exists: true } },
        { panNumber: { $exists: true } },
        { phoneNumber: { $exists: true } }
      ]
    });

    console.log(`Found ${users.length} users to update`);

    for (const user of users) {
      const updates = {};
      
      // Move phone data
      if (user.phoneNumber && !user.phone) {
        updates.phone = user.phoneNumber;
        updates.$unset = { phoneNumber: 1 };
      }

      // Move business data to kycDocuments
      if (user.businessName || user.gstNumber || user.panNumber) {
        updates.kycDocuments = {
          ...user.kycDocuments,
          businessName: user.businessName || user.kycDocuments?.businessName,
          taxId: user.gstNumber || user.kycDocuments?.taxId,
          businessRegistration: user.panNumber || user.kycDocuments?.businessRegistration
        };
        
        if (!updates.$unset) updates.$unset = {};
        updates.$unset.businessName = 1;
        updates.$unset.gstNumber = 1;
        updates.$unset.panNumber = 1;
      }

      if (Object.keys(updates).length > 0) {
        await User.updateOne({ _id: user._id }, updates);
        console.log(`Updated user: ${user.email}`);
      }
    }

    console.log('Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

fixExistingUsers();