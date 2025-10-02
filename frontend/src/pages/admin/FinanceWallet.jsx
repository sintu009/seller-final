import React, { useState } from 'react';
import {
    Wallet,
    TrendingUp,
    DollarSign,
    CreditCard,
    Download,
    Filter,
    Eye,
    Settings,
    Users,
    Building,
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
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts';

const FinanceWallet = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('30days');
    const [activeTab, setActiveTab] = useState('overview');

    // Mock financial data
    const financeStats = [
        {
            title: 'Total Platform Revenue',
            value: '₹45,67,890',
            change: '+18.9%',
            trend: 'up',
            icon: DollarSign,
            color: 'text-green-600 bg-green-50'
        },
        {
            title: 'Platform Commission',
            value: '₹4,56,789',
            change: '+22.1%',
            trend: 'up',
            icon: TrendingUp,
            color: 'text-orange-600 bg-orange-50'
        },
        {
            title: 'Seller Earnings',
            value: '₹32,45,678',
            change: '+15.7%',
            trend: 'up',
            icon: Users,
            color: 'text-blue-600 bg-blue-50'
        },
        {
            title: 'Supplier Payouts',
            value: '₹8,65,423',
            change: '+12.3%',
            trend: 'up',
            icon: Building,
            color: 'text-purple-600 bg-purple-50'
        }
    ];

    // Revenue breakdown data
    const revenueData = [
        { name: 'Jan', platform: 45000, sellers: 320000, suppliers: 85000 },
        { name: 'Feb', platform: 52000, sellers: 365000, suppliers: 92000 },
        { name: 'Mar', platform: 48000, sellers: 340000, suppliers: 88000 },
        { name: 'Apr', platform: 61000, sellers: 425000, suppliers: 105000 },
        { name: 'May', platform: 55000, sellers: 385000, suppliers: 98000 },
        { name: 'Jun', platform: 67000, sellers: 465000, suppliers: 115000 },
        { name: 'Jul', platform: 73000, sellers: 510000, suppliers: 125000 }
    ];

    // Commission breakdown
    const commissionData = [
        { name: 'Amazon', value: 45, amount: 205000, color: '#FF9500' },
        { name: 'Flipkart', value: 30, amount: 137000, color: '#047BD1' },
        { name: 'Meesho', value: 15, amount: 68500, color: '#9333EA' },
        { name: 'Others', value: 10, amount: 45500, color: '#6B7280' }
    ];

    // Wallet transactions
    const walletTransactions = [
        {
            id: 'TXN-001',
            type: 'Seller Recharge',
            seller: 'TechStore India',
            amount: 25000,
            status: 'Completed',
            date: '2024-01-15',
            paymentMethod: 'UPI'
        },
        {
            id: 'TXN-002',
            type: 'Commission Deduction',
            seller: 'ElectroMart',
            amount: 3500,
            status: 'Completed',
            date: '2024-01-15',
            paymentMethod: 'Auto'
        },
        {
            id: 'TXN-003',
            type: 'Supplier Payout',
            seller: 'Kumar Electronics',
            amount: 45000,
            status: 'Processing',
            date: '2024-01-14',
            paymentMethod: 'Bank Transfer'
        },
        {
            id: 'TXN-004',
            type: 'Platform Fee',
            seller: 'GadgetHub',
            amount: 2800,
            status: 'Completed',
            date: '2024-01-14',
            paymentMethod: 'Auto'
        }
    ];

    // Seller wallet balances
    const sellerWallets = [
        {
            id: 1,
            name: 'TechStore India',
            balance: 45678,
            lastRecharge: '2024-01-15',
            totalSpent: 234567,
            status: 'Active'
        },
        {
            id: 2,
            name: 'ElectroMart',
            balance: 12340,
            lastRecharge: '2024-01-12',
            totalSpent: 89456,
            status: 'Low Balance'
        },
        {
            id: 3,
            name: 'GadgetHub',
            balance: 67890,
            lastRecharge: '2024-01-10',
            totalSpent: 345678,
            status: 'Active'
        }
    ];

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'wallets', label: 'Wallet Transactions' },
        { id: 'commission', label: 'Commission Management' },
        { id: 'reports', label: 'Revenue Reports' }
    ];

    const getTransactionColor = (type) => {
        switch (type) {
            case 'Seller Recharge': return 'bg-green-100 text-green-800';
            case 'Commission Deduction': return 'bg-orange-100 text-orange-800';
            case 'Supplier Payout': return 'bg-blue-100 text-blue-800';
            case 'Platform Fee': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Processing': return 'bg-yellow-100 text-yellow-800';
            case 'Failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getBalanceStatus = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Low Balance': return 'bg-yellow-100 text-yellow-800';
            case 'Inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderOverviewTab = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {financeStats.map((stat, index) => (
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

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Revenue Breakdown */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h3>
                        <select
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                        >
                            <option value="7days">Last 7 days</option>
                            <option value="30days">Last 30 days</option>
                            <option value="90days">Last 90 days</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorPlatform" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorSellers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorSuppliers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                formatter={(value, name) => [
                                    `₹${value.toLocaleString()}`,
                                    name === 'platform' ? 'Platform Commission' :
                                        name === 'sellers' ? 'Seller Earnings' : 'Supplier Payouts'
                                ]}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="platform"
                                stackId="1"
                                stroke="#EA580C"
                                fill="url(#colorPlatform)"
                            />
                            <Area
                                type="monotone"
                                dataKey="sellers"
                                stackId="1"
                                stroke="#3B82F6"
                                fill="url(#colorSellers)"
                            />
                            <Area
                                type="monotone"
                                dataKey="suppliers"
                                stackId="1"
                                stroke="#8B5CF6"
                                fill="url(#colorSuppliers)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Commission by Platform */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Commission by Platform</h3>
                    <div className="flex items-center justify-center mb-6">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={commissionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {commissionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                        {commissionData.map((platform, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mr-3"
                                        style={{ backgroundColor: platform.color }}
                                    ></div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                                        <div className="text-xs text-gray-500">{platform.value}% share</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-gray-900">₹{platform.amount.toLocaleString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderWalletsTab = () => (
        <div className="space-y-6">
            {/* Seller Wallet Balances */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Seller Wallet Balances</h3>
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        View All Wallets
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Seller</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Current Balance</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Recharge</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Spent</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sellerWallets.map((wallet) => (
                                <tr key={wallet.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="font-medium text-gray-900">{wallet.name}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            <Wallet className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="font-semibold text-gray-900">₹{wallet.balance.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{wallet.lastRecharge}</td>
                                    <td className="py-3 px-4 text-gray-600">₹{wallet.totalSpent.toLocaleString()}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getBalanceStatus(wallet.status)}`}>
                                            {wallet.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Wallet Transactions</h3>
                    <div className="flex items-center space-x-3">
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Transaction ID</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Payment Method</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {walletTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="font-mono text-sm text-orange-600">{transaction.id}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTransactionColor(transaction.type)}`}>
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-900">{transaction.seller}</td>
                                    <td className="py-3 px-4">
                                        <span className={`font-semibold ${transaction.type.includes('Recharge') ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {transaction.type.includes('Recharge') ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{transaction.paymentMethod}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{transaction.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderCommissionTab = () => (
        <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Commission Management</h3>
            <p className="text-gray-600">Set and manage commission rates for different platforms and sellers</p>
        </div>
    );

    const renderReportsTab = () => (
        <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Reports</h3>
            <p className="text-gray-600">Detailed financial reports and analytics</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Finance & Wallet Management</h1>
                    <p className="text-gray-600 mt-1">Monitor platform finances, wallet transactions, and commission management</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex space-x-1 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'wallets' && renderWalletsTab()}
            {activeTab === 'commission' && renderCommissionTab()}
            {activeTab === 'reports' && renderReportsTab()}
        </div>
    );
};

export default FinanceWallet;