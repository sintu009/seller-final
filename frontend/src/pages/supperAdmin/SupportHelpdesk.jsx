import React, { useState } from 'react';
import {
    Search,
    Filter,
    Plus,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertTriangle,
    User,
    Building,
    Mail,
    Phone,
    Calendar,
    Tag,
    Eye,
    MessageCircle
} from 'lucide-react';

const SupportHelpdesk = () => {
    const [activeTab, setActiveTab] = useState('tickets');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');

    // Mock tickets data
    const tickets = [
        {
            id: 'TKT-001',
            title: 'Payment not received for order #AMZ-12345',
            description: 'I completed the order 3 days ago but payment is still pending in my wallet.',
            user: 'TechStore India',
            userType: 'Seller',
            email: 'contact@techstore.com',
            phone: '+91 98765 43210',
            status: 'Open',
            priority: 'High',
            category: 'Payment',
            createdDate: '2024-01-15',
            lastUpdate: '2024-01-15',
            assignedTo: 'Support Team',
            responses: 2
        },
        {
            id: 'TKT-002',
            title: 'Product rejection reason unclear',
            description: 'My product "Wireless Headphones" was rejected but the reason provided is not clear. Need detailed feedback.',
            user: 'Kumar Electronics Manufacturing',
            userType: 'Supplier',
            email: 'info@kumarelectronics.com',
            phone: '+91 98765 54321',
            status: 'In Progress',
            priority: 'Medium',
            category: 'Product',
            createdDate: '2024-01-14',
            lastUpdate: '2024-01-15',
            assignedTo: 'Product Team',
            responses: 5
        },
        {
            id: 'TKT-003',
            title: 'Unable to update inventory',
            description: 'Getting error when trying to update stock quantity for multiple products.',
            user: 'ElectroMart',
            userType: 'Seller',
            email: 'orders@electromart.com',
            phone: '+91 98765 43211',
            status: 'Resolved',
            priority: 'Low',
            category: 'Technical',
            createdDate: '2024-01-12',
            lastUpdate: '2024-01-13',
            assignedTo: 'Tech Team',
            responses: 3
        },
        {
            id: 'TKT-004',
            title: 'KYC documents verification delay',
            description: 'Submitted KYC documents 5 days ago but still showing as pending. Need urgent verification.',
            user: 'GadgetHub',
            userType: 'Seller',
            email: 'support@gadgethub.com',
            phone: '+91 98765 43212',
            status: 'Open',
            priority: 'High',
            category: 'KYC',
            createdDate: '2024-01-13',
            lastUpdate: '2024-01-14',
            assignedTo: 'Compliance Team',
            responses: 1
        }
    ];

    // Mock FAQ data
    const faqs = [
        {
            id: 1,
            category: 'Payment',
            question: 'How long does it take to receive payment after order completion?',
            answer: 'Payments are typically processed within 24-48 hours after order completion and delivery confirmation.',
            views: 245,
            helpful: 189
        },
        {
            id: 2,
            category: 'Product',
            question: 'What are the requirements for product approval?',
            answer: 'Products must have clear images, accurate descriptions, valid HSN codes, and comply with platform guidelines.',
            views: 178,
            helpful: 156
        },
        {
            id: 3,
            category: 'KYC',
            question: 'Which documents are required for KYC verification?',
            answer: 'GST Certificate, PAN Card, and Cancelled Cheque are mandatory for KYC completion.',
            views: 312,
            helpful: 278
        }
    ];

    const tabs = [
        { id: 'tickets', label: 'Support Tickets', count: tickets.length },
        { id: 'faq', label: 'FAQ Management', count: faqs.length }
    ];

    const statuses = ['all', 'Open', 'In Progress', 'Resolved', 'Closed'];
    const priorities = ['all', 'Low', 'Medium', 'High', 'Critical'];
    const categories = ['all', 'Payment', 'Product', 'Technical', 'KYC', 'General'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-red-100 text-red-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'Closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical': return 'bg-red-100 text-red-800';
            case 'High': return 'bg-orange-100 text-orange-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Payment': return 'bg-blue-100 text-blue-800';
            case 'Product': return 'bg-purple-100 text-purple-800';
            case 'Technical': return 'bg-gray-100 text-gray-800';
            case 'KYC': return 'bg-emerald-100 text-emerald-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
        const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const ticketStats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'Open').length,
        inProgress: tickets.filter(t => t.status === 'In Progress').length,
        resolved: tickets.filter(t => t.status === 'Resolved').length
    };

    const handleAssignTicket = (ticketId, assignee) => {
        console.log(`Assigning ticket ${ticketId} to ${assignee}`);
    };

    const handleUpdateStatus = (ticketId, status) => {
        console.log(`Updating ticket ${ticketId} status to ${status}`);
    };

    const renderTicketsTab = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Tickets</div>
                    <div className="text-2xl font-bold text-gray-900">{ticketStats.total}</div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Open Tickets</div>
                    <div className="text-2xl font-bold text-red-600">{ticketStats.open}</div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">In Progress</div>
                    <div className="text-2xl font-bold text-yellow-600">{ticketStats.inProgress}</div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Resolved</div>
                    <div className="text-2xl font-bold text-green-600">{ticketStats.resolved}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tickets by title, user, or ticket ID..."
                            className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            className="px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'All Status' : status}
                                </option>
                            ))}
                        </select>
                        <select
                            className="px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                        >
                            {priorities.map(priority => (
                                <option key={priority} value={priority}>
                                    {priority === 'all' ? 'All Priority' : priority}
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

            {/* Tickets List */}
            <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-4">
                                <div className={`p-3 rounded-md ${ticket.userType === 'Seller' ? 'bg-blue-100' : 'bg-emerald-100'
                                    }`}>
                                    {ticket.userType === 'Seller' ? (
                                        <User className="w-6 h-6 text-blue-600" />
                                    ) : (
                                        <Building className="w-6 h-6 text-emerald-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                                        <span className="font-mono text-sm text-orange-600">{ticket.id}</span>
                                    </div>
                                    <p className="text-gray-600 mb-3">{ticket.description}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-1" />
                                            {ticket.user} ({ticket.userType})
                                        </div>
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-1" />
                                            {ticket.email}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {ticket.createdDate}
                                        </div>
                                        <div className="flex items-center">
                                            <MessageCircle className="w-4 h-4 mr-1" />
                                            {ticket.responses} responses
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-mdg transition-colors">
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-mdg transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                </span>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(ticket.category)}`}>
                                    {ticket.category}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>Assigned to: {ticket.assignedTo}</span>
                                <span>•</span>
                                <span>Updated: {ticket.lastUpdate}</span>
                            </div>
                        </div>

                        {ticket.status === 'Open' && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleUpdateStatus(ticket.id, 'In Progress')}
                                        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                                    >
                                        Start Working
                                    </button>
                                    <button
                                        onClick={() => handleAssignTicket(ticket.id, 'Specialist')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Assign to Specialist
                                    </button>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                                        Add Note
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {filteredTickets.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-md shadow-sm border border-gray-100">
                        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-500 text-lg mb-2">No tickets found</div>
                        <p className="text-gray-400">Try adjusting your search filters</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderFAQTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">FAQ Management</h3>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New FAQ
                </button>
            </div>

            <div className="space-y-4">
                {faqs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(faq.category)}`}>
                                        {faq.category}
                                    </span>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h4>
                                <p className="text-gray-600 mb-4">{faq.answer}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Eye className="w-4 h-4 mr-1" />
                                        {faq.views} views
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        {faq.helpful} found helpful
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-mdg transition-colors">
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-mdg transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Support & Helpdesk</h1>
                    <p className="text-gray-600 mt-1">Manage support tickets and FAQ from sellers and suppliers</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Ticket
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex space-x-1 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${activeTab === tab.id
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
            </div>

            {/* Tab Content */}
            {activeTab === 'tickets' && renderTicketsTab()}
            {activeTab === 'faq' && renderFAQTab()}
        </div>
    );
};

export default SupportHelpdesk;