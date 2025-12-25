import React, { useState } from 'react';
import {
    Download,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    Calendar,
    Filter,
    Eye,
    DollarSign,
    TrendingUp,
    CreditCard,
    AlertTriangle
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';

const SupplierWallet = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('30days');
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');

    // Mock wallet data
    const walletBalance = {
        available: 45678.50,
        pending: 12345.75,
        total: 58024.25,
        minimumWithdraw: 1000
    };

    const earningsData = [
        { name: 'Jan', earnings: 35000, orders: 145 },
        { name: 'Feb', earnings: 42000, orders: 167 },
        { name: 'Mar', earnings: 38000, orders: 156 },
        { name: 'Apr', earnings: 51000, orders: 189 },
        { name: 'May', earnings: 45000, orders: 172 },
        { name: 'Jun', earnings: 57000, orders: 203 },
        { name: 'Jul', earnings: 63000, orders: 234 }
    ];

    const recentTransactions = [
        {
            id: 'TXN-ORD-001',
            type: 'Credit',
            description: 'Order Payment Received',
            orderId: '#ORD-12345',
            amount: 3600,
            commission: 360,
            finalAmount: 3240,
            status: 'Completed',
            date: '2024-01-15'
        },
        {
            id: 'TXN-WTH-002',
            type: 'Debit',
            description: 'Wallet Withdrawal',
            orderId: null,
            amount: 25000,
            commission: 0,
            finalAmount: 25000,
            status: 'Completed',
            date: '2024-01-14'
        },
        {
            id: 'TXN-ORD-003',
            type: 'Credit',
            description: 'Order Payment Received',
            orderId: '#ORD-12346',
            amount: 2100,
            commission: 210,
            finalAmount: 1890,
            status: 'Completed',
            date: '2024-01-14'
        },
        {
            id: 'TXN-ORD-004',
            type: 'Credit',
            description: 'Order Payment Received',
            orderId: '#ORD-12347',
            amount: 1495,
            commission: 149.5,
            finalAmount: 1345.5,
            status: 'Pending',
            date: '2024-01-13'
        },
        {
            id: 'TXN-ORD-005',
            type: 'Credit',
            description: 'Order Payment Received',
            orderId: '#ORD-12348',
            amount: 899,
            commission: 89.9,
            finalAmount: 809.1,
            status: 'Completed',
            date: '2024-01-12'
        }
    ];

    const withdrawalHistory = [
        {
            id: 'WTH-001',
            amount: 25000,
            status: 'Completed',
            date: '2024-01-14',
            bankAccount: '****1234',
            transactionId: 'TXN789456123'
        },
        {
            id: 'WTH-002',
            amount: 15000,
            status: 'Processing',
            date: '2024-01-10',
            bankAccount: '****1234',
            transactionId: null
        },
        {
            id: 'WTH-003',
            amount: 30000,
            status: 'Completed',
            date: '2024-01-05',
            bankAccount: '****1234',
            transactionId: 'TXN456789012'
        }
    ];

    const handleWithdraw = () => {
        if (parseFloat(withdrawAmount) < walletBalance.minimumWithdraw) {
            alert(`Minimum withdrawal amount is ₹${walletBalance.minimumWithdraw}`);
            return;
        }
        if (parseFloat(withdrawAmount) > walletBalance.available) {
            alert('Insufficient balance');
            return;
        }

        console.log(`Processing withdrawal of ₹${withdrawAmount}`);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
    };

    const getTransactionColor = (type, status) => {
        if (status === 'Pending') return 'text-yellow-600';
        return type === 'Credit' ? 'text-green-600' : 'text-red-600';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Processing': return 'bg-yellow-100 text-yellow-800';
            case 'Pending': return 'bg-blue-100 text-blue-800';
            case 'Failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Wallet & Payments</h1>
                    <p className="text-gray-600 mt-1">
                        Manage your earnings, withdrawals, and transaction history
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </button>
                    <button
                        onClick={() => setShowWithdrawModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-semibold transition-colors flex items-center"
                    >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Withdraw Funds
                    </button>
                </div>
            </div>

            {/* Wallet Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-md p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white bg-opacity-20 rounded-md">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                            <div className="text-emerald-100 text-sm">Available Balance</div>
                            <div className="text-2xl font-bold">₹{walletBalance.available.toLocaleString()}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowWithdrawModal(true)}
                        className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 px-4 rounded-md font-medium transition-colors"
                    >
                        Withdraw Funds
                    </button>
                </div>

                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-100 rounded-md">
                            <Calendar className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="text-right">
                            <div className="text-gray-600 text-sm">Pending Balance</div>
                            <div className="text-2xl font-bold text-gray-900">₹{walletBalance.pending.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">From recent orders</div>
                </div>

                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-md">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-right">
                            <div className="text-gray-600 text-sm">Total Balance</div>
                            <div className="text-2xl font-bold text-gray-900">₹{walletBalance.total.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>Available + Pending</span>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Earnings Trend */}
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Earnings Trend</h3>
                        <select
                            className="bg-gray-50 border border-gray-200 rounded-mdg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                        >
                            <option value="7days">Last 7 days</option>
                            <option value="30days">Last 30 days</option>
                            <option value="90days">Last 90 days</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={earningsData}>
                            <defs>
                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                formatter={(value) => [`₹${value.toLocaleString()}`, 'Earnings']}
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="earnings"
                                stroke="#10B981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorEarnings)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Monthly Summary */}
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Monthly Summary</h3>
                        <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-emerald-50 rounded-md">
                                <div className="text-emerald-600 text-sm font-medium">Total Earnings</div>
                                <div className="text-2xl font-bold text-emerald-700">₹63,000</div>
                                <div className="text-xs text-emerald-600 mt-1">This month</div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-md">
                                <div className="text-blue-600 text-sm font-medium">Commission Paid</div>
                                <div className="text-2xl font-bold text-blue-700">₹6,300</div>
                                <div className="text-xs text-blue-600 mt-1">10% platform fee</div>
                            </div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-md">
                            <div className="text-green-600 text-sm font-medium">Net Earnings</div>
                            <div className="text-2xl font-bold text-green-700">₹56,700</div>
                            <div className="text-xs text-green-600 mt-1">After commission deduction</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Withdrawal Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md p-8 max-w-md w-full mx-4">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Withdraw Funds</h3>
                            <p className="text-gray-600">Transfer money to your registered bank account</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-md">
                                <div className="text-sm text-gray-600">Available Balance</div>
                                <div className="text-2xl font-bold text-gray-900">₹{walletBalance.available.toLocaleString()}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Withdrawal Amount
                                </label>
                                <input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder={`Minimum ₹${walletBalance.minimumWithdraw}`}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div className="bg-blue-50 p-4 rounded-md">
                                <div className="flex items-start">
                                    <AlertTriangle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <div className="font-medium">Bank Account: ****1234</div>
                                        <div>Processing time: 1-2 business days</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setShowWithdrawModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleWithdraw}
                                    disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                                    className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction History */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                        <div className="flex items-center space-x-3">
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </button>
                            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                View All
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Transaction ID</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Description</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Order ID</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount Earned</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Commission</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Final Amount</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {recentTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-mono text-sm text-emerald-600">{transaction.id}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <div className={`p-2 rounded-mdg mr-3 ${transaction.type === 'Credit' ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                {transaction.type === 'Credit' ? (
                                                    <ArrowDownRight className={`w-4 h-4 ${getTransactionColor(transaction.type, transaction.status)}`} />
                                                ) : (
                                                    <ArrowUpRight className={`w-4 h-4 ${getTransactionColor(transaction.type, transaction.status)}`} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{transaction.description}</div>
                                                <div className="text-sm text-gray-500">{transaction.type}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {transaction.orderId ? (
                                            <span className="font-mono text-sm text-blue-600">{transaction.orderId}</span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-semibold text-gray-900">₹{transaction.amount.toLocaleString()}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-semibold text-red-600">
                                            {transaction.commission > 0 ? `-₹${transaction.commission.toLocaleString()}` : '-'}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className={`font-semibold ${getTransactionColor(transaction.type, transaction.status)}`}>
                                            {transaction.type === 'Credit' ? '+' : '-'}₹{transaction.finalAmount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">{transaction.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Withdrawal History */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Withdrawal History</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Withdrawal ID</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Bank Account</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Transaction ID</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {withdrawalHistory.map((withdrawal) => (
                                <tr key={withdrawal.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-mono text-sm text-emerald-600">{withdrawal.id}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-semibold text-gray-900">₹{withdrawal.amount.toLocaleString()}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-gray-600">{withdrawal.bankAccount}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {withdrawal.transactionId ? (
                                            <span className="font-mono text-sm text-blue-600">{withdrawal.transactionId}</span>
                                        ) : (
                                            <span className="text-gray-400">Pending</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(withdrawal.status)}`}>
                                            {withdrawal.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">{withdrawal.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SupplierWallet;