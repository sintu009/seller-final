import React, { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    Eye,
    Calendar,
    DollarSign,
    CreditCard,
    Clock,
    CheckCircle,
    XCircle,
    ArrowUpRight,
    ArrowDownLeft
} from 'lucide-react';
import DatePicker from '../../components/DatePicker.jsx';

const SupplierPayment = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [dateRange, setDateRange] = useState([]);

    // Mock payment data
    const payments = [
        {
            id: 'PAY001',
            type: 'credit',
            amount: 15000,
            description: 'Product sale commission',
            method: 'Bank Transfer',
            status: 'completed',
            date: '2024-01-15',
            orderId: 'ORD001'
        },
        {
            id: 'PAY002',
            type: 'debit',
            amount: 2500,
            description: 'Platform fee deduction',
            method: 'Auto Debit',
            status: 'completed',
            date: '2024-01-14',
            orderId: 'ORD002'
        },
        {
            id: 'PAY003',
            type: 'credit',
            amount: 8750,
            description: 'Product sale commission',
            method: 'UPI',
            status: 'pending',
            date: '2024-01-13',
            orderId: 'ORD003'
        }
    ];

    const statuses = ['all', 'completed', 'pending', 'failed'];
    const types = ['all', 'credit', 'debit'];

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.orderId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
        const matchesType = selectedType === 'all' || payment.type === selectedType;

        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'failed': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const totalEarnings = payments.filter(p => p.type === 'credit' && p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
    const totalDeductions = payments.filter(p => p.type === 'debit' && p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = payments.filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                    <p className="text-gray-600 mt-1">Track your earnings and payment history</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative w-64">
                        <DatePicker
                            value={dateRange}
                            onChange={setDateRange}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Earnings</div>
                    <div className="text-2xl font-bold text-green-600">₹{totalEarnings.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">Completed payments</div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Deductions</div>
                    <div className="text-2xl font-bold text-red-600">₹{totalDeductions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">Platform fees</div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Pending Payments</div>
                    <div className="text-2xl font-bold text-yellow-600">₹{pendingPayments.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">Processing</div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Net Balance</div>
                    <div className="text-2xl font-bold text-blue-600">₹{(totalEarnings - totalDeductions).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">Available balance</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search payments..."
                            className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            className="px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            {statuses.filter(s => s !== 'all').map(status => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                        <select
                            className="px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Payment ID</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Description</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Method</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-gray-900">{payment.id}</div>
                                        <div className="text-sm text-gray-500">{payment.orderId}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            {payment.type === 'credit' ? (
                                                <ArrowDownLeft className="w-4 h-4 text-green-600 mr-2" />
                                            ) : (
                                                <ArrowUpRight className="w-4 h-4 text-red-600 mr-2" />
                                            )}
                                            <span className={`capitalize ${payment.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {payment.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className={`font-semibold ${payment.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {payment.type === 'credit' ? '+' : '-'}₹{payment.amount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-gray-900">{payment.description}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-gray-700">{payment.method}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(payment.status)}`}>
                                            {getStatusIcon(payment.status)}
                                            <span className="ml-2 capitalize">{payment.status}</span>
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center text-gray-700">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            {new Date(payment.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPayments.length === 0 && (
                    <div className="text-center py-12">
                        <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-500 text-lg mb-2">No payments found</div>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupplierPayment;