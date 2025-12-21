const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: [
      'pending',
      'supplier_processing',
      'seller_processing',
      'admin_review',
      'pushed',
      'admin_rejected',
      'shipped',
      'delivered',
      'cancelled'
    ],
    default: 'pending'
  },
  adminReview: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    },
    action: {
      type: String,
      enum: ['approved', 'rejected']
    },
    notes: {
      type: String
    }
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String
    }
  }],
  shippingAddress: {
    street: { type: String, default: 'Not provided' },
    city: { type: String, default: 'Not provided' },
    state: { type: String, default: 'Not provided' },
    zipCode: { type: String, default: '000000' },
    country: { type: String, default: 'India' }
  },
  trackingNumber: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ supplier: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.adminReview?.reviewedBy
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
