import React, { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    UserCheck,
    UserX,
    Shield,
    Eye,
    Edit3,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
    Wallet,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('sellers');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Mock sellers data
    const sellers = [
        {
            id: 1,
            name: 'TechStore India',
            email: 'contact@techstore.com',
            phone: '+91 98765 43210',
            status: 'Active',
            kycStatus: 'Verified',
            walletBalance: 45678,
            joinDate: '2024-01-15',
            totalOrders: 245,
            totalRevenue: 567890,
            address: 'Mumbai, Maharashtra'
        },
        {
            id: 2,
            name: 'ElectroMart',
            email: 'orders@electromart.com',
            phone: '+91 98765 43211',
            status: 'Pending',
            kycStatus: 'Pending',
            walletBalance: 12340,
            joinDate: '2024-01-20',
            totalOrders: 0,
            totalRevenue: 0,
            address: 'Delhi, India'
        },
        {
            id: 3,
            name: 'GadgetHub',
            email: 'support@gadgethub.com',
            phone: '+91 98765 43212',
            status: 'Blocked',
            kycStatus: 'Rejected',
            walletBalance: 0,
            joinDate: '2024-01-10',
            totalOrders: 89,
            totalRevenue: 234567,
            address: 'Bangalore, Karnataka'
        }
    ];

    // Mock suppliers data
    const suppliers = [
        {
            id: 1,
            companyName: 'Kumar Electronics Manufacturing',
            email: 'info@kumarelectronics.com',
            phone: '+91 98765 54321',
            status: 'Active',
            kycStatus: 'Verified',
            totalProducts: 156,
            joinDate: '2024-01-05',
            totalOrders: 1247,
            totalRevenue: 2345678,
            address: 'Gurgaon, Haryana'
        },
        {
            id: 2,
            companyName: 'Premium Accessories Ltd',
            email: 'contact@premiumacc.com',
            phone: '+91 98765 54322',
            status: 'Pending',
            kycStatus: 'Pending',
            totalProducts: 45,
            joinDate: '2024-01-22',
            totalOrders: 0,
            totalRevenue: 0,
            address: 'Chennai, Tamil Nadu'
        }
    ];

    const tabs = [
        { id: 'sellers', label: 'Sellers', count: sellers.length },
        { id: 'suppliers', label: 'Suppliers', count: suppliers.length },
        { id: 'admins', label: 'Admin Staff', count: 3 }
    ];

    const statuses = ['all', 'Active', 'Pending', 'Blocked', 'Rejected'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Blocked': return 'bg-red-100 text-red-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getKycStatusColor = (status) => {
        switch (status) {
            case 'Verified': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getKycStatusIcon = (status) => {
        switch (status) {
            case 'Verified': return <CheckCircle className="w-4 h-4" />;
            case 'Pending': return <Clock className="w-4 h-4" />;
            case 'Rejected': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const handleApprove = (id, type) => {
        console.log(`Approving ${type} with ID: ${id}`);
    };

    const handleReject = (id, type) => {
        console.log(`Rejecting ${type} with ID: ${id}`);
    };

    const handleBlock = (id, type) => {
        console.log(`Blocking ${type} with ID: ${id}`);
    };

    const handleResetPassword = (id, type) => {
        console.log(`Resetting password for ${type} with ID: ${id}`);
    };

    const filteredSellers = sellers.filter(seller => {
        const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seller.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || seller.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const filteredSuppliers = suppliers.filter(supplier => {
        const matchesSearch = supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || supplier.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const renderSellersTab = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Sellers</div>
                    <div className="text-2xl font-bold text-gray-900">{sellers.length}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Active Sellers</div>
                    <div className="text-2xl font-bold text-green-600">
                        {sellers.filter(s => s.status === 'Active').length}
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Pending Approval</div>
                    <div className="text-2xl font-bold text-yellow-600">
                        {sellers.filter(s => s.status === 'Pending').length}
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">KYC Verified</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {sellers.filter(s => s.kycStatus === 'Verified').length}
                    </div>
                </div>
            </div>

            {/* Sellers Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Seller Details</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact Info</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">KYC Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Wallet Balance</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Performance</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredSellers.map((seller) => (
                                <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div>
                                            <div className="font-medium text-gray-900">{seller.name}</div>
                                            <div className="text-sm text-gray-500">ID: #{seller.id}</div>
                                            <div className="text-xs text-gray-500">Joined: {seller.joinDate}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {seller.email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="w-4 h-4 mr-2" />
                                                {seller.phone}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                {seller.address}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(seller.status)}`}>
                                            {seller.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getKycStatusColor(seller.kycStatus)}`}>
                                            {getKycStatusIcon(seller.kycStatus)}
                                            <span className="ml-2">{seller.kycStatus}</span>
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <Wallet className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="font-semibold text-gray-900">₹{seller.walletBalance.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm">
                                            <div className="text-gray-900">{seller.totalOrders} orders</div>
                                            <div className="text-gray-500">₹{seller.totalRevenue.toLocaleString()}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            {seller.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(seller.id, 'seller')}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(seller.id, 'seller')}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {seller.status === 'Active' && (
                                                <button
                                                    onClick={() => handleBlock(seller.id, 'seller')}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Block"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleResetPassword(seller.id, 'seller')}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Reset Password"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderSuppliersTab = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Suppliers</div>
                    <div className="text-2xl font-bold text-gray-900">{suppliers.length}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Active Suppliers</div>
                    <div className="text-2xl font-bold text-green-600">
                        {suppliers.filter(s => s.status === 'Active').length}
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Pending Approval</div>
                    <div className="text-2xl font-bold text-yellow-600">
                        {suppliers.filter(s => s.status === 'Pending').length}
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Products</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {suppliers.reduce((sum, s) => sum + s.totalProducts, 0)}
                    </div>
                </div>
            </div>

            {/* Suppliers Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Company Details</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact Info</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">KYC Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Products</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Performance</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredSuppliers.map((supplier) => (
                                <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div>
                                            <div className="font-medium text-gray-900">{supplier.companyName}</div>
                                            <div className="text-sm text-gray-500">ID: #{supplier.id}</div>
                                            <div className="text-xs text-gray-500">Joined: {supplier.joinDate}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {supplier.email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="w-4 h-4 mr-2" />
                                                {supplier.phone}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                {supplier.address}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(supplier.status)}`}>
                                            {supplier.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getKycStatusColor(supplier.kycStatus)}`}>
                                            {getKycStatusIcon(supplier.kycStatus)}
                                            <span className="ml-2">{supplier.kycStatus}</span>
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm">
                                            <div className="font-semibold text-gray-900">{supplier.totalProducts}</div>
                                            <div className="text-gray-500">products listed</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm">
                                            <div className="text-gray-900">{supplier.totalOrders} orders</div>
                                            <div className="text-gray-500">₹{supplier.totalRevenue.toLocaleString()}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            {supplier.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(supplier.id, 'supplier')}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(supplier.id, 'supplier')}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {supplier.status === 'Active' && (
                                                <button
                                                    onClick={() => handleBlock(supplier.id, 'supplier')}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Block"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderAdminsTab = () => (
        <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Staff Management</h3>
            <p className="text-gray-600">Create and manage sub-admin accounts with role-based permissions</p>
            <button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                Add New Admin
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage sellers, suppliers, and admin staff</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Export Users
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
                            className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center ${activeTab === tab.id
                                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                            <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search and Filters */}
                {(activeTab === 'sellers' || activeTab === 'suppliers') && (
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
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
                )}
            </div>

            {/* Tab Content */}
            {activeTab === 'sellers' && renderSellersTab()}
            {activeTab === 'suppliers' && renderSuppliersTab()}
            {activeTab === 'admins' && renderAdminsTab()}
        </div>
    );
};

export default UserManagement;