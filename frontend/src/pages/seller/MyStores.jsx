import React, { useState } from 'react';
import { Plus, ChevronDown, Store, X, ShoppingBag, Package, ShoppingCart, ExternalLink, Settings, Trash2 } from 'lucide-react';

const MyStores = () => {
    const [showStoreDropdown, setShowStoreDropdown] = useState(false);
    const [showStoreModal, setShowStoreModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState('');
    const [connectedStores, setConnectedStores] = useState([
        {
            id: 1,
            platform: 'Shopify',
            storeName: 'Shopillion',
            storeUrl: 'vqs57x-wq.myshopify.com',
            status: 'Connected',
            connectedDate: 'Aug 24, 2025, 11:00 PM',
            updatedDate: 'Aug 24, 2025, 11:00 PM',
            source: 'seller_connections',
            icon: Store
        }
    ]);
    const [formData, setFormData] = useState({
        storeName: '',
        storeUrl: '',
        accessToken: '',
        apiKey: '',
        apiSecret: ''
    });

    const handleConnectStore = () => {
        if (formData.storeName && formData.storeUrl) {
            const selectedStoreOption = storeOptions.find(store => store.name === selectedStore);
            const newStore = {
                id: Date.now(),
                platform: selectedStore,
                storeName: formData.storeName,
                storeUrl: formData.storeUrl,
                status: 'Connected',
                connectedDate: new Date().toLocaleString(),
                updatedDate: new Date().toLocaleString(),
                source: 'seller_connections',
                icon: selectedStoreOption?.icon || Store
            };
            
            setConnectedStores([...connectedStores, newStore]);
            setFormData({ storeName: '', storeUrl: '', accessToken: '', apiKey: '', apiSecret: '' });
            setShowStoreModal(false);
        }
    };

    const handleDeleteStore = (storeId) => {
        setConnectedStores(connectedStores.filter(store => store.id !== storeId));
    };

    const storeOptions = [
        { id: 'amazon', name: 'Amazon', icon: ShoppingBag },
        { id: 'flipkart', name: 'Flipkart', icon: Package },
        { id: 'meesho', name: 'Meesho', icon: ShoppingCart }
    ];



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Stores
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your connected Shopify stores
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <button 
                            onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold flex items-center transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
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
                                        <store.icon className="w-5 h-5 mr-3 text-gray-600" />
                                        {store.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
                <div className="flex items-center ">

                    <span className="text-m text-gray-500">
                        Showing stores for user:
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                        SainathPhondke
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {connectedStores.map((store) => (
                    <div key={store.id} className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                                    <store.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{store.storeName}</h3>
                                </div>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                                {store.platform === 'Shopify' ? 'direct' : 'api'}
                            </button>
                        </div>

                        <div className="text-gray-600 text-sm mb-4">
                            {store.storeUrl}
                        </div>

                        <div className="text-sm text-gray-500 space-y-1 mb-6">
                            <div>Connected: {store.connectedDate}</div>
                            <div>Updated: {store.updatedDate}</div>
                            <div>Source: {store.source}</div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                                <ExternalLink className="w-4 h-4" />
                                <span className="font-medium text-gray-700">Visit</span>
                            </button>

                            <button className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                                <Settings className="w-4 h-4" />
                                <span className="font-medium text-gray-700">Manage</span>
                            </button>

                            <button 
                                onClick={() => handleDeleteStore(store.id)}
                                className="p-3 border border-gray-200 rounded-md hover:bg-red-50 hover:border-red-200 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Stores</div>
                    <div className="text-2xl font-bold text-gray-900">5</div>
                    {/* <div className="text-xs text-gray-500 mt-1">All categories</div> */}
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Direct Connections</div>
                    <div className="text-2xl font-bold text-green-600">56
                    </div>

                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">OAuth Connections</div>
                    <div className="text-2xl font-bold text-red-600"> 0

                    </div>
                    {/* <div className="text-xs text-gray-500 mt-1">Need sync</div> */}
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Legacy Connections</div>
                    <div className="text-2xl font-bold text-blue-600"> 0 </div>
                    {/* <div className="text-xs text-gray-500 mt-1">For bulk actions</div> */}
                </div>
            </div>

            {/* Store Connection Modal */}
            {showStoreModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <Store className="w-6 h-6 text-blue-600" />
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
                                            value={formData.storeName}
                                            onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                            value={formData.storeUrl}
                                            onChange={(e) => setFormData({...formData, storeUrl: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            You can enter your .{selectedStore?.toLowerCase()}.com domain or the full admin URL
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
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Admin API Key
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Enter Admin API Key"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Admin API Secret
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Enter Admin API Secret"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                <button 
                                    onClick={handleConnectStore}
                                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors"
                                >
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

export default MyStores;