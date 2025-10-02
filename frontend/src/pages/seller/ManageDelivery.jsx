import React, { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    Eye,
    Package,
    Truck,
    CheckCircle,
    Clock,
    AlertCircle,
    MoreVertical,
    MapPin,
    User,
    Calendar,
    RefreshCcw
} from 'lucide-react';

const ManageDelivery = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedTimeframe, setSelectedTimeframe] = useState('all');

    const orders = [
        {
            id: '#AMZ-12345',
            serialNumber: 1,
            customer: {
                name: 'Rajesh Kumar',
                email: 'rajesh.kumar@example.com',
                phone: '+91 98765 43210'
            },
            product: 'Wireless Bluetooth Headphones Pro',
            platform: 'Amazon',
            quantity: 2,
            amount: 5998,
            status: 'Processing',
            paymentStatus: 'Paid',
            orderDate: '2024-01-15',
            deliveryDate: '2024-01-18',
            address: '123 Linking Road, Bandra West, Mumbai, Maharashtra 400050'
        },
        {
            id: '#FLK-12346',
            serialNumber: 2,
            customer: {
                name: 'Priya Sharma',
                email: 'priya.sharma@example.com',
                phone: '+91 98765 43211'
            },
            product: 'Smart Fitness Watch',
            platform: 'Flipkart',
            quantity: 1,
            amount: 7999,
            status: 'In Transit',
            paymentStatus: 'Paid',
            orderDate: '2024-01-14',
            deliveryDate: '2024-01-17',
            address: '456 Sector 18, Noida, Uttar Pradesh 201301'
        },
        {
            id: '#MSH-12347',
            serialNumber: 3,
            customer: {
                name: 'Amit Patel',
                email: 'amit.patel@example.com',
                phone: '+91 98765 43212'
            },
            product: 'Bluetooth Speaker Premium',
            platform: 'Meesho',
            quantity: 1,
            amount: 2499,
            status: 'Delivered',
            paymentStatus: 'Paid',
            orderDate: '2024-01-12',
            deliveryDate: '2024-01-15',
            address: '789 Koregaon Park, Pune, Maharashtra 411001'
        },
        {
            id: '#AMZ-12348',
            serialNumber: 4,
            customer: {
                name: 'Sneha Reddy',
                email: 'sneha.reddy@example.com',
                phone: '+91 98765 43213'
            },
            product: 'Ergonomic Laptop Stand',
            platform: 'Amazon',
            quantity: 1,
            amount: 1899,
            status: 'Pending',
            paymentStatus: 'Pending',
            orderDate: '2024-01-16',
            deliveryDate: '2024-01-19',
            address: '321 Hitech City, Hyderabad, Telangana 500081'
        },
        {
            id: '#FLK-12349',
            serialNumber: 5,
            customer: {
                name: 'Vikram Singh',
                email: 'vikram.singh@example.com',
                phone: '+91 98765 43214'
            },
            product: 'Premium Phone Case Set',
            platform: 'Flipkart',
            quantity: 1,
            amount: 899,
            status: 'In Transit',
            paymentStatus: 'Paid',
            orderDate: '2024-01-13',
            deliveryDate: '2024-01-16',
            address: '654 MG Road, Bangalore, Karnataka 560001'
        }
    ];

    const statuses = ['all', 'Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'];
    const timeframes = ['all', 'Today', 'Yesterday', 'Last 7 days', 'Last 30 days'];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="w-4 h-4" />;
            case 'Processing': return <Package className="w-4 h-4" />;
            case 'In Transit': return <Truck className="w-4 h-4" />;
            case 'Delivered': return <CheckCircle className="w-4 h-4" />;
            case 'Cancelled': return <AlertCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'In Transit': return 'bg-purple-100 text-purple-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Refunded': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const orderStats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        processing: orders.filter(o => o.status === 'Processing').length,
        inTransit: orders.filter(o => o.status === 'In Transit').length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
        totalRevenue: orders.filter(o => o.paymentStatus === 'Paid').reduce((sum, order) => sum + order.amount, 0)
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Delivery</h1>
                    <p className="text-gray-600 mt-1">Track and manage order deliveries from Buysta</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center">
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Sync Order
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Refresh Tracking
                    </button>

                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Pending</div>
                    <div className="text-2xl font-bold text-gray-900">{orderStats.total}</div>
                    {/* <div className="text-xs text-gray-500 mt-1">All platforms</div> */}
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">In Transit</div>
                    <div className="text-2xl font-bold text-green-600">₹{orderStats.totalRevenue.toLocaleString()}</div>
                    {/* <div className="text-xs text-gray-500 mt-1">Confirmed orders</div> */}
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Delivered</div>
                    <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
                    {/* <div className="text-xs text-gray-500 mt-1">Awaiting action</div> */}
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Cancelled</div>
                    <div className="text-2xl font-bold text-purple-600">{orderStats.inTransit}</div>
                    {/* <div className="text-xs text-gray-500 mt-1">Being shipped</div> */}
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
                            placeholder="Search by Order ID, Customer Name, Product, or Platform..."
                            className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>


                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                {/* <th className="text-left py-4 px-6 font-semibold text-gray-900">Customer</th> */}
                                {/* <th className="text-left py-4 px-6 font-semibold text-gray-900">Product & Platform</th> */}
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Address</th>
                                {/* <th className="text-left py-4 px-6 font-semibold text-gray-900">Quantity</th> */}
                                {/* <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th> */}
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-gray-900">{order.serialNumber}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-mono text-sm font-medium text-blue-600 mb-1">{order.id}</div>
                                        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
                                            {order.platform}
                                        </div>
                                    </td>

                                    <td className="py-4 px-6">
                                        <div className="flex items-start">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div className="text-sm text-gray-600 max-w-xs">
                                                {order.address}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            <span className="ml-2">{order.status}</span>
                                        </span>
                                    </td>
                                    {/* <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{order.orderDate}</div>
                                                <div className="text-xs text-gray-500">Expected: {order.deliveryDate}</div>
                                            </div>
                                        </div>
                                    </td> */}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-500 text-lg mb-2">No orders found</div>
                        <p className="text-gray-400">Try adjusting your search filters or sync orders from platforms</p>
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
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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

export default ManageDelivery;