import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  Clock,
  Eye,
  User,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import { socket } from "../../socket";
import DatePicker from "../../components/DatePicker";

import {
  useGetAllPayoutsQuery,
  useUpdatePayoutMutation,
} from "../../store/slices/payoutApiSlice";

const AdminPayment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");
  const [dateRange, setDateRange] = useState([]);

  const { data, isLoading, refetch } = useGetAllPayoutsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updatePayout] = useUpdatePayoutMutation();
  const payouts = data?.data || [];

<<<<<<< HEAD
    const [approveProduct] = useApproveProductMutation();
    const [rejectProduct] = useRejectProductMutation();
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [margin, setMargin] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentNote, setPaymentNote] = useState('');
    const [editedAmount, setEditedAmount] = useState('');

    const paymentMethods = [
        { id: 'upi', name: 'UPI' },
        { id: 'bank_transfer', name: 'Bank Transfer' },
        { id: 'gpay', name: 'Google Pay' },
        { id: 'phonepe', name: 'PhonePe' }
    ];
=======
  useEffect(() => {
    socket.on("PAYOUT_UPDATED", refetch);
    return () => socket.off("PAYOUT_UPDATED", refetch);
  }, [refetch]);
>>>>>>> ac473dfa18722e5e397d3e4f6e2a75cdc6a471c0

  const today = new Date();

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch =
      payout.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.orderId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUser =
      selectedUser === "all" || payout.userRole === selectedUser;

    const matchesDate =
      dateRange.length !== 2 ||
      (new Date(payout.createdAt) >= dateRange[0] &&
        new Date(payout.createdAt) <= dateRange[1]);

    return matchesSearch && matchesUser && matchesDate;
  });

  const markAsPaid = async (payout) => {
    try {
      await updatePayout({
        id: payout.payoutId,
        paidAmount: payout.payableAmount,
        payoutMode: "bank_transfer",
      }).unwrap();

<<<<<<< HEAD
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'approved': return 'Approved';
            case 'pending': return 'Pending Approval';
            case 'rejected': return 'Rejected';
            default: return status;
        }
    };

    const handleEditPayment = (product) => {
        setSelectedProduct(product);
        setPaymentMethod('');
        setPaymentNote('');
        setEditedAmount(product.finalPrice || product.price);
        setShowEditPaymentModal(true);
    };

    const handlePaymentSubmit = async () => {
        if (!paymentMethod) {
            toast.error('Please select a payment method');
            return;
        }
        
        if (!editedAmount || parseFloat(editedAmount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            setActionLoading(true);
            // Add your payment update API call here
            // await updatePayment({ id: selectedProduct._id, method: paymentMethod, amount: editedAmount, note: paymentNote }).unwrap();
            
            toast.success('Payment updated successfully!');
            setShowEditPaymentModal(false);
            setPaymentMethod('');
            setPaymentNote('');
            setEditedAmount('');
        } catch (error) {
            console.error('Error updating payment:', error);
            toast.error('Failed to update payment');
        } finally {
            setActionLoading(false);
        }
    };

    const handleApprove = (product) => {
        setSelectedProduct(product);
        setMargin('');
        setShowApproveModal(true);
    };

    const handleReject = (product) => {
        setSelectedProduct(product);
        setRejectionReason('');
        setShowRejectModal(true);
    };

    const confirmApprove = async () => {
        if (!margin || parseFloat(margin) < 0) {
            toast.error('Please enter a valid margin amount');
            return;
        }

        try {
            setActionLoading(true);
            await approveProduct({
                id: selectedProduct._id,
                margin: parseFloat(margin)
            }).unwrap();

            toast.success('Product approved successfully!');
            setShowApproveModal(false);
            setMargin('');
        } catch (error) {
            console.error('Error approving product:', error);
            const message = error.data?.message || 'Failed to approve product';
            toast.error(message);
        } finally {
            setActionLoading(false);
        }
    };

    const confirmReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        try {
            setActionLoading(true);
            await rejectProduct({
                id: selectedProduct._id,
                reason: rejectionReason
            }).unwrap();

            toast.success('Product rejected successfully!');
            setShowRejectModal(false);
            setRejectionReason('');
        } catch (error) {
            console.error('Error rejecting product:', error);
            const message = error.data?.message || 'Failed to reject product';
            toast.error(message);
        } finally {
            setActionLoading(false);
        }
    };

    const productStats = {
        total: products.length,
        approved: products.filter(p => p.approvalStatus === 'approved').length,
        pending: products.filter(p => p.approvalStatus === 'pending').length,
        rejected: products.filter(p => p.approvalStatus === 'rejected').length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
                    <div className="text-gray-500 text-lg">Loading products...</div>
                </div>
            </div>
        );
=======
      toast.success("Payout marked as paid");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update payout");
>>>>>>> ac473dfa18722e5e397d3e4f6e2a75cdc6a471c0
    }
  };

<<<<<<< HEAD
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Payment Summery</h1>
                    <p className="text-gray-600 mt-1">Review and manage supplier product submissions</p>
                </div>
                <div className="flex items-center space-x-3">

                    {/* Select User Dropdown */}
                    <select
                        className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center cursor-pointer"
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Select User
                        </option>
                        <option value="user">User</option>
                        <option value="seller">Seller</option>
                        <option value="supplier">Supplier</option>
                    </select>

                    {/* Date Range Picker */}

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
                    <div className="text-sm text-gray-600 mb-1">Total Products</div>
                    <div className="text-2xl font-bold text-gray-900">{productStats.total}</div>
                    <div className="text-xs text-gray-500 mt-1">All submissions</div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Approved Products</div>
                    <div className="text-2xl font-bold text-green-600">{productStats.approved}</div>
                    <div className="text-xs text-gray-500 mt-1">Live for sellers</div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Pending Approval</div>
                    <div className="text-2xl font-bold text-yellow-600">{productStats.pending}</div>
                    <div className="text-xs text-gray-500 mt-1">Awaiting review</div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Rejected Products</div>
                    <div className="text-2xl font-bold text-red-600">{productStats.rejected}</div>
                    <div className="text-xs text-gray-500 mt-1">Need revision</div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products by name or supplier..."
                            className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            className="px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'All Status' : getStatusLabel(status)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">S. No.</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Order Details</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <ProductImage
                                                blobName={product.images?.[0]}
                                                alt={product.name}
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <Building className="w-4 h-4 mr-2 text-gray-400" />
                                            <div>
                                                <div className="text-gray-900">{product.supplier?.businessName || product.supplier?.name || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">{product.supplier?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm">
                                            <div className="flex items-center text-gray-900">
                                                <Tag className="w-4 h-4 mr-1 text-gray-400" />
                                                Base: ₹{product.price}
                                            </div>
                                            {product.margin > 0 && (
                                                <>
                                                    <div className="text-orange-600">
                                                        Margin: ₹{product.margin}
                                                    </div>
                                                    <div className="flex items-center text-green-600 font-semibold">
                                                        <DollarSign className="w-4 h-4 mr-1" />
                                                        Final: ₹{product.finalPrice}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm">
                                            <div className="text-gray-500">GST: {product.gstPercentage}%</div>
                                        </div>
                                    </td>
                                    {/* action */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEditPayment(product)}
                                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                                                title="Edit Payment"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>

                                            <button
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-mdg transition-colors"
                                                title="Unblock Supplier"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                            </button>

                                            <button
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-mdg transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-500 text-lg mb-2">No products found</div>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Edit Payment Modal */}
            {showEditPaymentModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md p-8 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Edit Payment Method</h3>
                            <button
                                onClick={() => setShowEditPaymentModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="text-sm text-gray-600 mb-2">Order</div>
                            <div className="font-medium text-gray-900">{selectedProduct.name}</div>
                            <div className="text-sm text-gray-500">Original Amount: ₹{selectedProduct.finalPrice || selectedProduct.price}</div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Amount (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editedAmount}
                                onChange={(e) => setEditedAmount(e.target.value)}
                                placeholder="Enter payment amount"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Method <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Select payment method</option>
                                {paymentMethods.map((method) => (
                                    <option key={method.id} value={method.id}>
                                        {method.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Note (Optional)
                            </label>
                            <textarea
                                value={paymentNote}
                                onChange={(e) => setPaymentNote(e.target.value)}
                                placeholder="Add any payment notes..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowEditPaymentModal(false)}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePaymentSubmit}
                                disabled={actionLoading || !paymentMethod || !editedAmount}
                                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {actionLoading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Submit
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Approve Modal */}
            {showApproveModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md p-8 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Approve Product</h3>
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="text-sm text-gray-600 mb-2">Product</div>
                            <div className="font-medium text-gray-900">{selectedProduct.name}</div>
                            <div className="text-sm text-gray-500">Base Price: ₹{selectedProduct.price}</div>
                            <div className="text-sm text-gray-500">GST: {selectedProduct.gstPercentage}%</div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Platform Margin (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={margin}
                                onChange={(e) => setMargin(e.target.value)}
                                placeholder="Enter margin amount in rupees"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            {margin && (
                                <div className="mt-3 p-3 bg-green-50 rounded-mdg">
                                    <div className="text-sm text-gray-600">Final Price Preview:</div>
                                    <div className="text-2xl font-bold text-green-600">
                                        ₹{(parseFloat(selectedProduct.price) + parseFloat(margin)).toFixed(2)}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmApprove}
                                disabled={actionLoading || !margin}
                                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {actionLoading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

=======
  if (isLoading) {
    return <div className="text-center py-10">Loading payments...</div>;
  }
>>>>>>> ac473dfa18722e5e397d3e4f6e2a75cdc6a471c0

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Summary</h1>
          <p className="text-gray-600">
            Review and manage seller & supplier payouts
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            <option value="all">All Users</option>
            <option value="seller">Seller</option>
            <option value="supplier">Supplier</option>
          </select>

          <DatePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-6 border rounded-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order, product or user..."
            className="pl-10 pr-4 py-3 w-full border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">Order / Product</th>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredPayouts.map((payout) => {
              const isOverdue =
                payout.dueDate &&
                new Date(payout.dueDate) < today &&
                payout.payoutStatus !== "paid";

              return (
                <tr
                  key={payout.payoutId}
                  className={`hover:bg-gray-50 ${isOverdue ? "bg-red-50" : ""}`}
                >
                  {/* ORDER / PRODUCT */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {payout.productName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Order ID: {payout.orderId}
                    </div>
                    <div className="text-xs text-gray-400">
                      Created: {new Date(payout.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* USER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-gray-900">{payout.userName}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {payout.userRole}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* AMOUNT */}
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>Payable: ₹{payout.payableAmount}</div>
                      <div className="text-green-600">
                        Paid: ₹{payout.paidAmount}
                      </div>
                    </div>
                  </td>

                  {/* STATUS + DUE DATE */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        payout.payoutStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payout.payoutStatus}
                    </span>

                    {payout.dueDate && (
                      <div
                        className={`text-xs mt-1 flex items-center gap-1 ${
                          isOverdue ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        {isOverdue && <AlertTriangle className="w-3 h-3" />}
                        Due: {new Date(payout.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4">
                    {payout.payoutStatus !== "paid" && (
                      <button
                        onClick={() => markAsPaid(payout)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                        title="Mark as Paid"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}

                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredPayouts.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No payouts found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayment;
