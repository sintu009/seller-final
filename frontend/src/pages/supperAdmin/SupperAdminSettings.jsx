import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Settings,
    Globe,
    DollarSign,
    Key,
    Bell,
    Users,
    Shield,
    Save,
    Upload,
    Download,
    AlertTriangle,
    CheckCircle,
    Edit3,
    Plus,
    Trash2,
    Eye,
    EyeOff
} from 'lucide-react';
import { 
    useGetPlatformSettingsQuery,
    useUpdatePlatformSettingsMutation,
    useGetCommissionSettingsQuery,
    useUpdateCommissionSettingsMutation,
    useGetApiKeysQuery,
    useCreateApiKeyMutation,
    useDeleteApiKeyMutation,
    useGetNotificationSettingsQuery,
    useUpdateNotificationSettingsMutation,
    useGetAdminRolesQuery,
    useCreateAdminRoleMutation,
    useUpdateAdminRoleMutation,
    useDeleteAdminRoleMutation
} from '../../store/slices/apiSlice';
import {
    setActiveTab,
    setShowApiModal,
    setShowRoleModal,
    setEditingRole,
    setNewApiKey,
    resetNewApiKey,
    toggleApiKeyVisibility
} from '../../store/slices/superAdminSlice';
import { toast } from 'react-toastify';

const SuperAdminSettings = () => {
    const dispatch = useDispatch();
    const { 
        activeTab, 
        showApiModal, 
        showRoleModal, 
        editingRole, 
        newApiKey, 
        showApiKeys 
    } = useSelector((state) => state.superAdmin);

    // API Queries
    const { data: platformData, isLoading: platformLoading } = useGetPlatformSettingsQuery();
    const { data: commissionData, isLoading: commissionLoading } = useGetCommissionSettingsQuery();
    const { data: apiKeysData, isLoading: apiKeysLoading } = useGetApiKeysQuery();
    const { data: notificationData, isLoading: notificationLoading } = useGetNotificationSettingsQuery();
    const { data: rolesData, isLoading: rolesLoading } = useGetAdminRolesQuery();

    // Mutations
    const [updatePlatformSettings] = useUpdatePlatformSettingsMutation();
    const [updateCommissionSettings] = useUpdateCommissionSettingsMutation();
    const [createApiKey] = useCreateApiKeyMutation();
    const [deleteApiKey] = useDeleteApiKeyMutation();
    const [updateNotificationSettings] = useUpdateNotificationSettingsMutation();
    const [createAdminRole] = useCreateAdminRoleMutation();
    const [updateAdminRole] = useUpdateAdminRoleMutation();
    const [deleteAdminRole] = useDeleteAdminRoleMutation();

    const tabs = [
        { id: 'platform', label: 'Platform Settings', icon: Globe },
        { id: 'commission', label: 'Commission & Fees', icon: DollarSign },
        { id: 'api', label: 'API Configuration', icon: Key },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'roles', label: 'Role Management', icon: Users },
        { id: 'security', label: 'Security', icon: Shield }
    ];

    // State from API
    const [platformSettings, setPlatformSettings] = useState({
        platformName: 'MarketPlace Platform',
        defaultGstRate: 18,
        defaultShippingCharges: 60,
        minimumOrderValue: 100,
        maxProductsPerSeller: 1000,
        autoApprovalEnabled: false,
        maintenanceMode: false
    });

    const [commissionSettings, setCommissionSettings] = useState({
        amazonCommission: 15,
        flipkartCommission: 12,
        meeshoCommission: 10,
        platformFee: 2,
        paymentGatewayFee: 2.5,
        gstOnCommission: 18
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        orderAlerts: true,
        paymentAlerts: true,
        kycAlerts: true,
        systemAlerts: true
    });

    // Update state when API data loads
    useEffect(() => {
        if (platformData?.data) {
            setPlatformSettings(platformData.data);
        }
    }, [platformData]);

    useEffect(() => {
        if (commissionData?.data) {
            setCommissionSettings(commissionData.data);
        }
    }, [commissionData]);

    useEffect(() => {
        if (notificationData?.data) {
            setNotificationSettings(notificationData.data);
        }
    }, [notificationData]);

    const apiKeys = apiKeysData?.data || [];
    const adminRoles = rolesData?.data || [];

    const handleSavePlatformSettings = async () => {
        try {
            await updatePlatformSettings(platformSettings).unwrap();
            toast.success('Platform settings updated successfully');
        } catch (error) {
            toast.error('Failed to update platform settings');
        }
    };

    const handleSaveCommissionSettings = async () => {
        try {
            await updateCommissionSettings(commissionSettings).unwrap();
            toast.success('Commission settings updated successfully');
        } catch (error) {
            toast.error('Failed to update commission settings');
        }
    };

    const handleSaveNotificationSettings = async () => {
        try {
            await updateNotificationSettings(notificationSettings).unwrap();
            toast.success('Notification settings updated successfully');
        } catch (error) {
            toast.error('Failed to update notification settings');
        }
    };

    const handleCreateApiKey = async () => {
        try {
            await createApiKey(newApiKey).unwrap();
            toast.success('API key created successfully');
            dispatch(setShowApiModal(false));
            dispatch(resetNewApiKey());
        } catch (error) {
            toast.error('Failed to create API key');
        }
    };

    const handleDeleteApiKey = async (keyId) => {
        try {
            await deleteApiKey(keyId).unwrap();
            toast.success('API key deleted successfully');
        } catch (error) {
            toast.error('Failed to delete API key');
        }
    };

    const handleCreateRole = async (roleData) => {
        try {
            await createAdminRole(roleData).unwrap();
            toast.success('Role created successfully');
            dispatch(setShowRoleModal(false));
        } catch (error) {
            toast.error('Failed to create role');
        }
    };

    const handleUpdateRole = async (roleId, roleData) => {
        try {
            await updateAdminRole({ id: roleId, ...roleData }).unwrap();
            toast.success('Role updated successfully');
            dispatch(setEditingRole(null));
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    const handleDeleteRole = async (roleId) => {
        try {
            await deleteAdminRole(roleId).unwrap();
            toast.success('Role deleted successfully');
        } catch (error) {
            toast.error('Failed to delete role');
        }
    };

    const handleToggleApiKeyVisibility = (keyId) => {
        dispatch(toggleApiKeyVisibility(keyId));
    };

    const renderPlatformTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">General Platform Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Platform Name
                        </label>
                        <input
                            type="text"
                            value={platformSettings.platformName}
                            onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Default GST Rate (%)
                        </label>
                        <input
                            type="number"
                            value={platformSettings.defaultGstRate}
                            onChange={(e) => setPlatformSettings({ ...platformSettings, defaultGstRate: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Default Shipping Charges (₹)
                        </label>
                        <input
                            type="number"
                            value={platformSettings.defaultShippingCharges}
                            onChange={(e) => setPlatformSettings({ ...platformSettings, defaultShippingCharges: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Order Value (₹)
                        </label>
                        <input
                            type="number"
                            value={platformSettings.minimumOrderValue}
                            onChange={(e) => setPlatformSettings({ ...platformSettings, minimumOrderValue: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Products Per Seller
                        </label>
                        <input
                            type="number"
                            value={platformSettings.maxProductsPerSeller}
                            onChange={(e) => setPlatformSettings({ ...platformSettings, maxProductsPerSeller: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                        <div>
                            <div className="font-medium text-gray-900">Auto Product Approval</div>
                            <div className="text-sm text-gray-600">Automatically approve products that meet basic criteria</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={platformSettings.autoApprovalEnabled}
                                onChange={(e) => setPlatformSettings({ ...platformSettings, autoApprovalEnabled: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                        <div>
                            <div className="font-medium text-gray-900">Maintenance Mode</div>
                            <div className="text-sm text-gray-600">Put platform in maintenance mode for updates</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={platformSettings.maintenanceMode}
                                onChange={(e) => setPlatformSettings({ ...platformSettings, maintenanceMode: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSavePlatformSettings}
                        disabled={platformLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {platformLoading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderCommissionTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Commission & Fee Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amazon Commission (%)
                        </label>
                        <input
                            type="number"
                            value={commissionSettings.amazonCommission}
                            onChange={(e) => setCommissionSettings({ ...commissionSettings, amazonCommission: parseFloat(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Flipkart Commission (%)
                        </label>
                        <input
                            type="number"
                            value={commissionSettings.flipkartCommission}
                            onChange={(e) => setCommissionSettings({ ...commissionSettings, flipkartCommission: parseFloat(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meesho Commission (%)
                        </label>
                        <input
                            type="number"
                            value={commissionSettings.meeshoCommission}
                            onChange={(e) => setCommissionSettings({ ...commissionSettings, meeshoCommission: parseFloat(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Platform Fee (%)
                        </label>
                        <input
                            type="number"
                            value={commissionSettings.platformFee}
                            onChange={(e) => setCommissionSettings({ ...commissionSettings, platformFee: parseFloat(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Gateway Fee (%)
                        </label>
                        <input
                            type="number"
                            value={commissionSettings.paymentGatewayFee}
                            onChange={(e) => setCommissionSettings({ ...commissionSettings, paymentGatewayFee: parseFloat(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            GST on Commission (%)
                        </label>
                        <input
                            type="number"
                            value={commissionSettings.gstOnCommission}
                            onChange={(e) => setCommissionSettings({ ...commissionSettings, gstOnCommission: parseFloat(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSaveCommissionSettings}
                        disabled={commissionLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {commissionLoading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderApiTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">API Configuration</h3>
                    <button
                        onClick={() => dispatch(setShowApiModal(true))}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add API Key
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Platform</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">API Key</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Last Used</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiKeys.map((key) => (
                                <tr key={key.id} className="border-b border-gray-100">
                                    <td className="py-3 px-4">{key.platform}</td>
                                    <td className="py-3 px-4">{key.keyType}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm">
                                                {showApiKeys[key.id] ? key.key : key.maskedKey}
                                            </span>
                                            <button
                                                onClick={() => handleToggleApiKeyVisibility(key.id)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                {showApiKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            key.status === 'Active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {key.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{key.lastUsed}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleDeleteApiKey(key.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>

                <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                            <div>
                                <div className="font-medium text-gray-900 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {key === 'emailNotifications' && 'Send notifications via email'}
                                    {key === 'smsNotifications' && 'Send notifications via SMS'}
                                    {key === 'pushNotifications' && 'Send push notifications'}
                                    {key === 'orderAlerts' && 'Alerts for new orders'}
                                    {key === 'paymentAlerts' && 'Alerts for payment updates'}
                                    {key === 'kycAlerts' && 'Alerts for KYC submissions'}
                                    {key === 'systemAlerts' && 'System maintenance alerts'}
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={value}
                                    onChange={(e) => setNotificationSettings({ 
                                        ...notificationSettings, 
                                        [key]: e.target.checked 
                                    })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSaveNotificationSettings}
                        disabled={notificationLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {notificationLoading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderRolesTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Role Management</h3>
                    <button
                        onClick={() => dispatch(setShowRoleModal(true))}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Role
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {adminRoles.map((role) => (
                        <div key={role.id} className="border border-gray-200 rounded-md p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{role.name}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => dispatch(setEditingRole(role))}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRole(role.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="text-sm font-medium text-gray-700 mb-2">Permissions:</div>
                                <div className="flex flex-wrap gap-1">
                                    {role.permissions.map((permission, index) => (
                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            {permission}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{role.users}</span> users assigned
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSecurityTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
                
                <div className="space-y-6">
                    <div className="border border-gray-200 rounded-md p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to admin accounts</p>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            Enable 2FA
                        </button>
                    </div>

                    <div className="border border-gray-200 rounded-md p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Session Management</h4>
                        <p className="text-sm text-gray-600 mb-4">Manage active admin sessions</p>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            Revoke All Sessions
                        </button>
                    </div>

                    <div className="border border-gray-200 rounded-md p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Audit Logs</h4>
                        <p className="text-sm text-gray-600 mb-4">Download system audit logs</p>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            <Download className="w-4 h-4" />
                            Download Logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Super Admin Settings</h1>
                <p className="text-gray-600">Manage platform configuration and administrative settings</p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => dispatch(setActiveTab(tab.id))}
                                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'platform' && renderPlatformTab()}
            {activeTab === 'commission' && renderCommissionTab()}
            {activeTab === 'api' && renderApiTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'roles' && renderRolesTab()}
            {activeTab === 'security' && renderSecurityTab()}

            {/* API Key Modal */}
            {showApiModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add API Key</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                                <select
                                    value={newApiKey.platform}
                                    onChange={(e) => dispatch(setNewApiKey({ ...newApiKey, platform: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select Platform</option>
                                    <option value="Amazon">Amazon</option>
                                    <option value="Flipkart">Flipkart</option>
                                    <option value="Meesho">Meesho</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Key Type</label>
                                <select
                                    value={newApiKey.keyType}
                                    onChange={(e) => dispatch(setNewApiKey({ ...newApiKey, keyType: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select Type</option>
                                    <option value="API Key">API Key</option>
                                    <option value="OAuth Token">OAuth Token</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                                <input
                                    type="text"
                                    value={newApiKey.key}
                                    onChange={(e) => dispatch(setNewApiKey({ ...newApiKey, key: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Enter API key"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => dispatch(setShowApiModal(false))}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateApiKey}
                                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                            >
                                Add Key
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminSettings;