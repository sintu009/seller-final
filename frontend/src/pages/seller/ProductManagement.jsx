import React, { useState } from "react";
import {
  Plus,
  Search,
  ListFilter as Filter,
  Send,
  Package,
  Eye,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetSellerProductsQuery,
  useCreateOrderMutation,
} from "../../store/slices/apiSlice";

import ProductImage from "../../components/ProductImage.jsx";

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPushModal, setShowPushModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStore, setSelectedStore] = useState([]);
  const [customPrice, setCustomPrice] = useState("");
  const [pushQuantity, setPushQuantity] = useState(1);
  const [pushNotes, setPushNotes] = useState("");
  const [viewProduct, setViewProduct] = useState(null);

  const { data: productsData, isLoading: loading } =
    useGetSellerProductsQuery();
  const [createOrder, { isLoading: pushing }] = useCreateOrderMutation();
  const products =
    productsData?.data?.filter((p) => p.approvalStatus === "approved") || [];

  const categories = [
    "all",
    "Electronics",
    "Accessories",
    "Office",
    "Gaming",
    "Mobile",
    "Home",
    "Fashion",
    "Health",
  ];

  const handlePushClick = (product) => {
    setSelectedProduct(product);
    setSelectedStore([]);
    setCustomPrice(product.finalPrice || product.price);
    setPushQuantity(1);
    setPushNotes("");
    setShowPushModal(true);
  };

  const handleStoreToggle = (store) => {
    setSelectedStore(prev => 
      prev.includes(store) 
        ? prev.filter(s => s !== store)
        : [...prev, store]
    );
  };

  const handlePushToStore = async () => {
    if (!selectedProduct || selectedStore.length === 0) {
      toast.error("Please select at least one store");
      return;
    }

    if (pushQuantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (pushQuantity > selectedProduct.stock) {
      toast.error(`Only ${selectedProduct.stock} units available in stock`);
      return;
    }

    if (!customPrice || customPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      const promises = selectedStore.map(store => 
        createOrder({
          productId: selectedProduct._id,
          quantity: pushQuantity,
          notes: pushNotes,
          targetStore: store,
          customPrice: parseFloat(customPrice),
          requiresApproval: customPrice !== (selectedProduct.finalPrice || selectedProduct.price)
        }).unwrap()
      );

      await Promise.all(promises);
      
      const priceChanged = customPrice !== (selectedProduct.finalPrice || selectedProduct.price);
      const message = priceChanged 
        ? `Product pushed to ${selectedStore.length} store(s) with custom price. Awaiting admin approval!`
        : `Product pushed to ${selectedStore.length} store(s) successfully!`;
      
      toast.success(message);
      setShowPushModal(false);
      setSelectedProduct(null);
      setSelectedStore([]);
      setCustomPrice("");
      setPushQuantity(1);
      setPushNotes("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to push product");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const productStats = {
    total: products.length,
    available: products.filter((p) => p.stock > 0).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock < 10).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Products</h1>
          <p className="text-gray-600 mt-1">
            Discover products from suppliers and place orders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Products</div>
          <div className="text-2xl font-bold text-gray-900">
            {productStats.total}
          </div>
        </div>
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Available</div>
          <div className="text-2xl font-bold text-green-600">
            {productStats.available}
          </div>
        </div>
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Low Stock</div>
          <div className="text-2xl font-bold text-yellow-600">
            {productStats.lowStock}
          </div>
        </div>
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">
            {productStats.outOfStock}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
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
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative">
                {/* top-left checkbox */}
                <label className="absolute left-3 top-3 z-20">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-200 bg-white shadow-sm"
                  />
                </label>

                {/* image */}
                <div className="w-full h-64 bg-gray-100 overflow-hidden">
                  <ProductImage
                    blobName={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* top-right badge */}
                <div className="absolute right-3 top-3 z-20">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 text-xs text-gray-700 border border-gray-100">
                    <span className="mr-2 text-sm">ⓘ</span>
                    <span>Not Synced</span>
                  </div>
                </div>

                {/* stock pill (bottom-left over image) */}
                <div
                  className={`absolute left-3 bottom-3 px-3 py-1 rounded-full text-xs font-semibold ${product.stock > 10
                    ? "bg-green-100 text-green-800"
                    : product.stock > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                    }`}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-md font-bold text-green-600">
                      ₹{(product.finalPrice || product.price).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{product.category}</div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setViewProduct(product)}
                      className="flex items-center px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 bg-white hover:shadow-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </button>

                    <button
                      onClick={() => handlePushClick(product)}
                      disabled={product.stock === 0}
                      className={`flex items-center px-3 py-2 rounded-md text-sm text-white ${product.stock > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Push
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-md shadow-sm border border-gray-100">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 text-lg mb-2">No products found</div>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {showPushModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Push Product to Store
                </h3>
                <button
                  onClick={() => setShowPushModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start space-x-4">
                <ProductImage
                  blobName={selectedProduct.images?.[0]}
                  alt={selectedProduct.name}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    {selectedProduct.description}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold text-green-600">
                      ₹
                      {selectedProduct.finalPrice
                        ? selectedProduct.finalPrice.toLocaleString()
                        : selectedProduct.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedProduct.stock} available
                    </span>
                  </div>
                  {/* {selectedProduct.margin > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Base: ₹{selectedProduct.price.toLocaleString()} + Platform
                      Fee: ₹{selectedProduct.margin.toLocaleString()}
                    </div>
                  )} */}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Stores * (You can select multiple)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "amazon", label: "Amazon" },
                    { value: "flipkart", label: "Flipkart" },
                    { value: "meesho", label: "Meesho" },
                    { value: "shopify", label: "Shopify" },
                    { value: "myntra", label: "Myntra" },
                    { value: "ajio", label: "Ajio" }
                  ].map((store) => (
                    <label key={store.value} className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedStore.includes(store.value)}
                        onChange={() => handleStoreToggle(store.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{store.label}</span>
                    </label>
                  ))}
                </div>
                {selectedStore.length > 0 && (
                  <div className="mt-2 text-sm text-blue-600">
                    Selected: {selectedStore.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Price * (₹)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter custom price"
                  />
                </div>
                {customPrice && customPrice !== (selectedProduct.finalPrice || selectedProduct.price) && (
                  <div className="mt-1 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                    ⚠️ Price change requires admin approval
                  </div>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  Original price: ₹{(selectedProduct.finalPrice || selectedProduct.price).toLocaleString()}
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
                  value={pushQuantity}
                  onChange={(e) =>
                    setPushQuantity(parseInt(e.target.value) || 1)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={pushNotes}
                  onChange={(e) => setPushNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Add any special instructions or notes..."
                />
              </div>

              <div className="bg-gray-50 rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Unit Price:</span>
                  <span className="font-semibold">
                    ₹{parseFloat(customPrice || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold">{pushQuantity}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Amount:
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{(parseFloat(customPrice || 0) * pushQuantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowPushModal(false)}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePushToStore}
                  disabled={pushing || selectedStore.length === 0}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {pushing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Pushing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Push to {selectedStore.length} Store{selectedStore.length !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
                <button
                  onClick={() => setViewProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-4">
                    <ProductImage
                      blobName={viewProduct.images?.[0]}
                      alt={viewProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {viewProduct.images?.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {viewProduct.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                          <ProductImage
                            blobName={image}
                            alt={`${viewProduct.name} ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{viewProduct.name}</h1>
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-3xl font-bold text-green-600">
                        ₹{(viewProduct.finalPrice || viewProduct.price).toLocaleString()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${viewProduct.stock > 10 ? 'bg-green-100 text-green-800' :
                          viewProduct.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {viewProduct.stock > 0 ? `${viewProduct.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{viewProduct.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="text-sm text-gray-600 mb-1">Category</div>
                      <div className="font-semibold text-gray-900">{viewProduct.category}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="text-sm text-gray-600 mb-1">GST</div>
                      <div className="font-semibold text-gray-900">{viewProduct.gstPercentage}%</div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setViewProduct(null);
                        handlePushClick(viewProduct);
                      }}
                      disabled={viewProduct.stock === 0}
                      className={`flex-1 flex items-center justify-center px-6 py-3 rounded-md text-white font-semibold ${viewProduct.stock > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Push to Admin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
