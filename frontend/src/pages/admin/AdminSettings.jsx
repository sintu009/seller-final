import React, { useState } from 'react';
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
    Store,
    ChevronDown,
    X
} from 'lucide-react';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('platform');
    const [showApiModal, setShowApiModal] = useState(false);
    const [showStoreModal, setShowStoreModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState('');
    const [showStoreDropdown, setShowStoreDropdown] = useState(false);

    const tabs = [
        { id: 'platform', label: 'Platform Settings', icon: Globe },
        { id: 'commission', label: 'Commission & Fees', icon: DollarSign },
        { id: 'api', label: 'API Configuration', icon: Key },
        { id: 'stores', label: 'Store Connections', icon: Store },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'roles', label: 'Role Management', icon: Users },
        { id: 'security', label: 'Security', icon: Shield }
    ];

    const storeOptions = [
        { id: 'amazon', name: 'Amazon', logo: '🛒' },
        { id: 'flipkart', name: 'Flipkart', logo: '🛍️' },
        { id: 'meesho', name: 'Meesho', logo: '🏪' }
    ];

    const connectedStores = [
        {
            id: 1,
            platform: 'Amazon',
            storeName: 'My Amazon Store',
            storeUrl: 'my-store.amazon.com',
            status: 'Connected',
            lastSync: '2024-01-15 10:30 AM'
        },
        {
            id: 2,
            platform: 'Flipkart',
            storeName: 'My Flipkart Store',
            storeUrl: 'my-store.flipkart.com',
            status: 'Error',
            lastSync: '2024-01-14 02:15 PM'
        }
    ];

    // Mock platform settings
    const [platformSettings, setPlatformSettings] = useState({
        platformName: 'MarketPlace Platform',
        defaultGstRate: 18,
        defaultShippingCharges: 60,
        minimumOrderValue: 100,
        maxProductsPerSeller: 1000,
        autoApprovalEnabled: false,
        maintenanceMode: false
    });

    // Mock commission settings
    const [commissionSettings, setCommissionSettings] = useState({
        amazonCommission: 15,
        flipkartCommission: 12,
        meeshoCommission: 10,
        platformFee: 2,
        paymentGatewayFee: 2.5,
        gstOnCommission: 18
    });

    // Mock API keys
    const apiKeys = [
        {
            id: 1,
            platform: 'Amazon',
            keyType: 'API Key',
            status: 'Active',
            lastUsed: '2024-01-15',
            maskedKey: 'AMZN**********************XYZ'
        },
        {
            id: 2,
            platform: 'Flipkart',
            keyType: 'OAuth Token',
            status: 'Active',
            lastUsed: '2024-01-14',
            maskedKey: 'FLKT**********************ABC'
        },
        {
            id: 3,
            platform: 'Meesho',
            keyType: 'API Key',
            status: 'Inactive',
            lastUsed: '2024-01-10',
            maskedKey: 'MESH**********************DEF'
        }
    ];

    // Mock notification settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        orderAlerts: true,
        paymentAlerts: true,
        kycAlerts: true,
        systemAlerts: true
    });

    // Mock admin roles
    const adminRoles = [
        {
            id: 1,
            name: 'Super Admin',
            permissions: ['All Permissions'],
            users: 2,
            description: 'Full access to all platform features'
        },
        {
            id: 2,
            name: 'Finance Manager',
            permissions: ['Finance', 'Payments', 'Reports'],
            users: 3,
            description: 'Manage financial operations and reports'
        },
        {
            id: 3,
            name: 'Support Manager',
            permissions: ['Support', 'Users', 'KYC'],
            users: 5,
            description: 'Handle customer support and user management'
        },
        {
            id: 4,
            name: 'Product Manager',
            permissions: ['Products', 'Suppliers', 'Catalog'],
            users: 2,
            description: 'Manage product catalog and supplier relations'
        }
    ];

    const handleSavePlatformSettings = () => {
        console.log('Saving platform settings:', platformSettings);
    };

    const handleSaveCommissionSettings = () => {
        console.log('Saving commission settings:', commissionSettings);
    };

    const handleSaveNotificationSettings = () => {
        console.log('Saving notification settings:', notificationSettings);
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
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-md border border-red-200">
                        <div className="flex items-center">
                            <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                            <div>
                                <div className="font-medium text-red-900">Maintenance Mode</div>
                                <div className="text-sm text-red-700">Temporarily disable platform access for maintenance</div>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={platformSettings.maintenanceMode}
                                onChange={(e) => setPlatformSettings({ ...platformSettings, maintenanceMode: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
                    <button
                        onClick={handleSavePlatformSettings}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-semibold flex items-center transition-colors"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        Save Platform Settings
                    </button>
                </div>
            </div>
        </div>
    );

    const renderCommissionTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Commission & Fee Structure</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amazon Commission (%)
                        </label>
                        <input
                            type="number"
                            step="0.1"
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
                            step="0.1"
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
                            step="0.1"
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
                            step="0.1"
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
                            step="0.1"
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
                            onChange={(e) => setCommissionSettings({ ...commissionSettings, gstOnCommission: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
                    <button
                        onClick={handleSaveCommissionSettings}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-semibold flex items-center transition-colors"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        Save Commission Settings
                    </button>
                </div>
            </div>
        </div>
    );

    const renderApiTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">API Configuration</h3>
                    <button
                        onClick={() => setShowApiModal(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add API Key
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Platform</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Key Type</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">API Key</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Used</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {apiKeys.map((key) => (
                                <tr key={key.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 font-medium text-gray-900">{key.platform}</td>
                                    <td className="py-3 px-4 text-gray-600">{key.keyType}</td>
                                    <td className="py-3 px-4">
                                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                                            {key.maskedKey}
                                        </code>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${key.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {key.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{key.lastUsed}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-mdg transition-colors">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-mdg transition-colors">
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

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>

                <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                            <div>
                                <div className="font-medium text-gray-900 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {key === 'emailNotifications' ? 'Send notifications via email' :
                                        key === 'smsNotifications' ? 'Send notifications via SMS' :
                                            key === 'pushNotifications' ? 'Send push notifications' :
                                                key === 'orderAlerts' ? 'Alert for new orders and status changes' :
                                                    key === 'paymentAlerts' ? 'Alert for payment and payout updates' :
                                                        key === 'kycAlerts' ? 'Alert for KYC submissions and approvals' :
                                                            'Alert for system maintenance and updates'}
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
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
                    <button
                        onClick={handleSaveNotificationSettings}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-semibold flex items-center transition-colors"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        Save Notification Settings
                    </button>
                </div>
            </div>
        </div>
    );

    const renderRolesTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Admin Role Management</h3>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Role
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {adminRoles.map((role) => (
                        <div key={role.id} className="border border-gray-200 rounded-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">{role.name}</h4>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-mdg transition-colors">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    {role.name !== 'Super Admin' && (
                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-mdg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-600 mb-4">{role.description}</p>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-gray-600">Permissions:</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {role.permissions.map((permission, index) => (
                                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                                {permission}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Active Users: {role.users}</span>
                                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                                        Manage Users
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStoresTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Store Connections</h3>
                    <div className="relative">
                        <button
                            onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
                        >
                            <Store className="w-4 h-4 mr-2" />
                            Connect Store
                            <ChevronDown className="w-4 h-4 ml-2" />
                        </button>
                        
                        {showStoreDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                {storeOptions.map((store) => (
                                    <button
                                        key={store.id}
                                        onClick={() => {
                                            setSelectedStore(store.name);
                                            setShowStoreModal(true);
                                            setShowStoreDropdown(false);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center transition-colors"
                                    >
                                        <span className="text-xl mr-3">{store.logo}</span>
                                        {store.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Platform</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Store Name</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Store URL</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Sync</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {connectedStores.map((store) => (
                                <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 font-medium text-gray-900">{store.platform}</td>
                                    <td className="py-3 px-4 text-gray-600">{store.storeName}</td>
                                    <td className="py-3 px-4 text-gray-600">{store.storeUrl}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                            store.status === 'Connected' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {store.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{store.lastSync}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
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

    const renderSecurityTab = () => (
        <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Settings</h3>
            <p className="text-gray-600">Configure security policies, password requirements, and access controls</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
                    <p className="text-gray-600 mt-1">Configure platform-wide settings and preferences</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Export Config
                    </button>
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Config
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex space-x-1 mb-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'platform' && renderPlatformTab()}
            {activeTab === 'commission' && renderCommissionTab()}
            {activeTab === 'api' && renderApiTab()}
            {activeTab === 'stores' && renderStoresTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'roles' && renderRolesTab()}
            {activeTab === 'security' && renderSecurityTab()}

            {/* API Modal */}
            {showApiModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md p-8 max-w-md w-full mx-4">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Key className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Add API Key</h3>
                            <p className="text-gray-600">Configure API integration for e-commerce platforms</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                                <select className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                    <option>Select Platform</option>
                                    <option>Amazon</option>
                                    <option>Flipkart</option>
                                    <option>Meesho</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter API key"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setShowApiModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-semibold transition-colors">
                                    Add API Key
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Store Connection Modal */}
            {showStoreModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                                    <Store className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Connect {selectedStore} Store</h3>
                                    <p className="text-gray-600">Enter your store credentials to connect</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowStoreModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Store Information */}
                            <div className="bg-gray-50 p-4 rounded-md">
                                <h4 className="font-semibold text-gray-900 mb-3">Store Information</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Store Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="My Store"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Store URL
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={selectedStore === 'Amazon' ? 'your-store.amazon.com' : 
                                                       selectedStore === 'Flipkart' ? 'your-store.flipkart.com' :
                                                       'your-store.meesho.com'}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            You can enter your .{selectedStore.toLowerCase()}.com domain or the full admin URL
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Store Access Credentials */}
                            <div className="bg-gray-50 p-4 rounded-md">
                                <h4 className="font-semibold text-gray-900 mb-3">Store Access Credentials</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Access Token
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="shpat_xxxxx..."
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Admin API Key
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Enter Admin API Key"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Admin API Secret
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Enter Admin API Secret"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setShowStoreModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-semibold transition-colors">
                                    Connect Store
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;