require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/user.model');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Centraldb')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Update all users to have approved KYC
    const result = await User.updateMany(
      { kycStatus: { $ne: 'approved' } },
      { $set: { kycStatus: 'approved' } }
    );
    
    console.log(`Updated ${result.modifiedCount} users to approved KYC status`);
    
    // Show all users
    const users = await User.find({}, 'name email role kycStatus');
    console.log('\nAll users:');
    users.forEach(u => console.log(`- ${u.name} (${u.email}) - ${u.role} - KYC: ${u.kycStatus}`));
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
