import React, { useState } from 'react';
import {
    User,
    Building,
    CreditCard,
    Shield,
    Bell,
    Save,
    Upload,
    Camera,
    Mail,
    Phone,
    MapPin,
    FileText,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff,
    Clock,
    Banknote
} from 'lucide-react';

const SupplierSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [notifications, setNotifications] = useState({
        orders: true,
        payments: true,
        approvals: true,
        marketing: false,
        security: true
    });

    // KYC Status
    const [kycStatus] = useState({
        gstCertificate: 'verified',
        panCard: 'verified',
        cancelledCheque: 'verified',
        bankDetails: 'verified',
        overall: 'complete'
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'business', label: 'Business Info', icon: Building },
        { id: 'kyc', label: 'KYC Verification', icon: FileText },
        { id: 'bank', label: 'Bank Details', icon: Banknote },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield }
    ];

    const getKycStatusColor = (status) => {
        switch (status) {
            case 'verified': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'missing': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getKycStatusIcon = (status) => {
        switch (status) {
            case 'verified': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'missing': return <AlertCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const renderProfileTab = () => (
        <div className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <button className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
                    <p className="text-gray-600 text-sm">Update your profile photo</p>
                    <button className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                        Change Photo
                    </button>
                </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                    </label>
                    <input
                        type="text"
                        defaultValue="Rajesh"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                    </label>
                    <input
                        type="text"
                        defaultValue="Kumar"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            defaultValue="rajesh.kumar@supplier.com"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="tel"
                            defaultValue="+91 98765 43210"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                        defaultValue="123 Industrial Area, Sector 25, Gurgaon, Haryana 122001"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        rows={3}
                    />
                </div>
            </div>
        </div>
    );

    const renderBusinessTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                    </label>
                    <input
                        type="text"
                        defaultValue="Kumar Electronics Manufacturing"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                        <option>Manufacturer</option>
                        <option>Wholesaler</option>
                        <option>Distributor</option>
                        <option>Private Limited</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        GST Number
                    </label>
                    <input
                        type="text"
                        defaultValue="06AAAAA0000A1Z5"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        PAN Number
                    </label>
                    <input
                        type="text"
                        defaultValue="ABCDE1234F"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address
                </label>
                <textarea
                    defaultValue="Plot No. 456, Industrial Area Phase-II, Sector 25, Gurgaon, Haryana 122001"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years in Business
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                        <option>1-2 years</option>
                        <option>3-5 years</option>
                        <option>6-10 years</option>
                        <option>10+ years</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Annual Turnover
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                        <option>Under ₹1 Crore</option>
                        <option>₹1-5 Crores</option>
                        <option>₹5-10 Crores</option>
                        <option>Above ₹10 Crores</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description
                </label>
                <textarea
                    defaultValue="We are a leading manufacturer of consumer electronics and accessories with over 10 years of experience in the industry."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={4}
                />
            </div>
        </div>
    );

    const renderKycTab = () => (
        <div className="space-y-6">
            {/* KYC Status Overview */}
            <div className="p-6 rounded-2xl border-2 bg-green-50 border-green-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">KYC Verification Status</h3>
                            <p className="text-green-700 text-sm">Your KYC is complete and verified</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Verified
                    </div>
                </div>
            </div>

            {/* Document Status */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Document Status</h3>

                {/* GST Certificate */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <FileText className="w-6 h-6 text-gray-400 mr-3" />
                            <div>
                                <h4 className="font-semibold text-gray-900">GST Certificate</h4>
                                <p className="text-sm text-gray-600">Valid GST registration certificate</p>
                            </div>
                        </div>
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getKycStatusColor(kycStatus.gstCertificate)}`}>
                            {getKycStatusIcon(kycStatus.gstCertificate)}
                            <span className="ml-2 capitalize">{kycStatus.gstCertificate}</span>
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                <span className="text-green-800 font-medium">GST_Certificate_06AAAAA0000A1Z5.pdf</span>
                            </div>
                            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                                View Document
                            </button>
                        </div>
                    </div>
                </div>

                {/* PAN Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <FileText className="w-6 h-6 text-gray-400 mr-3" />
                            <div>
                                <h4 className="font-semibold text-gray-900">PAN Card</h4>
                                <p className="text-sm text-gray-600">Company PAN card document</p>
                            </div>
                        </div>
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getKycStatusColor(kycStatus.panCard)}`}>
                            {getKycStatusIcon(kycStatus.panCard)}
                            <span className="ml-2 capitalize">{kycStatus.panCard}</span>
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                <span className="text-green-800 font-medium">PAN_Card_ABCDE1234F.jpg</span>
                            </div>
                            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                                View Document
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cancelled Cheque */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <FileText className="w-6 h-6 text-gray-400 mr-3" />
                            <div>
                                <h4 className="font-semibold text-gray-900">Cancelled Cheque</h4>
                                <p className="text-sm text-gray-600">Bank account verification document</p>
                            </div>
                        </div>
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getKycStatusColor(kycStatus.cancelledCheque)}`}>
                            {getKycStatusIcon(kycStatus.cancelledCheque)}
                            <span className="ml-2 capitalize">{kycStatus.cancelledCheque}</span>
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                <span className="text-green-800 font-medium">Cancelled_Cheque_123456.jpg</span>
                            </div>
                            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                                View Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderBankTab = () => (
        <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Bank Account Verified</h3>
                        <p className="text-green-700 text-sm">Your bank account is verified and ready for payouts</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Holder Name
                    </label>
                    <input
                        type="text"
                        defaultValue="Kumar Electronics Manufacturing"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        disabled
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name
                    </label>
                    <input
                        type="text"
                        defaultValue="State Bank of India"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        disabled
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number
                    </label>
                    <input
                        type="text"
                        defaultValue="****1234"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        disabled
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        IFSC Code
                    </label>
                    <input
                        type="text"
                        defaultValue="SBIN0001234"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        disabled
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Address
                </label>
                <textarea
                    defaultValue="SBI Branch, Sector 14, Gurgaon, Haryana 122001"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={2}
                    disabled
                />
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <div className="font-medium">Bank Account Information</div>
                        <div>This account will be used for all payout transactions. Contact support to update bank details.</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <div className="font-medium text-gray-900 capitalize">
                                    {key === 'orders' ? 'New Order Notifications' :
                                        key === 'payments' ? 'Payment & Payout Updates' :
                                            key === 'approvals' ? 'Product Approval Updates' :
                                                key === 'marketing' ? 'Marketing & Promotions' :
                                                    'Security Alerts'}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {key === 'orders' ? 'Get notified when sellers place new orders' :
                                        key === 'payments' ? 'Receive payment and withdrawal updates' :
                                            key === 'approvals' ? 'Product approval/rejection notifications' :
                                                key === 'marketing' ? 'Tips, promotions, and platform updates' :
                                                    'Account security and login alerts'}
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={value}
                                    onChange={(e) => setNotifications({
                                        ...notifications,
                                        [key]: e.target.checked
                                    })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSecurityTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>

                {/* Change Password */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Change Password</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="Confirm new password"
                            />
                        </div>

                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                            Update Password
                        </button>
                    </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                    <p className="text-sm text-gray-500">
                        When enabled, you'll need to enter a code from your phone in addition to your password
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile & KYC Settings</h1>
                <p className="text-gray-600 mt-1">
                    Manage your profile, business information, and verification documents
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <nav className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === tab.id
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5 mr-3" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        {activeTab === 'profile' && renderProfileTab()}
                        {activeTab === 'business' && renderBusinessTab()}
                        {activeTab === 'kyc' && renderKycTab()}
                        {activeTab === 'bank' && renderBankTab()}
                        {activeTab === 'notifications' && renderNotificationsTab()}
                        {activeTab === 'security' && renderSecurityTab()}

                        {/* Save Button */}
                        {(activeTab === 'profile' || activeTab === 'business' || activeTab === 'notifications') && (
                            <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
                                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-colors">
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierSettings;