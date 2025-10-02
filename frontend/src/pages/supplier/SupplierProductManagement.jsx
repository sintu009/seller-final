import React, { useState } from 'react';
import { Plus, Search, Filter, Upload, Edit3, Trash2, Eye, Clock, CheckCircle, XCircle, Image as ImageIcon, Package } from 'lucide-react';

const SupplierProductManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);

    const products = [
        {
            id: 1,
            name: 'Wireless Bluetooth Headphones Pro Max',
            category: 'Electronics',
            basePrice: 1800,
            platformMargin: 20,
            finalCost: 1820,
            hsnCode: '85183000',
            gstRate: 18,
            stockQuantity: 150,
            description: 'Premium wireless headphones with noise cancellation and 30-hour battery life',
            status: 'Approved',
            images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'],
            dateAdded: '2024-01-10',
            approvedDate: '2024-01-12',
            rejectionReason: null
        },
        {
            id: 2,
            name: 'Ergonomic Laptop Stand Premium',
            category: 'Office',
            basePrice: 899,
            platformMargin: 20,
            finalCost: 919,
            hsnCode: '94036000',
            gstRate: 18,
            stockQuantity: 75,
            description: 'Adjustable aluminum laptop stand for better ergonomics and cooling',
            status: 'Pending Approval',
            images: ['https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'],
            dateAdded: '2024-01-14',
            approvedDate: null,
            rejectionReason: null
        },
        {
            id: 3,
            name: 'Premium Phone Case with Screen Guard',
            category: 'Accessories',
            basePrice: 299,
            platformMargin: 20,
            finalCost: 319,
            hsnCode: '39269099',
            gstRate: 18,
            stockQuantity: 200,
            description: 'Durable phone case with built-in screen protector and shock absorption',
            status: 'Rejected',
            images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'],
            dateAdded: '2024-01-08',
            approvedDate: null,
            rejectionReason: 'Product images quality is not sufficient. Please upload high-resolution images.'
        },
        {
            id: 4,
            name: 'Bluetooth Speaker Waterproof',
            category: 'Electronics',
            basePrice: 2100,
            platformMargin: 20,
            finalCost: 2120,
            hsnCode: '85183000',
            gstRate: 18,
            stockQuantity: 45,
            description: 'Portable waterproof Bluetooth speaker with 360-degree sound',
            status: 'Approved',
            images: ['https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'],
            dateAdded: '2024-01-05',
            approvedDate: '2024-01-07',
            rejectionReason: null
        },
        {
            id: 5,
            name: 'Smart Fitness Tracker Watch',
            category: 'Health',
            basePrice: 3200,
            platformMargin: 20,
            finalCost: 3220,
            hsnCode: '90291000',
            gstRate: 18,
            stockQuantity: 30,
            description: 'Advanced fitness tracker with heart rate monitoring and GPS',
            status: 'Pending Approval',
            images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'],
            dateAdded: '2024-01-15',
            approvedDate: null,
            rejectionReason: null
        }
    ];

    const categories = ['all', 'Electronics', 'Office', 'Accessories', 'Health', 'Gaming'];
    const statuses = ['all', 'Approved', 'Pending Approval', 'Rejected'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <CheckCircle className="w-4 h-4" />;
            case 'Pending Approval': return <Clock className="w-4 h-4" />;
            case 'Rejected': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const productStats = {
        total: products.length,
        approved: products.filter(p => p.status === 'Approved').length,
        pending: products.filter(p => p.status === 'Pending Approval').length,
        rejected: products.filter(p => p.status === 'Rejected').length
    };

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-600 mt-1">
                        Manage your product catalog and track approval status
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Bulk Upload
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold flex items-center transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Products</div>
                    <div className="text-2xl font-bold text-gray-900">{productStats.total}</div>
                    <div className="text-xs text-gray-500 mt-1">All categories</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Approved Products</div>
                    <div className="text-2xl font-bold text-green-600">{productStats.approved}</div>
                    <div className="text-xs text-gray-500 mt-1">Live for sellers</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Pending Approval</div>
                    <div className="text-2xl font-bold text-yellow-600">{productStats.pending}</div>
                    <div className="text-xs text-gray-500 mt-1">Under review</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Rejected Products</div>
                    <div className="text-2xl font-bold text-red-600">{productStats.rejected}</div>
                    <div className="text-xs text-gray-500 mt-1">Need revision</div>
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
                            className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category}
                                </option>
                            ))}
                        </select>

                        <select
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'All Status' : status}
                                </option>
                            ))}
                        </select>

                        <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center">
                            <Filter className="w-4 h-4 mr-2" />
                            More Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Product</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Base Price</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">HSN / GST</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Stock</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date Added</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover mr-3"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">{product.description.substring(0, 40)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-semibold text-gray-900">₹{product.basePrice.toLocaleString()}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm">
                                            <div className="text-gray-900 font-mono">{product.hsnCode}</div>
                                            <div className="text-gray-500">GST: {product.gstRate}%</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`font-medium ${product.stockQuantity < 20 ? 'text-red-600' :
                                            product.stockQuantity < 50 ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                            {product.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="space-y-2">
                                            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(product.status)}`}>
                                                {getStatusIcon(product.status)}
                                                <span className="ml-2">{product.status}</span>
                                            </span>
                                            {product.status === 'Rejected' && product.rejectionReason && (
                                                <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg max-w-xs">
                                                    <strong>Reason:</strong> {product.rejectionReason}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm text-gray-600">{product.dateAdded}</div>
                                        {product.approvedDate && (
                                            <div className="text-xs text-green-600">Approved: {product.approvedDate}</div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-500 text-lg mb-2">No products found</div>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Enter product name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                        <option value="">Select Category</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Office">Office</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Health">Health</option>
                                        <option value="Gaming">Gaming</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Base Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        HSN Code *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="85183000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        GST Rate (%) *
                                    </label>
                                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                        <option value="">Select GST</option>
                                        <option value="5">5%</option>
                                        <option value="12">12%</option>
                                        <option value="18">18%</option>
                                        <option value="28">28%</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Images *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">Drag and drop images here, or click to browse</p>
                                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                                        Choose Files
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Supported formats: JPG, PNG (Max 5MB each, up to 5 images)
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Description *
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    rows={4}
                                    placeholder="Enter detailed product description..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors">
                                    Add Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierProductManagement;