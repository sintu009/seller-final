import React, { useState } from 'react';
import { useGetAllKYCQuery, useApproveKYCMutation, useRejectKYCMutation } from '../../store/slices/apiSlice';
import {
    Search,
    Filter,
    Download,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    Eye,
    AlertTriangle,
    User,
    Building,
    Mail,
    Phone,
    Crown
} from 'lucide-react';

const KYCCompliance = () => {
    const [mainTab, setMainTab] = useState('seller');
    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedPlans, setSelectedPlans] = useState({});

    const { data: kycData, isLoading: loading, refetch } = useGetAllKYCQuery();
    const [approveKYC] = useApproveKYCMutation();
    const [rejectKYC] = useRejectKYCMutation();

    const kycSubmissions = kycData?.data || [];
    
    // Debug: Log the first submission to see data structure
    if (kycSubmissions.length > 0) {
        console.log('First submission data:', kycSubmissions[0]);
    }

    const planOptions = [

        {
            id: 'starter',
            name: 'Starter',
            color: 'bg-blue-100 text-blue-800',
            features: ['• Amazon account setup & GST/brand registry help',
                '• 10 optimized product listings (keywords + images)',
                '• Basic ad setup (1–2 campaigns)',
                '• Dashboard: order tracking + profit calculator (basic)',
                '• Email support']
        },
        {
            id: 'growth',
            name: 'Growth',
            color: 'bg-green-100 text-green-800',
            features: ['• 30 optimized listings + A+ content',
                '• Weekly PPC optimization + competitor & keyword tracking',
                '• Inventory & returns tracking + wallet recharge alerts',
                '• Automated profit breakdown (fees, ads, shipping, COGS)',
                '• Dedicated account manager (WhatsApp support)',
                '• Sales & performance dashboard',
                '• replace the things in above object ']
        },
        {
            id: 'scale',
            name: 'Scale',
            color: 'bg-purple-100 text-purple-800',
            features: [
                '• Unlimited listings with A+ content refresh',
                '• Advanced PPC (bulk campaigns, auto-bidding, TACoS)',
                '• Multi-channel sync (Flipkart, Meesho, Shopify)',
                '• International expansion support with review & feedback management',
                '• Custom analytics dashboard with advanced alerts (low stock, suppressed listings, ACoS)',
                '• Dedicated manager, priority support & quarterly strategy calls'
            ]
        }
    ];

    const mainTabs = [
        { id: 'seller', label: 'Sellers', count: kycSubmissions.filter(k => k.role === 'seller').length },
        { id: 'supplier', label: 'Suppliers', count: kycSubmissions.filter(k => k.role === 'supplier').length }
    ];

    const getCurrentTypeSubmissions = () => {
        return kycSubmissions.filter(k => k.role === mainTab);
    };

    const currentSubmissions = getCurrentTypeSubmissions();

    const tabs = [
        { id: 'pending', label: 'Pending Review', count: currentSubmissions.filter(k => k.kycStatus === 'pending').length },
        { id: 'approved', label: 'Verified', count: currentSubmissions.filter(k => k.kycStatus === 'approved').length },
        { id: 'rejected', label: 'Rejected', count: currentSubmissions.filter(k => k.kycStatus === 'rejected').length },
        { id: 'all', label: 'All Submissions', count: currentSubmissions.length }
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredSubmissions = kycSubmissions.filter(submission => {
        const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMainTab = submission.role === mainTab;
        const matchesTab = activeTab === 'all' || submission.kycStatus === activeTab;

        return matchesSearch && matchesMainTab && matchesTab;
    });

    const handleApprove = async (id) => {
        const selectedPlan = selectedPlans[id];
        if (!selectedPlan) {
            alert('Please select a plan before approving');
            return;
        }

        try {
            await approveKYC({ id, plan: selectedPlan }).unwrap();
            setSelectedPlans(prev => {
                const newPlans = { ...prev };
                delete newPlans[id];
                return newPlans;
            });
            alert('KYC approved successfully with plan: ' + selectedPlan);
            await refetch();
        } catch (error) {
            console.error('Error approving KYC:', error);
            alert(error.data?.message || 'Failed to approve KYC');
        }
    };

    const handlePlanSelect = (userId, plan) => {
        setSelectedPlans(prev => ({ ...prev, [userId]: plan }));
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        try {
            await rejectKYC({ id: selectedUserId, reason: rejectionReason }).unwrap();
            setShowRejectModal(false);
            setRejectionReason('');
            setSelectedUserId(null);
            alert('KYC rejected successfully');
        } catch (error) {
            console.error('Error rejecting KYC:', error);
            alert(error.data?.message || 'Failed to reject KYC');
        }
    };

    const openRejectModal = (id) => {
        setSelectedUserId(id);
        setShowRejectModal(true);
    };

    const handleViewDocument = (filepath) => {
        if (filepath) {
            window.open(`http://localhost:5000/${filepath}`, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">KYC & Compliance</h1>
                        <p className="text-gray-600 mt-1">Review and manage KYC documents from sellers and suppliers</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-600 mb-1">Total Submissions</div>
                        <div className="text-2xl font-bold text-gray-900">{kycSubmissions.length}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-600 mb-1">Pending Review</div>
                        <div className="text-2xl font-bold text-yellow-600">
                            {kycSubmissions.filter(k => k.kycStatus === 'pending').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-600 mb-1">Verified</div>
                        <div className="text-2xl font-bold text-green-600">
                            {kycSubmissions.filter(k => k.kycStatus === 'approved').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-600 mb-1">Rejected</div>
                        <div className="text-2xl font-bold text-red-600">
                            {kycSubmissions.filter(k => k.kycStatus === 'rejected').length}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex space-x-1">
                        {mainTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setMainTab(tab.id);
                                    setActiveTab('pending');
                                }}
                                className={`px-6 py-3 rounded-xl font-semibold transition-colors flex items-center ${mainTab === tab.id
                                    ? 'bg-orange-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${mainTab === tab.id ? 'bg-orange-700' : 'bg-gray-200'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

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

                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center">
                                <Filter className="w-4 h-4 mr-2" />
                                More Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredSubmissions.map((submission) => (
                        <div key={submission._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-3 rounded-xl ${submission.role === 'seller' ? 'bg-blue-100' : 'bg-emerald-100'
                                        }`}>
                                        {submission.role === 'seller' ? (
                                            <User className="w-6 h-6 text-blue-600" />
                                        ) : (
                                            <Building className="w-6 h-6 text-emerald-600" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{submission.name}</h3>
                                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${submission.role === 'seller' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                                                }`}>
                                                {submission.role}
                                            </span>
                                            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(submission.kycStatus)}`}>
                                                {getStatusIcon(submission.kycStatus)}
                                                <span className="ml-2 capitalize">{submission.kycStatus}</span>
                                            </span>
                                            {submission.kycStatus === 'approved' && submission.role === 'seller' && submission.plan && (
                                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${submission.plan === 'starter' ? 'bg-blue-100 text-blue-800' :
                                                    submission.plan === 'growth' ? 'bg-green-100 text-green-800' :
                                                        submission.plan === 'scale' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    <Crown className="w-3 h-3 mr-1" />
                                                    {submission.plan.charAt(0).toUpperCase() + submission.plan.slice(1)} Plan
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {submission.email}
                                            </div>
                                            <div className="flex items-center">
                                                <Phone className="w-4 h-4 mr-2" />
                                                {submission.phone || submission.phoneNumber || 'N/A'}
                                            </div>
                                            <div>Registered: {new Date(submission.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {submission.kycStatus === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(submission._id)}
                                                disabled={submission.role === 'seller' && !selectedPlans[submission._id]}
                                                className={`px-4 py-2 rounded-xl transition-colors flex items-center ${submission.role === 'seller' && !selectedPlans[submission._id]
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                    }`}
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => openRejectModal(submission._id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {submission.kycStatus === 'approved' && submission.role === 'seller' && (
                                <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Crown className="w-5 h-5 text-green-600 mr-2" />
                                            <h4 className="font-semibold text-green-800">Assigned Plan</h4>
                                        </div>
                                        {submission.plan ? (
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${submission.plan === 'starter' ? 'bg-blue-100 text-blue-800' :
                                                submission.plan === 'growth' ? 'bg-green-100 text-green-800' :
                                                    submission.plan === 'scale' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                <Crown className="w-3 h-3 mr-1" />
                                                {submission.plan.charAt(0).toUpperCase() + submission.plan.slice(1)} Plan
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-500">
                                                No plan assigned
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {submission.kycStatus === 'pending' && submission.role === 'seller' && (
                                <div className="mb-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <Crown className="w-5 h-5 text-orange-600 mr-2" />
                                            <h4 className="font-semibold text-orange-800">Select Plan for Seller</h4>
                                        </div>
                                        {selectedPlans[submission._id] && (
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-600 mr-2">Selected:</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedPlans[submission._id] === 'starter' ? 'bg-blue-100 text-blue-800' :
                                                    selectedPlans[submission._id] === 'growth' ? 'bg-green-100 text-green-800' :
                                                        selectedPlans[submission._id] === 'scale' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    <Crown className="w-3 h-3 mr-1" />
                                                    {selectedPlans[submission._id].charAt(0).toUpperCase() + selectedPlans[submission._id].slice(1)} Plan
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {planOptions.map((plan) => (
                                            <button
                                                key={plan.id}
                                                onClick={() => handlePlanSelect(submission._id, plan.id)}
                                                className={`p-3 rounded-xl border-2 transition-all text-left ${selectedPlans[submission._id] === plan.id
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${plan.color}`}>
                                                    {plan.name}
                                                </div>
                                                <div className="text-xs text-gray-600 space-y-1">
                                                    {plan.features.map((feature, index) => (
                                                        <div key={index}>{feature}</div>
                                                    ))}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Business Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Business Name:</span>
                                        <div className="font-medium text-gray-900">{submission.kycDocuments?.businessName || submission.businessName || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">GST Number:</span>
                                        <div className="font-mono text-gray-900">{submission.kycDocuments?.taxId || submission.gstNumber || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">PAN Number:</span>
                                        <div className="font-mono text-gray-900">{submission.kycDocuments?.businessRegistration || submission.panNumber || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            {submission.kycDocuments && Object.keys(submission.kycDocuments).length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">Submitted Documents</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {submission.kycDocuments?.idProof && (
                                            <div className="border border-gray-200 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                                                        <span className="font-medium text-gray-900">GST Certificate</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleViewDocument(submission.kycDocuments.idProof)}
                                                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Document
                                                </button>
                                            </div>
                                        )}
                                        {submission.kycDocuments?.addressProof && (
                                            <div className="border border-gray-200 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                                                        <span className="font-medium text-gray-900">PAN Card</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleViewDocument(submission.kycDocuments.addressProof)}
                                                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Document
                                                </button>
                                            </div>
                                        )}
                                        {submission.kycDocuments?.bankDetails?.cancelledChequePath && (
                                            <div className="border border-gray-200 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                                                        <span className="font-medium text-gray-900">Cancelled Cheque</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleViewDocument(submission.kycDocuments.bankDetails.cancelledChequePath)}
                                                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Document
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {submission.kycStatus === 'rejected' && submission.kycRejectionReason && (
                                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="flex items-start">
                                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                                        <div>
                                            <div className="font-medium text-red-800 mb-1">Rejection Reason</div>
                                            <div className="text-red-700 text-sm">{submission.kycRejectionReason}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredSubmissions.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <div className="text-gray-500 text-lg mb-2">No KYC submissions found</div>
                            <p className="text-gray-400">Try adjusting your search filters</p>
                        </div>
                    )}
                </div>
            </div>

            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Reject KYC Application</h3>
                        <p className="text-gray-600 mb-4">Please provide a reason for rejecting this KYC application:</p>
                        <textarea
                            className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            rows="4"
                            placeholder="Enter rejection reason..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        ></textarea>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                    setSelectedUserId(null);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KYCCompliance;
