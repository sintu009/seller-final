import React, { useState } from 'react';
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
    Phone
} from 'lucide-react';

const KYCCompliance = () => {
    const [mainTab, setMainTab] = useState('seller');
    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock KYC data
    const kycSubmissions = [
        {
            id: 1,
            type: 'Seller',
            name: 'TechStore India',
            email: 'contact@techstore.com',
            phone: '+91 98765 43210',
            submittedDate: '2024-01-15',
            status: 'Pending',
            documents: {
                gst: { status: 'Submitted', filename: 'GST_Certificate.pdf' },
                pan: { status: 'Submitted', filename: 'PAN_Card.jpg' },
                cheque: { status: 'Submitted', filename: 'Cancelled_Cheque.jpg' }
            },
            businessDetails: {
                businessName: 'TechStore India Pvt Ltd',
                gstNumber: '22AAAAA0000A1Z5',
                panNumber: 'ABCTY1234D'
            }
        },
        {
            id: 2,
            type: 'Supplier',
            name: 'Kumar Electronics Manufacturing',
            email: 'info@kumarelectronics.com',
            phone: '+91 98765 54321',
            submittedDate: '2024-01-12',
            status: 'Verified',
            documents: {
                gst: { status: 'Verified', filename: 'GST_Certificate.pdf' },
                pan: { status: 'Verified', filename: 'PAN_Card.jpg' },
                cheque: { status: 'Verified', filename: 'Cancelled_Cheque.jpg' }
            },
            businessDetails: {
                businessName: 'Kumar Electronics Manufacturing Ltd',
                gstNumber: '06AAAAA0000A1Z5',
                panNumber: 'ABCDE1234F'
            }
        },
        {
            id: 3,
            type: 'Seller',
            name: 'ElectroMart',
            email: 'orders@electromart.com',
            phone: '+91 98765 43211',
            submittedDate: '2024-01-10',
            status: 'Rejected',
            documents: {
                gst: { status: 'Rejected', filename: 'GST_Certificate.pdf', reason: 'Document not clear' },
                pan: { status: 'Verified', filename: 'PAN_Card.jpg' },
                cheque: { status: 'Rejected', filename: 'Cancelled_Cheque.jpg', reason: 'Bank details not matching' }
            },
            businessDetails: {
                businessName: 'ElectroMart Solutions',
                gstNumber: '27BBBBB0000B2Z6',
                panNumber: 'DEFGH5678I'
            },
            rejectionReason: 'GST certificate is not clear and bank details do not match with business information.'
        }
    ];

    const mainTabs = [
        { id: 'seller', label: 'Sellers', count: kycSubmissions.filter(k => k.type === 'Seller').length },
        { id: 'supplier', label: 'Suppliers', count: kycSubmissions.filter(k => k.type === 'Supplier').length }
    ];

    const getCurrentTypeSubmissions = () => {
        return kycSubmissions.filter(k =>
            k.type === (mainTab === 'seller' ? 'Seller' : 'Supplier')
        );
    };

    const currentSubmissions = getCurrentTypeSubmissions();

    const tabs = [
        { id: 'pending', label: 'Pending Review', count: currentSubmissions.filter(k => k.status === 'Pending').length },
        { id: 'verified', label: 'Verified', count: currentSubmissions.filter(k => k.status === 'Verified').length },
        { id: 'rejected', label: 'Rejected', count: currentSubmissions.filter(k => k.status === 'Rejected').length },
        { id: 'all', label: 'All Submissions', count: currentSubmissions.length }
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Verified': return <CheckCircle className="w-4 h-4" />;
            case 'Pending': return <Clock className="w-4 h-4" />;
            case 'Rejected': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Verified': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDocumentStatusColor = (status) => {
        switch (status) {
            case 'Verified': return 'text-green-600';
            case 'Submitted': return 'text-yellow-600';
            case 'Rejected': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const filteredSubmissions = kycSubmissions.filter(submission => {
        const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMainTab = submission.type === (mainTab === 'seller' ? 'Seller' : 'Supplier');
        const matchesTab = activeTab === 'all' || submission.status === (
            activeTab === 'pending' ? 'Pending' :
                activeTab === 'verified' ? 'Verified' :
                    activeTab === 'rejected' ? 'Rejected' : submission.status
        );

        return matchesSearch && matchesMainTab && matchesTab;
    });

    const handleApprove = (id) => {
        console.log('Approving KYC:', id);
    };

    const handleReject = (id) => {
        console.log('Rejecting KYC:', id);
    };

    const handleViewDocument = (filename) => {
        console.log('Viewing document:', filename);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
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

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-600 mb-1">Total Submissions</div>
                        <div className="text-2xl font-bold text-gray-900">{kycSubmissions.length}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-600 mb-1">Pending Review</div>
                        <div className="text-2xl font-bold text-yellow-600">
                            {kycSubmissions.filter(k => k.status === 'Pending').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-600 mb-1">Verified</div>
                        <div className="text-2xl font-bold text-green-600">
                            {kycSubmissions.filter(k => k.status === 'Verified').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-600 mb-1">Rejected</div>
                        <div className="text-2xl font-bold text-red-600">
                            {kycSubmissions.filter(k => k.status === 'Rejected').length}
                        </div>
                    </div>
                </div>

                {/* Main Tabs - Seller/Supplier */}
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

                {/* Tabs and Filters */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    {/* Tabs */}
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

                {/* KYC Submissions */}
                <div className="space-y-4">
                    {filteredSubmissions.map((submission) => (
                        <div key={submission.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-3 rounded-xl ${submission.type === 'Seller' ? 'bg-blue-100' : 'bg-emerald-100'
                                        }`}>
                                        {submission.type === 'Seller' ? (
                                            <User className={`w-6 h-6 ${submission.type === 'Seller' ? 'text-blue-600' : 'text-emerald-600'
                                                }`} />
                                        ) : (
                                            <Building className={`w-6 h-6 ${submission.type === 'Seller' ? 'text-blue-600' : 'text-emerald-600'
                                                }`} />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{submission.name}</h3>
                                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${submission.type === 'Seller' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                                                }`}>
                                                {submission.type}
                                            </span>
                                            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(submission.status)}`}>
                                                {getStatusIcon(submission.status)}
                                                <span className="ml-2">{submission.status}</span>
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {submission.email}
                                            </div>
                                            <div className="flex items-center">
                                                <Phone className="w-4 h-4 mr-2" />
                                                {submission.phone}
                                            </div>
                                            <div>Submitted: {submission.submittedDate}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {submission.status === 'Pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(submission.id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(submission.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Business Details */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Business Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Business Name:</span>
                                        <div className="font-medium text-gray-900">{submission.businessDetails.businessName}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">GST Number:</span>
                                        <div className="font-mono text-gray-900">{submission.businessDetails.gstNumber}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">PAN Number:</span>
                                        <div className="font-mono text-gray-900">{submission.businessDetails.panNumber}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Submitted Documents</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Object.entries(submission.documents).map(([docType, doc]) => (
                                        <div key={docType} className="border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <FileText className="w-4 h-4 mr-2 text-gray-400" />
                                                    <span className="font-medium text-gray-900">
                                                        {docType === 'gst' ? 'GST Certificate' :
                                                            docType === 'pan' ? 'PAN Card' : 'Cancelled Cheque'}
                                                    </span>
                                                </div>
                                                <span className={`text-sm font-medium ${getDocumentStatusColor(doc.status)}`}>
                                                    {doc.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">{doc.filename}</div>
                                            {doc.reason && (
                                                <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg mb-2">
                                                    <strong>Reason:</strong> {doc.reason}
                                                </div>
                                            )}
                                            <button
                                                onClick={() => handleViewDocument(doc.filename)}
                                                className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Document
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rejection Reason */}
                            {submission.status === 'Rejected' && submission.rejectionReason && (
                                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="flex items-start">
                                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                                        <div>
                                            <div className="font-medium text-red-800 mb-1">Rejection Reason</div>
                                            <div className="text-red-700 text-sm">{submission.rejectionReason}</div>
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
        </div>
    );
};

export default KYCCompliance;