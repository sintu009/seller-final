import React, { useState } from 'react';
import {
    DollarSign,
    TrendingUp,
    Calendar,
    Download,
    Filter,
    Eye,
    Users,
    Building,
    Package,
    Wallet,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const PlatformMargins = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('30days');
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Mock platform margin data
    const marginStats = [
        {
            title: 'Total Orders Processed',
            value: '89,234',
            change: '+22.1%',
            trend: 'up',
            icon: Package,
            color: 'text-blue-600 bg-blue-50'
        },
        {
            title: 'Total Platform Margin',
            value: '₹17,84,680',
            change: '+22.1%',
            trend: 'up',
            icon: DollarSign,
            color: 'text-green-600 bg-green-50'
        },
        {
            title: 'Margin Today',
            value: '₹2,340',
            change: '+15.3%',
            trend: 'up',
            icon: TrendingUp,
            color: 'text-orange-600 bg-orange-50'
        },
        {
            title: 'Margin This Month',
            value: '₹45,680',
            change: '+18.7%',
            trend: 'up',
            icon: Calendar,
            color: 'text-purple-600 bg-purple-50'
        }
    ];

    // Daily margin collection data
    const marginTrendData = [
        { name: 'Jan', margin: 35000, orders: 1750 },
        { name: 'Feb', margin: 42000, orders: 2100 },
        { name: 'Mar', margin: 38000, orders: 1900 },
        { name: 'Apr', margin: 51000, orders: 2550 },
        { name: 'May', margin: 45000, orders: 2250 },
        { name: 'Jun', margin: 57000, orders: 2850 },
        { name: 'Jul', margin: 63000, orders: 3150 }
    ];

    // Platform margin breakdown
    const platformMarginData = [
        { platform: 'Amazon', orders: 40234, margin: 804680, percentage: 45 },
        { platform: 'Flipkart', orders: 26823, margin: 536460, percentage: 30 },
        { platform: 'Meesho', orders: 13412, margin: 268240, percentage: 15 },
        { platform: 'Others', orders: 8965, margin: 179300, percentage: 10 }
    ];

    // Recent margin collections (from wallet recharges)
    const recentMarginCollections = [
        {
            id: 'MRG-001',
            orderId: '#AMZ-12345',
            sellerName: 'TechStore India',
            supplierName: 'Kumar Electronics',
            productName: 'Wireless Headphones Pro',
            marginAmount: 20,
            walletRechargeRef: 'WLT-REF-789',
            date: '2024-01-15',
            status: 'Collected'
        },
        {
            id: 'MRG-002',
            orderId: '#FLK-12346',
            sellerName: 'ElectroMart',
            supplierName: 'Premium Accessories Ltd',
            productName: 'Laptop Stand Premium',
            marginAmount: 20,
            walletRechargeRef: 'WLT-REF-790',
            date: '2024-01-15',
            status: 'Collected'
        },
        {
            id: 'MRG-003',
            orderId: '#MSH-12347',
            sellerName: 'GadgetHub',
            supplierName: 'Mobile Accessories Co',
            productName: 'Phone Case Set',
            marginAmount: 20,
            walletRechargeRef: 'WLT-REF-791',
            date: '2024-01-14',
            status: 'Collected'
        },
        {
            id: 'MRG-004',
            orderId: '#AMZ-12348',
            sellerName: 'MobileWorld',
            supplierName: 'Health Tech Solutions',
            productName: 'Fitness Tracker',
            marginAmount: 20,
            walletRechargeRef: 'WLT-REF-792',
            date: '2024-01-14',
            status: 'Pending'
        },
        {
            id: 'MRG-005',
            orderId: '#FLK-12349',
            sellerName: 'SmartTech Solutions',
            supplierName: 'Kumar Electronics',
            productName: 'Bluetooth Speaker',
            marginAmount: 20,
            walletRechargeRef: 'WLT-REF-793',
            date: '2024-01-13',
            status: 'Collected'
        }
    ];

    // Wallet recharge tracking
    const walletRecharges = [
        {
            id: 'WLT-REF-789',
            sellerName: 'TechStore India',
            rechargeAmount: 25000,
            marginCollected: 60, // 3 orders × ₹20
            date: '2024-01-15',
            paymentMethod: 'UPI',
            status: 'Completed'
        },
        {
            id: 'WLT-REF-790',
            sellerName: 'ElectroMart',
            rechargeAmount: 15000,
            marginCollected: 40, // 2 orders × ₹20
            date: '2024-01-14',
            paymentMethod: 'Net Banking',
            status: 'Completed'
        },
        {
            id: 'WLT-REF-791',
            sellerName: 'GadgetHub',
            rechargeAmount: 30000,
            marginCollected: 100, // 5 orders × ₹20
            date: '2024-01-13',
            paymentMethod: 'Credit Card',
            status: 'Completed'
        }
    ];

    const filters = ['all', 'today', 'week', 'month'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Collected': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Reversed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredMargins = recentMarginCollections.filter(margin => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'today') return margin.date === '2024-01-15';
        if (selectedFilter === 'week') return ['2024-01-15', '2024-01-14', '2024-01-13'].includes(margin.date);
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Platform Margins & Earnings</h1>
                    <p className="text-gray-600 mt-1">
                        Track ₹20 platform margin collection from every order processed
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <select
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                        <option value="7days">Last 7 days</option>
                        <option value="30days">Last 30 days</option>
                        <option value="90days">Last 90 days</option>
                        <option value="year">This year</option>
                    </select>
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Margin Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {marginStats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {stat.trend === 'up' ? (
                                    <ArrowUpRight className="w-4 h-4 mr-1" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4 mr-1" />
                                )}
                                {stat.change}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-600 text-sm">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Margin Collection Formula */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <DollarSign className="w-8 h-8 mr-3" />
                        <div>
                            <h3 className="text-xl font-bold">Platform Margin Formula</h3>
                            <p className="text-orange-100">₹20 automatically added to every product cost</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                    <div className="text-sm space-y-2">
                        <div><strong>Supplier Cost:</strong> ₹200 (example)</div>
                        <div><strong>Platform Add-on:</strong> +₹20 (automatic)</div>
                        <div><strong>Seller Sees:</strong> ₹220 (base cost)</div>
                        <div><strong>Collection:</strong> ₹20 collected when seller recharges wallet</div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Margin Collection Trends */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Margin Collection Trends</h3>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">Platform Margin</span>
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={marginTrendData}>
                            <defs>
                                <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                formatter={(value, name) => [
                                    name === 'margin' ? `₹${value.toLocaleString()}` : value,
                                    name === 'margin' ? 'Platform Margin' : 'Orders'
                                ]}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="margin"
                                stroke="#EA580C"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorMargin)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Platform Breakdown */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Margin by Platform</h3>
                    <div className="space-y-4">
                        {platformMarginData.map((platform, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-900">{platform.platform}</span>
                                    <span className="text-sm text-gray-600">₹{platform.margin.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${platform.percentage}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">{platform.orders.toLocaleString()} orders</span>
                                    <span className="text-xs text-gray-500">{platform.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Margin Collection Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Platform Margin Collections</h3>
                        <div className="flex items-center space-x-3">
                            <select
                                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                            >
                                {filters.map(filter => (
                                    <option key={filter} value={filter}>
                                        {filter === 'all' ? 'All Time' :
                                            filter === 'today' ? 'Today' :
                                                filter === 'week' ? 'This Week' : 'This Month'}
                                    </option>
                                ))}
                            </select>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center">
                                <Filter className="w-4 h-4 mr-2" />
                                More Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Margin ID</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Order ID</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Seller Name</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Supplier Name</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Product</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Margin (₹20)</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Wallet Recharge Ref</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredMargins.map((margin) => (
                                <tr key={margin.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-mono text-sm text-orange-600">{margin.id}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-mono text-sm text-blue-600">{margin.orderId}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="text-gray-900">{margin.sellerName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <Building className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="text-gray-900">{margin.supplierName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-gray-900">{margin.productName}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-orange-600">₹{margin.marginAmount}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-mono text-sm text-purple-600">{margin.walletRechargeRef}</div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">{margin.date}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(margin.status)}`}>
                                            {margin.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Wallet Recharge Tracking */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Wallet Recharge & Margin Collection</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Recharge Reference</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Seller Name</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Recharge Amount</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Margin Collected</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Payment Method</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {walletRecharges.map((recharge) => (
                                <tr key={recharge.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-mono text-sm text-purple-600">{recharge.id}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="text-gray-900">{recharge.sellerName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-semibold text-blue-600">₹{recharge.rechargeAmount.toLocaleString()}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-orange-600">₹{recharge.marginCollected}</div>
                                        <div className="text-xs text-gray-500">{recharge.marginCollected / 20} orders</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <Wallet className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="text-gray-600">{recharge.paymentMethod}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">{recharge.date}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(recharge.status)}`}>
                                            {recharge.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Margin Collection Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-green-50 rounded-xl">
                        <div className="text-green-600 text-sm font-medium">Total Collected</div>
                        <div className="text-2xl font-bold text-green-700">₹{recentMarginCollections.filter(m => m.status === 'Collected').length * 20}</div>
                        <div className="text-xs text-green-600 mt-1">From completed orders</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-xl">
                        <div className="text-yellow-600 text-sm font-medium">Pending Collection</div>
                        <div className="text-2xl font-bold text-yellow-700">₹{recentMarginCollections.filter(m => m.status === 'Pending').length * 20}</div>
                        <div className="text-xs text-yellow-600 mt-1">Awaiting wallet recharge</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl">
                        <div className="text-blue-600 text-sm font-medium">Average Daily</div>
                        <div className="text-2xl font-bold text-blue-700">₹2,340</div>
                        <div className="text-xs text-blue-600 mt-1">Platform margin per day</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformMargins;