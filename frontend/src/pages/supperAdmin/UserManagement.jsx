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
    MapPin,
    Trash2,
    Plus,
    Key,
    User
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
    useGetAllUsersQuery, useGetAllKYCQuery, useApproveUserMutation, useRejectUserMutation, useBlockUserMutation, useUnBlockUserMutation
    , useDeleteUserMutation
} from '../../store/slices/apiSlice';
import { useAppSelector } from '../../store/hooks';
import { showAlert } from '../../utils/sweetAlert';

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('sellers');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
    const [showEditAdminModal, setShowEditAdminModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [resetPasswordAdmin, setResetPasswordAdmin] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [newAdmin, setNewAdmin] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        permissions: []
    });

    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const {
        data: usersData,
        isLoading: usersLoading,
        error: usersError,
        refetch: refetchUsers
    } = useGetAllUsersQuery(undefined, {
        skip: true // Skip API call for now
    });

    // Mock data for super admin
    const mockUsers = [
        {
            _id: '1',
            name: 'John Seller',
            email: 'john@seller.com',
            phone: '+1234567890',
            isActive: true,
            kycStatus: 'approved',
            createdAt: '2024-01-01',
            role: 'seller',
            address: { city: 'Mumbai', state: 'Maharashtra' }
        },
        {
            _id: '2',
            name: 'Jane Supplier',
            email: 'jane@supplier.com',
            phone: '+1234567891',
            isActive: true,
            kycStatus: 'pending',
            createdAt: '2024-01-02',
            role: 'supplier',
            address: { city: 'Delhi', state: 'Delhi' }
        },
        {
            _id: '3',
            name: 'Admin User',
            email: 'admin@platform.com',
            phone: '+1234567892',
            isActive: true,
            kycStatus: 'approved',
            createdAt: '2024-01-03',
            role: 'admin',
            address: { city: 'Bangalore', state: 'Karnataka' }
        }
    ];

    const users = usersData?.data || mockUsers;

    const [approveUser] = useApproveUserMutation();
    const [rejectUser] = useRejectUserMutation();
    const [blockUser] = useBlockUserMutation();
    const [unBlockUser] = useUnBlockUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    // Transform user data to match original structure
    const enrichedUsers = users.map(user => ({
        id: user._id,
        name: user.name || 'N/A',
        email: user.email,
        phone: user.phone || 'N/A',
        status: user.isActive ? 'Active' : 'Blocked',
        kycStatus: user.kycStatus ? user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1) : 'Pending',
        walletBalance: 0, // Default value
        joinDate: new Date(user.createdAt).toLocaleDateString(),
        totalOrders: 0, // Default value
        totalRevenue: 0, // Default value
        address: user.address ? `${user.address.city || ''}, ${user.address.state || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || 'N/A' : 'N/A',
        role: user.role,
        _id: user._id
    }));

    // Mock admin users
    const adminUsers = enrichedUsers.filter(user => user.role === 'admin').map(user => ({
        ...user,
        permissions: ['User Management', 'Product Management', 'Orders'],
        lastLogin: '2024-01-15 10:30 AM',
        createdBy: 'Super Admin'
    }));

    const availablePermissions = [
        'User Management',
        'Product Management', 
        'Order Management',
        'Finance Management',
        'KYC Management',
        'Support Management',
        'Reports & Analytics'
    ];

    const handleCreateAdmin = async () => {
        try {
            console.log('Creating admin:', newAdmin);
            toast.success('Admin user created successfully!');
            setShowCreateAdminModal(false);
            setNewAdmin({ name: '', email: '', password: '', role: 'admin', permissions: [] });
            refetchUsers();
        } catch (error) {
            toast.error('Failed to create admin user');
        }
    };

    const handleEditAdmin = (admin) => {
        setEditingAdmin({ ...admin, permissions: admin.permissions || [] });
        setShowEditAdminModal(true);
    };

    const handleUpdateAdmin = async () => {
        try {
            console.log('Updating admin:', editingAdmin);
            toast.success('Admin updated successfully!');
            setShowEditAdminModal(false);
            setEditingAdmin(null);
        } catch (error) {
            toast.error('Failed to update admin');
        }
    };

    const handleResetPassword = (admin) => {
        setResetPasswordAdmin(admin);
        setNewPassword('');
        setShowResetPasswordModal(true);
    };

    const handleUpdatePassword = async () => {
        try {
            console.log('Resetting password for:', resetPasswordAdmin.name);
            toast.success('Password reset successfully!');
            setShowResetPasswordModal(false);
            setResetPasswordAdmin(null);
            setNewPassword('');
        } catch (error) {
            toast.error('Failed to reset password');
        }
    };

    // Mock sellers data - replace with real data
    const sellers = enrichedUsers.filter(user => user.role === 'seller');

    // Mock suppliers data - replace with real data  
    const suppliers = enrichedUsers.filter(user => user.role === 'supplier').map(user => ({
        id: user.id,
        companyName: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        kycStatus: user.kycStatus,
        totalProducts: 0, // Default value
        joinDate: user.joinDate,
        totalOrders: 0, // Default value
        totalRevenue: 0, // Default value
        address: user.address,
        _id: user._id
    }));

    const tabs = [
        { id: 'sellers', label: 'Sellers', count: sellers.length },
        { id: 'suppliers', label: 'Suppliers', count: suppliers.length },
        { id: 'admins', label: 'Admin Staff', count: enrichedUsers.filter(u => u.role === 'admin').length }
    ];

    const statuses = ['all', 'Active', 'Pending', 'Blocked', 'Rejected'];

    const getStatusColor = (status) => {
        const lowerStatus = status?.toLowerCase();
        switch (lowerStatus) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'blocked': return 'bg-red-100 text-red-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getKycStatusColor = (status) => {
        const lowerStatus = status?.toLowerCase();
        switch (lowerStatus) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getKycStatusIcon = (status) => {
        const lowerStatus = status?.toLowerCase();
        switch (lowerStatus) {
            case 'approved': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const handleApprove = async (id, type) => {
        try {
            await approveUser(id).unwrap();
            toast.success('User approved successfully!');
            refetchUsers();
        } catch (error) {
            toast.error('Failed to approve user');
        }
    };

    const handleReject = async (id, type) => {
        try {
            const result = await showAlert({
                type: 'warning',
                title: 'Reject User?',
                text: 'This user will lose access to the platform.',
                confirmText: 'Yes, Reject',
                showCancel: true,
            });

            if (!result.isConfirmed) return;

            await rejectUser({ userId: id, reason: 'Admin rejection' }).unwrap();
            toast.success('User rejected successfully!');
            refetchUsers();
        } catch (error) {
            toast.error('Failed to reject user');
        }
    };

    const handleBlock = async (id, type) => {
        try {
            const result = await showAlert({
                type: 'warning',
                title: 'Block User?',
                text: 'This user will lose access to the platform.',
                confirmText: 'Yes, Block',
                showCancel: true,
            });

            if (!result.isConfirmed) return;

            await blockUser({ userId: id, reason: 'Admin block' }).unwrap();
            toast.success('User blocked successfully!');
            refetchUsers();
        } catch (error) {
            toast.error('Failed to block user');
        }
    };

    const handleUnBlock = async (id, type) => {
        try {
            const result = await showAlert({
                type: 'warning',
                title: 'Unblock User?',
                text: 'This user will regain access to the platform.',
                confirmText: 'Yes, Unblock',
                showCancel: true,
            });

            if (!result.isConfirmed) return;

            await unBlockUser({ userId: id, reason: 'Admin unblock' }).unwrap();
            toast.success('User unblocked successfully!');
            refetchUsers();
        } catch (error) {
            toast.error('Failed to unblock user');
        }
    };

    const handleDeleteUser = async (id, type) => {
        try {
            const result = await showAlert({
                type: 'warning',
                title: 'Delete User?',
                text: 'This user will be permanently deleted.',
                confirmText: 'Yes, Delete',
                showCancel: true,
            });

            if (!result.isConfirmed) return;

            await deleteUser(id).unwrap();
            toast.success('User deleted successfully!');
            refetchUsers();
        } catch (error) {
            toast.error('Failed to delete user');
        }
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

    if (usersLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-mdg shadow-md text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading users...</p>
                </div>
            </div>
        );
    }

    const renderSellersTab = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Sellers</div>
                    <div className="text-2xl font-bold text-gray-900">{sellers.length}</div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Active Sellers</div>
                    <div className="text-2xl font-bold text-green-600">
                        {sellers.filter(s => s.status === 'Active').length}
                    </div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Pending Approval</div>
                    <div className="text-2xl font-bold text-yellow-600">
                        {sellers.filter(s => s.status === 'Pending').length}
                    </div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">KYC Approved</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {sellers.filter(s => s.kycStatus === 'Approved').length}
                    </div>
                </div>
            </div>

            {/* Sellers Table */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
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
                                            <div className="flex items-center text-sm">
                                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                {seller.email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                {seller.phone}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                {seller.address}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(seller.status)}`}>
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
                                            <div>
                                                <div className="font-semibold text-gray-900">₹{seller.walletBalance.toLocaleString()}</div>
                                                <div className="text-xs text-gray-500">Available</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{seller.totalOrders} Orders</div>
                                            <div className="text-sm text-gray-600">₹{seller.totalRevenue.toLocaleString()} Revenue</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            {seller.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(seller._id, 'seller')}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-mdg transition-colors"
                                                        title="Approve Seller"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(seller._id, 'seller')}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-mdg transition-colors"
                                                        title="Reject Seller"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {seller.status === 'Active' && (
                                                <button
                                                    onClick={() => handleBlock(seller._id, 'seller')}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-mdg transition-colors"
                                                    title="Block Seller"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                            )}

                                            {seller.status === 'Blocked' && (
                                                <button
                                                    onClick={() => handleUnBlock(seller._id, 'seller')}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-mdg transition-colors"
                                                    title="Unblock Seller"
                                                >
                                                    <UserCheck className="w-4 h-4" />
                                                </button>
                                            )}

                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-mdg transition-colors"
                                                title="View Seller">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(seller._id, 'seller')}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-mdg transition-colors"
                                                title="Delete Seller">
                                                <Trash2 className="w-4 h-4" />
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
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Suppliers</div>
                    <div className="text-2xl font-bold text-gray-900">{suppliers.length}</div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Active Suppliers</div>
                    <div className="text-2xl font-bold text-green-600">
                        {suppliers.filter(s => s.status === 'Active').length}
                    </div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Pending Approval</div>
                    <div className="text-2xl font-bold text-yellow-600">
                        {suppliers.filter(s => s.status === 'Pending').length}
                    </div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">KYC Approved</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {suppliers.filter(s => s.kycStatus === 'Approved').length}
                    </div>
                </div>
            </div>

            {/* Suppliers Table */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
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
                                            <div className="flex items-center text-sm">
                                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                {supplier.email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                {supplier.phone}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                {supplier.address}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(supplier.status)}`}>
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
                                        <div className="text-sm font-medium text-gray-900">{supplier.totalProducts} Products</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{supplier.totalOrders} Orders</div>
                                            <div className="text-sm text-gray-600">₹{supplier.totalRevenue.toLocaleString()} Revenue</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            {supplier.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(supplier._id, 'supplier')}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-mdg transition-colors"
                                                        title="Approve Supplier"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(supplier._id, 'supplier')}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-mdg transition-colors"
                                                        title="Reject Supplier"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {supplier.status === 'Active' && (
                                                <button
                                                    onClick={() => handleBlock(supplier._id, 'supplier')}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-mdg transition-colors"
                                                    title="Block Supplier"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                            )}
                                            {supplier.status === 'Blocked' && (
                                                <button
                                                    onClick={() => handleUnBlock(supplier._id, 'supplier')}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-mdg transition-colors"
                                                    title="Unblock Supplier"
                                                >
                                                    <UserCheck className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-mdg transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(supplier._id, 'supplier')}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-mdg transition-colors"
                                                title="Delete Supplier">
                                                <Trash2 className="w-4 h-4" />
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">
                        Manage sellers, suppliers, and admin staff
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => { refetchUsers(); }}
                        className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Users
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Bulk Actions
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-4 text-sm font-medium rounded-mdg transition-colors ${activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or company..."
                            className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            className="px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'All Status' : status}
                                </option>
                            ))}
                        </select>
                        <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                            <Filter className="w-4 h-4 mr-2" />
                            More Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'sellers' && renderSellersTab()}
            {activeTab === 'suppliers' && renderSuppliersTab()}
            {activeTab === 'admins' && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                            <div className="text-sm text-gray-600 mb-1">Total Admins</div>
                            <div className="text-2xl font-bold text-gray-900">{adminUsers.length}</div>
                        </div>
                        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                            <div className="text-sm text-gray-600 mb-1">Active Admins</div>
                            <div className="text-2xl font-bold text-green-600">
                                {adminUsers.filter(a => a.status === 'Active').length}
                            </div>
                        </div>
                        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                            <div className="text-sm text-gray-600 mb-1">Online Now</div>
                            <div className="text-2xl font-bold text-blue-600">2</div>
                        </div>
                        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                            <div className="text-sm text-gray-600 mb-1">Last 24h Logins</div>
                            <div className="text-2xl font-bold text-purple-600">5</div>
                        </div>
                    </div>

                    {/* Create Admin Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowCreateAdminModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Admin User
                        </button>
                    </div>

                    {/* Admins Table */}
                    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Admin Details</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact Info</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Permissions</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Login</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {adminUsers.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{admin.name}</div>
                                                        <div className="text-sm text-gray-500">ID: #{admin.id}</div>
                                                        <div className="text-xs text-gray-500">Created: {admin.joinDate}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm">
                                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                        {admin.email}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                        {admin.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center">
                                                    <div className={`w-2 h-2 rounded-full mr-2 ${
                                                        admin.status === 'Active' ? 'bg-green-400' : 'bg-red-400'
                                                    }`}></div>
                                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                                                        getStatusColor(admin.status)
                                                    }`}>
                                                        {admin.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-wrap gap-1">
                                                    {admin.permissions.slice(0, 2).map((permission, index) => (
                                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                            {permission}
                                                        </span>
                                                    ))}
                                                    {admin.permissions.length > 2 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                            +{admin.permissions.length - 2} more
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-gray-900">{admin.lastLogin}</div>
                                                <div className="text-xs text-gray-500">By: {admin.createdBy}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-2">
                                                    <button 
                                                        onClick={() => handleEditAdmin(admin)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                                                        title="Edit Admin"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleResetPassword(admin)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors" 
                                                        title="Reset Password"
                                                    >
                                                        <Key className="w-4 h-4" />
                                                    </button>
                                                    {admin.status === 'Active' ? (
                                                        <button
                                                            onClick={() => handleBlock(admin._id, 'admin')}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Block Admin"
                                                        >
                                                            <Shield className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUnBlock(admin._id, 'admin')}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                            title="Unblock Admin"
                                                        >
                                                            <UserCheck className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteUser(admin._id, 'admin')}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                        title="Delete Admin"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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
            )}

            {/* Create Admin Modal */}
            {showCreateAdminModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Admin User</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={newAdmin.name}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter full name"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter email address"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={newAdmin.password}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter password"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {availablePermissions.map((permission) => (
                                        <label key={permission} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={newAdmin.permissions.includes(permission)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewAdmin({
                                                            ...newAdmin,
                                                            permissions: [...newAdmin.permissions, permission]
                                                        });
                                                    } else {
                                                        setNewAdmin({
                                                            ...newAdmin,
                                                            permissions: newAdmin.permissions.filter(p => p !== permission)
                                                        });
                                                    }
                                                }}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-700">{permission}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowCreateAdminModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateAdmin}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Create Admin
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Admin Modal */}
            {showEditAdminModal && editingAdmin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Admin User</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={editingAdmin.name}
                                    onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={editingAdmin.email}
                                    onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {availablePermissions.map((permission) => (
                                        <label key={permission} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={editingAdmin.permissions.includes(permission)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setEditingAdmin({
                                                            ...editingAdmin,
                                                            permissions: [...editingAdmin.permissions, permission]
                                                        });
                                                    } else {
                                                        setEditingAdmin({
                                                            ...editingAdmin,
                                                            permissions: editingAdmin.permissions.filter(p => p !== permission)
                                                        });
                                                    }
                                                }}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-700">{permission}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowEditAdminModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateAdmin}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Update Admin
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showResetPasswordModal && resetPasswordAdmin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset Password</h3>
                        
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Reset password for <strong>{resetPasswordAdmin.name}</strong>
                            </p>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowResetPasswordModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdatePassword}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;