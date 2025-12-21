const mongoose = require('mongoose');
const Order = require('./models/order.model');
const Product = require('./models/product.model');
const User = require('./models/user.model');

const createTestOrders = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');
    console.log('Connected to MongoDB');

    // Find a supplier, seller, and product
    const supplier = await User.findOne({ role: 'supplier' });
    const seller = await User.findOne({ role: 'seller' });
    const product = await Product.findOne({ status: 'approved' });

    if (!supplier || !seller || !product) {
      console.log('Missing required data:');
      console.log('Supplier:', supplier ? 'Found' : 'Not found');
      console.log('Seller:', seller ? 'Found' : 'Not found');
      console.log('Product:', product ? 'Found' : 'Not found');
      return;
    }

    // Create test orders
    const testOrders = [
      {
        orderNumber: `ORD-TEST-${Date.now()}-1`,
        product: product._id,
        supplier: supplier._id,
        seller: seller._id,
        quantity: 2,
        totalPrice: (product.finalPrice || product.price) * 2,
        status: 'admin_review',
        shippingAddress: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '123456',
          country: 'India'
        },
        notes: 'Test order for admin approval'
      },
      {
        orderNumber: `ORD-TEST-${Date.now()}-2`,
        product: product._id,
        supplier: supplier._id,
        seller: seller._id,
        quantity: 1,
        totalPrice: product.finalPrice || product.price,
        status: 'admin_review',
        shippingAddress: {
          street: '456 Test Avenue',
          city: 'Test City 2',
          state: 'Test State 2',
          zipCode: '654321',
          country: 'India'
        },
        notes: 'Another test order for admin approval'
      }
    ];

    const createdOrders = await Order.insertMany(testOrders);
    console.log(`Created ${createdOrders.length} test orders:`);
    createdOrders.forEach(order => {
      console.log(`- ${order.orderNumber} (${order.status})`);
    });

    console.log('Test orders created successfully!');
  } catch (error) {
    console.error('Error creating test orders:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  createTestOrders();
}

module.exports = createTestOrders;