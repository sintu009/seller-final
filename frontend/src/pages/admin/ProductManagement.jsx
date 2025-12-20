import React, { useState, useEffect } from 'react';
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
    DollarSign,
    X
} from 'lucide-react';
import apiClient from '../../utils/api';

const ProductManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [margin, setMargin] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const statuses = ['all', 'pending', 'approved', 'rejected'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await apiClient.get('/api/admin/products');
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const supplierName = product.supplier?.businessName || product.supplier?.name || '';
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplierName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || product.approvalStatus === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'approved': return 'Approved';
            case 'pending': return 'Pending Approval';
            case 'rejected': return 'Rejected';
            default: return status;
        }
    };

    const handleApprove = (product) => {
        setSelectedProduct(product);
        setMargin('');
        setShowApproveModal(true);
    };

    const handleReject = (product) => {
        setSelectedProduct(product);
        setRejectionReason('');
        setShowRejectModal(true);
    };

    const confirmApprove = async () => {
        if (!margin || parseFloat(margin) < 0) {
            alert('Please enter a valid margin amount');
            return;
        }

        try {
            setActionLoading(true);
            const data = await apiClient.put(`/api/admin/products/${selectedProduct._id}/approve`, {
                margin: parseFloat(margin)
            });

            if (data.success) {
                alert('Product approved successfully!');
                setShowApproveModal(false);
                setMargin('');
                fetchProducts();
            } else {
                alert(data.message || 'Failed to approve product');
            }
        } catch (error) {
            console.error('Error approving product:', error);
            alert('Failed to approve product');
        } finally {
            setActionLoading(false);
        }
    };

    const confirmReject = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        try {
            setActionLoading(true);
            const data = await apiClient.put(`/api/admin/products/${selectedProduct._id}/reject`, {
                reason: rejectionReason
            });

            if (data.success) {
                alert('Product rejected successfully!');
                setShowRejectModal(false);
                setRejectionReason('');
                fetchProducts();
            } else {
                alert(data.message || 'Failed to reject product');
            }
        } catch (error) {
            console.error('Error rejecting product:', error);
            alert('Failed to reject product');
        } finally {
            setActionLoading(false);
        }
    };

    const productStats = {
        total: products.length,
        approved: products.filter(p => p.approvalStatus === 'approved').length,
        pending: products.filter(p => p.approvalStatus === 'pending').length,
        rejected: products.filter(p => p.approvalStatus === 'rejected').length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
                    <div className="text-gray-500 text-lg">Loading products...</div>
                </div>
            </div>
        );
    }

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
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'All Status' : getStatusLabel(status)}
                                </option>
                            ))}
                        </select>
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
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Pricing</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">GST</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Stock</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            {product.images && product.images[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-lg object-cover mr-4"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-gray-200 mr-4 flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <Building className="w-4 h-4 mr-2 text-gray-400" />
                                            <div>
                                                <div className="text-gray-900">{product.supplier?.businessName || product.supplier?.name || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">{product.supplier?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm">
                                            <div className="flex items-center text-gray-900">
                                                <Tag className="w-4 h-4 mr-1 text-gray-400" />
                                                Base: ₹{product.price}
                                            </div>
                                            {product.margin > 0 && (
                                                <>
                                                    <div className="text-orange-600">
                                                        Margin: ₹{product.margin}
                                                    </div>
                                                    <div className="flex items-center text-green-600 font-semibold">
                                                        <DollarSign className="w-4 h-4 mr-1" />
                                                        Final: ₹{product.finalPrice}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm">
                                            <div className="text-gray-500">GST: {product.gstPercentage}%</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`font-medium ${product.stock < 20 ? 'text-red-600' :
                                            product.stock < 50 ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="space-y-2">
                                            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(product.approvalStatus)}`}>
                                                {getStatusIcon(product.approvalStatus)}
                                                <span className="ml-2">{getStatusLabel(product.approvalStatus)}</span>
                                            </span>
                                            {product.approvalStatus === 'rejected' && product.rejectionReason && (
                                                <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg max-w-xs">
                                                    <strong>Reason:</strong> {product.rejectionReason}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm text-gray-600">
                                            <div>Submitted: {new Date(product.createdAt).toLocaleDateString()}</div>
                                            {product.approvedAt && (
                                                <div className="text-green-600">
                                                    {product.approvalStatus === 'approved' ? 'Approved' : 'Rejected'}: {new Date(product.approvedAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            {product.approvalStatus === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(product)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(product)}
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

            {/* Approve Modal */}
            {showApproveModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Approve Product</h3>
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="text-sm text-gray-600 mb-2">Product</div>
                            <div className="font-medium text-gray-900">{selectedProduct.name}</div>
                            <div className="text-sm text-gray-500">Base Price: ₹{selectedProduct.price}</div>
                            <div className="text-sm text-gray-500">GST: {selectedProduct.gstPercentage}%</div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Platform Margin (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={margin}
                                onChange={(e) => setMargin(e.target.value)}
                                placeholder="Enter margin amount in rupees"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            {margin && (
                                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                    <div className="text-sm text-gray-600">Final Price Preview:</div>
                                    <div className="text-2xl font-bold text-green-600">
                                        ₹{(parseFloat(selectedProduct.price) + parseFloat(margin)).toFixed(2)}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmApprove}
                                disabled={actionLoading || !margin}
                                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {actionLoading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Reject Product</h3>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="text-sm text-gray-600 mb-2">Product</div>
                            <div className="font-medium text-gray-900">{selectedProduct.name}</div>
                            <div className="text-sm text-gray-500">Supplier: {selectedProduct.supplier?.businessName || selectedProduct.supplier?.name}</div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rejection Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Please provide a clear reason for rejection..."
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                This will be visible to the supplier
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReject}
                                disabled={actionLoading || !rejectionReason.trim()}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {actionLoading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;