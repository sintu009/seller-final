const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: 0,
    default: 0
  },
  images: [{
    type: String
  }],
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  },
  isNotifiedToSellers: {
    type: Boolean,
    default: false
  },
  notifiedAt: {
    type: Date
  },
  specifications: {
    type: Map,
    of: String
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  weight: {
    type: Number
  },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  }
}, {
  timestamps: true
});

productSchema.index({ supplier: 1, createdAt: -1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
