const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

const createOrder = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { productId, quantity, shippingAddress, notes } = req.body;

    const seller = await User.findById(sellerId);
    if (seller.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Only sellers can create orders'
      });
    }

    // Temporarily disable KYC check for testing
    // if (seller.kycStatus !== 'approved') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Your KYC must be approved before you can place orders'
    //   });
    // }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      });
    }

    const totalPrice = (product.finalPrice || product.price) * quantity;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      product: productId,
      supplier: product.supplier,
      seller: sellerId,
      quantity,
      totalPrice,
      shippingAddress,
      notes,
      status: 'admin_review'
    });

    product.stock -= quantity;
    if (product.stock === 0) {
      product.status = 'out_of_stock';
    }
    await product.save();

    await order.populate([
      { path: 'product', select: 'name price images' },
      { path: 'supplier', select: 'name email phone' },
      { path: 'seller', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created and sent for admin review',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getOrdersForAdmin = async (req, res) => {
  try {
    console.log('=== Admin Orders Request ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Request method:', req.method);
    console.log('User from middleware:', req.user);
    console.log('Headers:', req.headers);
    
    if (!req.user) {
      console.log('No user found in request - authentication failed');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated - please login'
      });
    }
    
    console.log('User role:', req.user.role);
    console.log('User ID:', req.user.id);
    console.log('User email:', req.user.email);
    
    if (req.user.role !== 'admin') {
      console.log('User is not admin:', req.user.role);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
        userRole: req.user.role
      });
    }
    
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    console.log('Order filter:', filter);
    
    // Check total order count first
    const totalOrders = await Order.countDocuments();
    console.log('Total orders in database:', totalOrders);
    
    const orders = await Order.find(filter)
      .populate('product', 'name price images')
      .populate('supplier', 'name email phone')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    console.log('Found orders after population:', orders.length);
    console.log('Sample order:', orders[0] ? {
      id: orders[0]._id,
      orderNumber: orders[0].orderNumber,
      status: orders[0].status
    } : 'No orders found');
    
    res.status(200).json({
      success: true,
      data: orders,
      totalCount: totalOrders,
      message: `Found ${orders.length} orders`
    });
  } catch (error) {
    console.error('=== Error in getOrdersForAdmin ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
      error: 'Internal server error'
    });
  }
};

const getOrdersForSupplier = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const { status } = req.query;

    const filter = { supplier: supplierId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('product', 'name price images')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getOrdersForSeller = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { status } = req.query;

    const filter = { seller: sellerId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('product', 'name price images')
      .populate('supplier', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product')
      .populate('supplier', 'name email phone address')
      .populate('seller', 'name email phone address')
      .populate('adminReview.reviewedBy', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    const isAuthorized =
      userRole === 'admin' ||
      order.supplier.toString() === userId ||
      order.seller.toString() === userId;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const adminApproveOrder = async (req, res) => {
  try {
    const { notes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = 'pushed';
    order.adminReview = {
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
      action: 'approved',
      notes
    };

    await order.save();
    await order.populate([
      { path: 'product', select: 'name price' },
      { path: 'supplier', select: 'name email' },
      { path: 'seller', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Order approved successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const adminRejectOrder = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rejection notes'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const product = await Product.findById(order.product);
    if (product) {
      product.stock += order.quantity;
      if (product.stock > 0) {
        product.status = 'active';
      }
      await product.save();
    }

    order.status = 'admin_rejected';
    order.adminReview = {
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
      action: 'rejected',
      notes
    };

    await order.save();
    await order.populate([
      { path: 'product', select: 'name price' },
      { path: 'supplier', select: 'name email' },
      { path: 'seller', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Order rejected successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === 'supplier' && order.supplier.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    if (userRole === 'seller' && order.seller.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.status = status;
    if (notes) {
      order.notes = notes;
    }

    await order.save();
    await order.populate([
      { path: 'product', select: 'name price' },
      { path: 'supplier', select: 'name email' },
      { path: 'seller', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getOrderStatusHistory = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .select('statusHistory orderNumber')
      .populate('statusHistory.updatedBy', 'name email role');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        statusHistory: order.statusHistory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrdersForAdmin,
  getOrdersForSupplier,
  getOrdersForSeller,
  getOrderById,
  adminApproveOrder,
  adminRejectOrder,
  updateOrderStatus,
  getOrderStatusHistory
};
