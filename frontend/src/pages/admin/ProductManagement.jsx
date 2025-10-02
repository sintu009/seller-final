import React, { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    CheckCircle,
    XCircle,
    Clock,
    Edit3,
    Eye,
    Package,
    Building,
    Tag,
    DollarSign
} from 'lucide-react';

const ProductManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Mock products data
    const products = [
        {
            id: 1,
            name: 'Wireless Bluetooth Headphones Pro Max',
            category: 'Electronics',
            supplier: 'Kumar Electronics Manufacturing',
            basePrice: 1800,
            suggestedPrice: 2999,
            hsnCode: '85183000',
            gstRate: 18,
            shippingCharges: 60,
            stockQuantity: 150,
            status: 'Pending Approval',
            submittedDate: '2024-01-15',
            image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            description: 'Premium wireless headphones with noise cancellation and 30-hour battery life'
        },
        {
            id: 2,
            name: 'Ergonomic Laptop Stand Premium',
            category: 'Office',
            supplier: 'Premium Accessories Ltd',
            basePrice: 899,
            suggestedPrice: 1499,
            hsnCode: '94036000',
            gstRate: 18,
            shippingCharges: 60,
            stockQuantity: 75,
            status: 'Approved',
            submittedDate: '2024-01-10',
            approvedDate: '2024-01-12',
            image: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            description: 'Adjustable aluminum laptop stand for better ergonomics and cooling'
        },
        {
            id: 3,
            name: 'Premium Phone Case with Screen Guard',
            category: 'Accessories',
            supplier: 'Mobile Accessories Co',
            basePrice: 299,
            suggestedPrice: 599,
            hsnCode: '39269099',
            gstRate: 18,
            shippingCharges: 60,
            stockQuantity: 200,
            status: 'Rejected',
            submittedDate: '2024-01-08',
            rejectedDate: '2024-01-09',
            rejectionReason: 'Product images quality is not sufficient. Please upload high-resolution images showing all product features.',
            image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            description: 'Durable phone case with built-in screen protector and shock absorption'
        },
        {
            id: 4,
            name: 'Bluetooth Speaker Waterproof',
            category: 'Electronics',
            supplier: 'Kumar Electronics Manufacturing',
            basePrice: 2100,
            suggestedPrice: 3499,
            hsnCode: '85183000',
            gstRate: 18,
            shippingCharges: 60,
            stockQuantity: 45,
            status: 'Approved',
            submittedDate: '2024-01-05',
            approvedDate: '2024-01-07',
            image: 'https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            description: 'Portable waterproof Bluetooth speaker with 360-degree sound'
        },
        {
            id: 5,
            name: 'Smart Fitness Tracker Watch',
            category: 'Health',
            supplier: 'Health Tech Solutions',
            basePrice: 3200,
            suggestedPrice: 4999,
            hsnCode: '90291000',
            gstRate: 18,
            shippingCharges: 60,
            stockQuantity: 30,
            status: 'Pending Approval',
            submittedDate: '2024-01-16',
            image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            description: 'Advanced fitness tracker with heart rate monitoring and GPS'
        }
    ];

    const categories = ['all', 'Electronics', 'Office', 'Accessories', 'Health', 'Gaming'];
    const statuses = ['all', 'Pending Approval', 'Approved', 'Rejected'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
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

    const handleApprove = (productId) => {
        console.log('Approving product:', productId);
    };

    const handleReject = (productId) => {
        console.log('Rejecting product:', productId);
    };

    const handleEdit = (productId) => {
        console.log('Editing product:', productId);
    };

    const productStats = {
        total: products.length,
        approved: products.filter(p => p.status === 'Approved').length,
        pending: products.filter(p => p.status === 'Pending Approval').length,
        rejected: products.filter(p => p.status === 'Rejected').length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-600 mt-1">Review and manage supplier product submissions</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Export Products
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Products</div>
                    <div className="text-2xl font-bold text-gray-900">{productStats.total}</div>
                    <div className="text-xs text-gray-500 mt-1">All submissions</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Approved Products</div>
                    <div className="text-2xl font-bold text-green-600">{productStats.approved}</div>
                    <div className="text-xs text-gray-500 mt-1">Live for sellers</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Pending Approval</div>
                    <div className="text-2xl font-bold text-yellow-600">{productStats.pending}</div>
                    <div className="text-xs text-gray-500 mt-1">Awaiting review</div>
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
                            placeholder="Search products by name or supplier..."
                            className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Supplier</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Pricing</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">HSN & GST</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Stock</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover mr-4"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <Building className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="text-gray-900">{product.supplier}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm">
                                            <div className="flex items-center text-gray-900">
                                                <Tag className="w-4 h-4 mr-1 text-gray-400" />
                                                Base: ₹{product.basePrice}
                                            </div>
                                            <div className="flex items-center text-green-600 font-semibold">
                                                <DollarSign className="w-4 h-4 mr-1" />
                                                Suggested: ₹{product.suggestedPrice}
                                            </div>
                                        </div>
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
                                        <div className="text-sm text-gray-600">
                                            <div>Submitted: {product.submittedDate}</div>
                                            {product.approvedDate && (
                                                <div className="text-green-600">Approved: {product.approvedDate}</div>
                                            )}
                                            {product.rejectedDate && (
                                                <div className="text-red-600">Rejected: {product.rejectedDate}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(product.id)}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            {product.status === 'Pending Approval' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(product.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(product.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
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

            {/* Pagination */}
            {filteredProducts.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="text-gray-600">
                            Showing {filteredProducts.length} of {products.length} products
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                                Previous
                            </button>
                            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                                1
                            </button>
                            <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                                2
                            </button>
                            <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;