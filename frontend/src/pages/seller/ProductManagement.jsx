import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Mock product data - 50 products for pagination demo
  const allProducts = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    title: [
      'Wireless Bluetooth Headphones Pro Max',
      'Ergonomic Laptop Stand Premium',
      'Premium Phone Case with Screen Guard',
      'Bluetooth Speaker Waterproof',
      'Smart Fitness Tracker Watch',
      'USB-C Fast Charging Cable',
      'Portable Power Bank 20000mAh',
      'Gaming Mouse RGB Wireless',
      'Mechanical Keyboard Backlit',
      'HD Webcam 1080p with Microphone',
      'Wireless Charging Pad Fast',
      'Bluetooth Earbuds Noise Cancelling',
      'Phone Holder Car Mount',
      'LED Desk Lamp Adjustable',
      'Portable Bluetooth Speaker Mini',
      'Screen Protector Tempered Glass',
      'Wireless Mouse Optical',
      'USB Hub 4 Port 3.0',
      'Phone Case Shockproof Clear',
      'Tablet Stand Adjustable Aluminum'
    ][index % 20],
    description: [
      'High-quality wireless headphones with premium sound',
      'Adjustable laptop stand for better ergonomics',
      'Durable phone case with complete protection',
      'Waterproof speaker with excellent bass',
      'Advanced fitness tracker with heart rate monitor',
      'Fast charging cable with durable build',
      'High capacity power bank for all devices',
      'Professional gaming mouse with RGB lighting',
      'Mechanical keyboard with backlit keys',
      'Crystal clear webcam for video calls',
      'Fast wireless charging for all devices',
      'Premium earbuds with noise cancellation',
      'Secure car mount for safe driving',
      'Adjustable LED lamp for perfect lighting',
      'Compact speaker with powerful sound',
      'Premium tempered glass protection',
      'Smooth wireless mouse for productivity',
      'Multi-port USB hub for connectivity',
      'Clear protective case with shock absorption',
      'Sturdy aluminum stand for tablets'
    ][index % 20],
    price: Math.floor(Math.random() * 5000) + 500,
    category: ['Electronics', 'Accessories', 'Office', 'Gaming', 'Mobile'][index % 5],
    image: `https://images.pexels.com/photos/${[
      '3394650', '7974', '788946', '1841841', '437037',
      '163117', '1038628', '2115256', '1029757', '4158',
      '163117', '3394650', '788946', '7974', '1841841',
      '437037', '2115256', '1029757', '4158', '163117'
    ][index % 20]}/pexels-photo-${[
      '3394650', '7974', '788946', '1841841', '437037',
      '163117', '1038628', '2115256', '1029757', '4158',
      '163117', '3394650', '788946', '7974', '1841841',
      '437037', '2115256', '1029757', '4158', '163117'
    ][index % 20]}.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop`,
    synced: Math.random() > 0.3, // 70% synced, 30% not synced
    platforms: Math.random() > 0.5 ? ['Amazon', 'Flipkart'] : ['Amazon']
  }));

  const categories = ['all', 'Electronics', 'Accessories', 'Office', 'Gaming', 'Mobile'];

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Handle product selection
  const handleProductSelect = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === currentProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentProducts.map(p => p.id));
    }
  };

  const handlePush = (productId) => {
    // Handle push functionality
    console.log('Pushing product:', productId);
  };

  const handleBulkPush = () => {
    if (selectedProducts.length > 0) {
      console.log('Bulk pushing products:', selectedProducts);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">
            Total Products: <span className="font-semibold text-blue-600">{filteredProducts.length}</span>
          </p>
        </div>
        <div className="flex items-center space-x-3">

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold flex items-center transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Connect Amazon
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Products</div>
          <div className="text-2xl font-bold text-gray-900">{allProducts.length}</div>
          <div className="text-xs text-gray-500 mt-1">All categories</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Synced Products</div>
          <div className="text-2xl font-bold text-green-600">
            {allProducts.filter(p => p.synced).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Ready to sell</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Not Synced</div>
          <div className="text-2xl font-bold text-red-600">
            {allProducts.filter(p => !p.synced).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Need sync</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Selected</div>
          <div className="text-2xl font-bold text-blue-600">{selectedProducts.length}</div>
          <div className="text-xs text-gray-500 mt-1">For bulk actions</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or description..."
              className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="text-blue-800">
                <span className="font-semibold">{selectedProducts.length}</span> products selected
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBulkPush}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Push Selected
                </button>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Select All Checkbox */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
            onChange={handleSelectAll}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-3 text-gray-700 font-medium">
            Select All Products on This Page ({currentProducts.length})
          </span>
        </label>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Sync Status Badge */}
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${product.synced
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {product.synced ? 'Synced' : 'Not Synced'}
              </div>
              {/* Checkbox */}
              <div className="absolute top-3 left-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleProductSelect(product.id)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              {/* Product Title */}
              <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h3>

              {/* Product Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* Product Price */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-green-600">
                  ₹{product.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  {product.category}
                </div>
              </div>

              {/* Platforms */}
              <div className="flex flex-wrap gap-1 mb-4">
                {product.platforms.map((platform, idx) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {platform}
                  </span>
                ))}
              </div>

              {/* Push Button */}
              <button
                onClick={() => handlePush(product.id)}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${product.synced
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                  }`}
              >
                {product.synced ? 'Update Product' : 'Push to Platforms'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Products Found */}
      {currentProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-lg mb-2">No products found</div>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;