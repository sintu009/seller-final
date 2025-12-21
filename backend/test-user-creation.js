require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/user.model');
const Product = require('./models/product.model');
const Order = require('./models/order.model');

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

const testUserCreation = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Centraldb';
    console.log('Connecting to:', mongoUri);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    console.log('Database:', mongoose.connection.name);
    
    // Check existing data
    const existingUsers = await User.find({});
    const existingProducts = await Product.find({});
    const existingOrders = await Order.find({});
    
    console.log('\n=== EXISTING DATA ===');
    console.log('Users:', existingUsers.length);
    console.log('Products:', existingProducts.length);
    console.log('Orders:', existingOrders.length);
    
    existingUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - KYC: ${user.kycStatus}`);
    });
    
    // Fix KYC status for existing users
    console.log('\n=== FIXING KYC STATUS ===');
    const usersToUpdate = await User.find({ kycStatus: { $ne: 'approved' } });
    for (const user of usersToUpdate) {
      user.kycStatus = 'approved';
      await user.save();
      console.log(`Updated KYC status for ${user.name} (${user.role}) to approved`);
    }
    
    existingProducts.forEach(product => {
      console.log(`- ${product.name} - Status: ${product.approvalStatus} - Stock: ${product.stock}`);
    });
    
    existingOrders.forEach(order => {
      console.log(`- ${order.orderNumber} - Status: ${order.status} - Qty: ${order.quantity}`);
    });
    
    // Find or create required users
    let supplier = await User.findOne({ role: 'supplier' });
    let seller = await User.findOne({ role: 'seller' });
    let admin = await User.findOne({ role: 'admin' });
    
    if (!supplier) {
      console.log('\nCreating test supplier...');
      supplier = await User.create({
        name: 'Test Supplier',
        email: 'supplier@test.com',
        password: 'password123',
        role: 'supplier',
        kycStatus: 'approved'
      });
      console.log('Supplier created:', supplier._id);
    }
    
    if (!seller) {
      console.log('\nCreating test seller...');
      seller = await User.create({
        name: 'Test Seller',
        email: 'seller@test.com',
        password: 'password123',
        role: 'seller',
        kycStatus: 'approved'
      });
      console.log('Seller created:', seller._id);
    }
    
    if (!admin) {
      console.log('\nCreating test admin...');
      admin = await User.create({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
        kycStatus: 'approved'
      });
      console.log('Admin created:', admin._id);
    }
    
    // Find or create test product
    let product = await Product.findOne({ approvalStatus: 'approved' });
    if (!product) {
      console.log('\nCreating test product...');
      product = await Product.create({
        name: 'Test Product for Orders',
        description: 'A test product to create orders',
        price: 1000,
        finalPrice: 1200,
        margin: 200,
        stock: 50,
        category: 'Electronics',
        supplier: supplier._id,
        approvalStatus: 'approved',
        images: []
      });
      console.log('Product created:', product._id);
    }
    
    // Create test orders if none exist
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('\nCreating test orders...');
      
      const testOrders = [
        {
          orderNumber: generateOrderNumber(),
          product: product._id,
          supplier: supplier._id,
          seller: seller._id,
          quantity: 2,
          totalPrice: 2400,
          status: 'admin_review',
          shippingAddress: {
            street: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            country: 'India'
          },
          notes: 'Test order pending admin review'
        },
        {
          orderNumber: generateOrderNumber(),
          product: product._id,
          supplier: supplier._id,
          seller: seller._id,
          quantity: 1,
          totalPrice: 1200,
          status: 'pushed',
          shippingAddress: {
            street: '456 Another Street',
            city: 'Another City',
            state: 'Another State',
            zipCode: '67890',
            country: 'India'
          },
          notes: 'Test order that was approved',
          adminReview: {
            reviewedBy: admin._id,
            reviewedAt: new Date(),
            action: 'approved',
            notes: 'Approved for testing'
          }
        }
      ];
      
      for (const orderData of testOrders) {
        const order = await Order.create(orderData);
        console.log(`Created order: ${order.orderNumber} - Status: ${order.status}`);
      }
    }
    
    // Final verification
    const finalUsers = await User.find({});
    const finalProducts = await Product.find({});
    const finalOrders = await Order.find({}).populate('product seller supplier', 'name email');
    
    console.log('\n=== FINAL STATE ===');
    console.log('Total users:', finalUsers.length);
    console.log('Total products:', finalProducts.length);
    console.log('Total orders:', finalOrders.length);
    
    console.log('\nUsers with KYC status:');
    finalUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - KYC: ${user.kycStatus}`);
    });
    
    console.log('\nOrders details:');
    finalOrders.forEach(order => {
      console.log(`- ${order.orderNumber}: ${order.status}`);
      console.log(`  Product: ${order.product?.name}`);
      console.log(`  Seller: ${order.seller?.name}`);
      console.log(`  Supplier: ${order.supplier?.name}`);
      console.log(`  Amount: ₹${order.totalPrice}`);
    });
    
    console.log('\n✅ Test completed successfully!');
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('Admin: admin@test.com / password123 (or sintugupta108@gmail.com)');
    console.log('Seller: seller@test.com / password123 (or seller@gmail.com)');
    console.log('Supplier: supplier@test.com / password123 (or supplier@gmail.com)');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

testUserCreation();
