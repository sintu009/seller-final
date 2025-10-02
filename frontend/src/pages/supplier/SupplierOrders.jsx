import React, { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    Package,
    Truck,
    CheckCircle,
    Clock,
    AlertCircle,
    MapPin,
    User,
    Calendar,
    Edit3
} from 'lucide-react';

const SupplierOrders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedTimeframe, setSelectedTimeframe] = useState('all');

    const orders = [
        {
            id: '#ORD-12345',
            serialNumber: 1,
            seller: {
                name: 'TechStore India',
                email: 'contact@techstore.com',
                phone: '+91 98765 43210'
            },
            product: 'Wireless Bluetooth Headphones Pro',
            quantity: 2,
            amount: 3600, // supplier earning
            status: 'Pending',
            orderDate: '2024-01-15',
            shippingAddress: '123 Linking Road, Bandra West, Mumbai, Maharashtra 400050',
            trackingId: null
        },
        {
            id: '#ORD-12346',
            serialNumber: 2,
            seller: {
                name: 'ElectroMart',
                email: 'orders@electromart.com',
                phone: '+91 98765 43211'
            },
            product: 'Bluetooth Speaker Premium',
            quantity: 1,
            amount: 2100,
            status: 'Processing',
            orderDate: '2024-01-14',
            shippingAddress: '456 Sector 18, Noida, Uttar Pradesh 201301',
            trackingId: null
        },
        {
            id: '#ORD-12347',
            serialNumber: 3,
            seller: {
                name: 'GadgetHub',
                email: 'support@gadgethub.com',
                phone: '+91 98765 43212'
            },
            product: 'Premium Phone Case Set',
            quantity: 5,
            amount: 1495,
            status: 'Shipped',
            orderDate: '2024-01-12',
            shippingAddress: '789 Koregaon Park, Pune, Maharashtra 411001',
            trackingId: 'TRK123456789'
        },
        {
            id: '#ORD-12348',
            serialNumber: 4,
            seller: {
                name: 'MobileWorld',
                email: 'orders@mobileworld.com',
                phone: '+91 98765 43213'
            },
            product: 'Ergonomic Laptop Stand',
            quantity: 1,
            amount: 899,
            status: 'Delivered',
            orderDate: '2024-01-10',
            shippingAddress: '321 Hitech City, Hyderabad, Telangana 500081',
            trackingId: 'TRK987654321'
        },
        {
            id: '#ORD-12349',
            serialNumber: 5,
            seller: {
                name: 'SmartTech Solutions',
                email: 'info@smarttech.com',
                phone: '+91 98765 43214'
            },
            product: 'Fitness Tracker Watch',
            quantity: 1,
            amount: 3200,
            status: 'Shipped',
            orderDate: '2024-01-13',
            shippingAddress: '654 MG Road, Bangalore, Karnataka 560001',
            trackingId: 'TRK456789123'
        }
    ];

    const statuses = ['all', 'Pending', 'Processing', 'Shipped', 'Delivered'];
    const timeframes = ['all', 'Today', 'Yesterday', 'Last 7 days', 'Last 30 days'];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="w-4 h-4" />;
            case 'Processing': return <Package className="w-4 h-4" />;
            case 'Shipped': return <Truck className="w-4 h-4" />;
            case 'Delivered': return <CheckCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Shipped': return 'bg-purple-100 text-purple-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const orderStats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        processing: orders.filter(o => o.status === 'Processing').length,
        shipped: orders.filter(o => o.status === 'Shipped').length,
        delivered: orders.filter(o => o.status === 'Delivered').length
    };

    const handleStatusUpdate = (orderId, newStatus) => {
        console.log(`Updating order ${orderId} to ${newStatus}`);
        // Here you would update the order status
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                    <p className="text-gray-600 mt-1">
                        Track and manage orders from connected sellers
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Export Orders
                    </button>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Bulk Update
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Orders</div>
                    <div className="text-2xl font-bold text-gray-900">{orderStats.total}</div>
                    <div className="text-xs text-gray-500 mt-1">All sellers</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Pending Orders</div>
                    <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
                    <div className="text-xs text-gray-500 mt-1">Need action</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">In Process</div>
                    <div className="text-2xl font-bold text-blue-600">{orderStats.processing}</div>
                    <div className="text-xs text-gray-500 mt-1">Being prepared</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Shipped Orders</div>
                    <div className="text-2xl font-bold text-purple-600">{orderStats.shipped}</div>
                    <div className="text-xs text-gray-500 mt-1">In transit</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Completed</div>
                    <div className="text-2xl font-bold text-green-600">{orderStats.delivered}</div>
                    <div className="text-xs text-gray-500 mt-1">Successfully delivered</div>
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
                            placeholder="Search by Order ID, Seller Name, or Product..."
                            className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
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

                        <select
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            value={selectedTimeframe}
                            onChange={(e) => setSelectedTimeframe(e.target.value)}
                        >
                            {timeframes.map(timeframe => (
                                <option key={timeframe} value={timeframe}>
                                    {timeframe === 'all' ? 'All Time' : timeframe}
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

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">S.No</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Order ID</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Seller</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Product</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Qty</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Shipping Address</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-gray-900">{order.serialNumber}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-mono text-sm font-medium text-emerald-600">{order.id}</div>
                                        {order.trackingId && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                Tracking: {order.trackingId}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-2 text-gray-400" />
                                            <div>
                                                <div className="font-medium text-gray-900">{order.seller.name}</div>
                                                <div className="text-xs text-gray-500">{order.seller.email}</div>
                                                <div className="text-xs text-gray-500">{order.seller.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-gray-900">{order.product}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-gray-900">{order.quantity}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-start">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div className="text-sm text-gray-600 max-w-xs">
                                                {order.shippingAddress}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-semibold text-emerald-600">₹{order.amount.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">Supplier earning</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            <span className="ml-2">{order.status}</span>
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            <div className="text-sm text-gray-600">{order.orderDate}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            {order.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'Processing')}
                                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Accept
                                                </button>
                                            )}
                                            {order.status === 'Processing' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'Shipped')}
                                                    className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                    Ship
                                                </button>
                                            )}
                                            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
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
                        <p className="text-gray-400">
                            Try adjusting your search filters or wait for new orders
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredOrders.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="text-gray-600">
                            Showing {filteredOrders.length} of {orders.length} orders
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                                Previous
                            </button>
                            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
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

export default SupplierOrders;