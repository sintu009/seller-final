const Product = require('../models/product.model');
const User = require('../models/user.model');

const createProduct = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const user = await User.findById(supplierId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'supplier') {
      return res.status(403).json({
        success: false,
        message: 'Only suppliers can create products'
      });
    }

    if (user.kycStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your KYC must be approved before you can add products'
      });
    }

    const images = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : [];

    const productData = {
      ...req.body,
      supplier: supplierId,
      images: images
    };

    const product = await Product.create(productData);
    await product.populate('supplier', 'name email');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getSupplierProducts = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const { status, search } = req.query;

    const filter = { supplier: supplierId };
    if (status) filter.status = status;
    if (search) {
      filter.$text = { $search: search };
    }

    const products = await Product.find(filter)
      .populate('supplier', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProductsForSellers = async (req, res) => {
  try {
    const { category, search, notified } = req.query;

    const filter = {
      status: 'active',
      approvalStatus: 'approved',
      adminApproved: true
    };
    if (category) filter.category = category;
    if (search) {
      filter.$text = { $search: search };
    }
    if (notified !== undefined) {
      filter.isNotifiedToSellers = notified === 'true';
    }

    const products = await Product.find(filter)
      .populate('supplier', 'name email phoneNumber businessName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('supplier', 'name email phone address');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.supplier.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    Object.assign(product, req.body);
    await product.save();
    await product.populate('supplier', 'name email');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.supplier.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const notifyProductToSellers = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.supplier.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to notify this product'
      });
    }

    product.isNotifiedToSellers = true;
    product.notifiedAt = new Date();
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product notified to sellers successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { status, category, supplier, approvalStatus } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (supplier) filter.supplier = supplier;
    if (approvalStatus) filter.approvalStatus = approvalStatus;

    const products = await Product.find(filter)
      .populate('supplier', 'name email businessName phoneNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { margin } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can approve products'
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!margin || margin < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid margin amount'
      });
    }

    product.approvalStatus = 'approved';
    product.adminApproved = true;
    product.approvedBy = req.user.id;
    product.approvedAt = new Date();
    product.margin = parseFloat(margin);
    product.finalPrice = parseFloat(product.price) + parseFloat(margin);

    await product.save();
    await product.populate('supplier', 'name email businessName phoneNumber');

    res.status(200).json({
      success: true,
      message: 'Product approved successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can reject products'
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rejection reason'
      });
    }

    product.approvalStatus = 'rejected';
    product.adminApproved = false;
    product.rejectionReason = reason;
    product.approvedBy = req.user.id;
    product.approvedAt = new Date();

    await product.save();
    await product.populate('supplier', 'name email businessName phoneNumber');

    res.status(200).json({
      success: true,
      message: 'Product rejected successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createProduct,
  getSupplierProducts,
  getProductsForSellers,
  getProductById,
  updateProduct,
  deleteProduct,
  notifyProductToSellers,
  getAllProducts,
  approveProduct,
  rejectProduct
};
