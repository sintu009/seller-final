require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/database');

console.log('Environment variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);

const authRoutes = require('./routes/auth.routes');
const kycRoutes = require('./routes/kyc.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
const walletRoutes = require('./routes/wallet.routes');
const adminRoutes = require('./routes/admin.routes');
const sellerRoutes = require('./routes/seller.routes');
const supplierRoutes = require('./routes/supplier.routes');

const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/supplier', supplierRoutes);

console.log('All routes registered successfully');
console.log('Admin routes should be available at /api/admin/*');
console.log('Order routes should be available at /api/orders/*');

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test admin route accessibility
app.get('/api/admin-test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Admin test route working',
    timestamp: new Date().toISOString()
  });
});

// Catch-all route for debugging
app.use('/api/*', (req, res) => {
  console.log('Unmatched route:', req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      '/api/health',
      '/api/admin-test', 
      '/api/admin/debug',
      '/api/admin/orders',
      '/api/auth/login'
    ]
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const User = require('./models/user.model');
    const Order = require('./models/order.model');
    const Product = require('./models/product.model');
    
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const productCount = await Product.countDocuments();
    
    const users = await User.find({}, 'name email role kycStatus').limit(5);
    const orders = await Order.find({}).populate('product seller supplier', 'name email').limit(5);
    
    res.json({
      success: true,
      message: 'Database connection working',
      counts: { users: userCount, orders: orderCount, products: productCount },
      sampleData: { users, orders },
      dbState: require('mongoose').connection.readyState
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /api/health');
  console.log('- GET /api/admin-test');
  console.log('- GET /api/admin/debug');
  console.log('- GET /api/admin/test');
  console.log('- GET /api/admin/orders');
  console.log('- POST /api/auth/login');
  console.log('\nTo test admin orders:');
  console.log('1. Login as admin first');
  console.log('2. Then access /api/admin/orders');
});

module.exports = app;
