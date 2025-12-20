import React, { useState, useEffect } from 'react';
import { Plus, Search, ListFilter as Filter, ShoppingCart, Package, Eye, X } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');
  const [ordering, setOrdering] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const categories = ['all', 'Electronics', 'Accessories', 'Office', 'Gaming', 'Mobile', 'Home', 'Fashion', 'Health'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setOrderQuantity(1);
    setOrderNotes('');
    setShowOrderModal(true);
  };

  const handleCreateOrder = async () => {
    if (!selectedProduct) return;

    if (orderQuantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (orderQuantity > selectedProduct.stock) {
      toast.error(`Only ${selectedProduct.stock} units available in stock`);
      return;
    }

    try {
      setOrdering(true);
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct._id,
          quantity: orderQuantity,
          notes: orderNotes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Order created successfully!');
        setShowOrderModal(false);
        setSelectedProduct(null);
        setOrderQuantity(1);
        setOrderNotes('');
      } else {
        toast.error(data.message || 'Failed to create order');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const productStats = {
    total: products.length,
    available: products.filter(p => p.stock > 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
    outOfStock: products.filter(p => p.stock === 0).length
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Products</h1>
          <p className="text-gray-600 mt-1">Discover products from suppliers and place orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Products</div>
          <div className="text-2xl font-bold text-gray-900">{productStats.total}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Available</div>
          <div className="text-2xl font-bold text-green-600">{productStats.available}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Low Stock</div>
          <div className="text-2xl font-bold text-yellow-600">{productStats.lowStock}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">{productStats.outOfStock}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

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
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`${API_URL}/${product.images[0]}`}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${product.stock > 10 ? 'bg-green-100 text-green-800' :
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm text-gray-500 line-through">₹{product.price.toLocaleString()}</div>
                      <div className="text-2xl font-bold text-green-600">
                        ₹{product.finalPrice ? product.finalPrice.toLocaleString() : product.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {product.category}
                    </div>
                  </div>
                  {product.margin > 0 && (
                    <div className="text-xs text-gray-500 mb-1">
                      (Includes ₹{product.margin.toLocaleString()} platform fee)
                    </div>
                  )}
                  <div className="text-xs text-gray-600">
                    Supplier: {product.supplier?.businessName || product.supplier?.name || 'Unknown'}
                  </div>
                </div>

                <button
                  onClick={() => handleOrderClick(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${product.stock > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.stock > 0 ? 'Order Now' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 text-lg mb-2">No products found</div>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {showOrderModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Create Order</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start space-x-4">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <img
                    src={`${API_URL}/${selectedProduct.images[0]}`}
                    alt={selectedProduct.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">{selectedProduct.name}</h4>
                  <p className="text-gray-600 text-sm mb-2">{selectedProduct.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold text-green-600">
                      ₹{selectedProduct.finalPrice ? selectedProduct.finalPrice.toLocaleString() : selectedProduct.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">{selectedProduct.stock} available</span>
                  </div>
                  {selectedProduct.margin > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Base: ₹{selectedProduct.price.toLocaleString()} + Platform Fee: ₹{selectedProduct.margin.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.stock}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Add any special instructions or notes..."
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Unit Price:</span>
                  <span className="font-semibold">
                    ₹{(selectedProduct.finalPrice || selectedProduct.price).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold">{orderQuantity}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{((selectedProduct.finalPrice || selectedProduct.price) * orderQuantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrder}
                  disabled={ordering}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {ordering ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Place Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
