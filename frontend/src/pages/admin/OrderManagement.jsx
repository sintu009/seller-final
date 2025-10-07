import React, { useState, useEffect } from 'react';
import { Search, ListFilter as Filter, Download, Package, CircleCheck as CheckCircle, Clock, Circle as XCircle, Eye, X } from 'lucide-react';
import { toast } from 'react-toastify';

const OrderManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const statuses = ['all', 'pending', 'supplier_processing', 'seller_processing', 'admin_review', 'admin_approved', 'admin_rejected', 'completed', 'cancelled'];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/orders`, {
                credentials: 'include',
            });
            const data = await response.json();

            if (data.success) {
                setOrders(data.data);
            } else {
                toast.error('Failed to fetch orders');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (orderId) => {
        try {
            setActionLoading(true);
            const response = await fetch(`${API_URL}/api/orders/${orderId}/approve`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Order approved successfully!');
                fetchOrders();
                setShowDetailModal(false);
            } else {
                toast.error(data.message || 'Failed to approve order');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (orderId) => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        try {
            setActionLoading(true);
            const response = await fetch(`${API_URL}/api/orders/${orderId}/reject`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason: rejectionReason }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Order rejected');
                fetchOrders();
                setShowRejectModal(false);
                setShowDetailModal(false);
                setRejectionReason('');
            } else {
                toast.error(data.message || 'Failed to reject order');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const openDetailModal = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const openRejectModal = (order) => {
        setSelectedOrder(order);
        setShowRejectModal(true);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            supplier_processing: 'bg-blue-100 text-blue-800',
            seller_processing: 'bg-purple-100 text-purple-800',
            admin_review: 'bg-orange-100 text-orange-800',
            admin_approved: 'bg-green-100 text-green-800',
            admin_rejected: 'bg-red-100 text-red-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        if (status === 'admin_approved' || status === 'completed') return <CheckCircle className="w-4 h-4" />;
        if (status === 'admin_rejected' || status === 'cancelled') return <XCircle className="w-4 h-4" />;
        return <Clock className="w-4 h-4" />;
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const orderStats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        adminReview: orders.filter(o => o.status === 'admin_review').length,
        approved: orders.filter(o => o.status === 'admin_approved').length,
        rejected: orders.filter(o => o.status === 'admin_rejected').length,
        totalRevenue: orders.filter(o => o.status === 'admin_approved' || o.status === 'completed').reduce((sum, order) => sum + order.totalAmount, 0)
    };

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-600 mt-1">Review and manage all orders</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Orders</div>
                    <div className="text-2xl font-bold text-gray-900">{orderStats.total}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Pending</div>
                    <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Admin Review</div>
                    <div className="text-2xl font-bold text-orange-600">{orderStats.adminReview}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Approved</div>
                    <div className="text-2xl font-bold text-green-600">{orderStats.approved}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Rejected</div>
                    <div className="text-2xl font-bold text-red-600">{orderStats.rejected}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Revenue</div>
                    <div className="text-2xl font-bold text-orange-600">₹{orderStats.totalRevenue.toLocaleString()}</div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        {statuses.filter(s => s !== 'all').map(status => (
                            <option key={status} value={status}>
                                {status.replace('_', ' ').toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Order ID</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Product</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Seller</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Supplier</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Quantity</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-mono text-sm font-medium text-orange-600">
                                                #{order._id.slice(-8)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900">{order.product?.name || 'N/A'}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-gray-900">{order.seller?.name || 'N/A'}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-600">{order.supplier?.name || 'N/A'}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-gray-900">{order.quantity}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="ml-2">{order.status.replace('_', ' ').toUpperCase()}</span>
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => openDetailModal(order)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {(order.status === 'admin_review' || order.status === 'pending') && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(order._id)}
                                                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                                        >
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => openRejectModal(order)}
                                                            className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                                        >
                                                            <XCircle className="w-3 h-3 mr-1" />
                                                            Reject
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

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <div className="text-gray-500 text-lg mb-2">No orders found</div>
                            <p className="text-gray-400">Try adjusting your search filters</p>
                        </div>
                    )}
                </div>
            )}

            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-mono font-medium">#{selectedOrder._id.slice(-8)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Product</p>
                                    <p className="font-medium">{selectedOrder.product?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Quantity</p>
                                    <p className="font-medium">{selectedOrder.quantity}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Unit Price</p>
                                    <p className="font-medium">₹{selectedOrder.product?.price?.toLocaleString() || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="font-bold text-green-600">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Seller</p>
                                    <p className="font-medium">{selectedOrder.seller?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Supplier</p>
                                    <p className="font-medium">{selectedOrder.supplier?.name || 'N/A'}</p>
                                </div>
                            </div>

                            {selectedOrder.notes && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Order Notes</p>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                                </div>
                            )}

                            {(selectedOrder.status === 'admin_review' || selectedOrder.status === 'pending') && (
                                <div className="flex space-x-3 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => handleApprove(selectedOrder._id)}
                                        disabled={actionLoading}
                                        className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {actionLoading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Approve Order
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDetailModal(false);
                                            openRejectModal(selectedOrder);
                                        }}
                                        disabled={actionLoading}
                                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                                    >
                                        <XCircle className="w-5 h-5 mr-2" />
                                        Reject Order
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showRejectModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Reject Order</h3>
                                <button onClick={() => setShowRejectModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <p className="text-gray-600">Please provide a reason for rejecting this order:</p>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                rows={4}
                                placeholder="Enter rejection reason..."
                            />

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReject(selectedOrder._id)}
                                    disabled={actionLoading}
                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                                    ) : (
                                        'Reject Order'
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

export default OrderManagement;
