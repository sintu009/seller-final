import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  Edit3,
  X,
  User,
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [editedAmount, setEditedAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const { data, isLoading, refetch } = useGetAllPayoutsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const paymentMethods = [
    { id: "gpay", name: "Google Pay" },
    { id: "upi", name: "UPI" },
    { id: "cash", name: "Cash" },
    { id: "phonepe", name: "PhonePe" },
    { id: "cheque", name: "Cheque" },
  ];

  const [updatePayout] = useUpdatePayoutMutation();
  const payouts = data?.data || [];

  useEffect(() => {
    socket.on("PAYOUT_UPDATED", refetch);
    return () => socket.off("PAYOUT_UPDATED", refetch);
  }, [refetch]);

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

  const handleEditPayment = (payout) => {
    setSelectedPayout(payout);
    setEditedAmount(payout.payableAmount);
    setPaymentMethod("");
    setTransactionId("");
    setComment("");
    setShowEditModal(true);
  };

  const handleSubmitEdit = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!editedAmount || parseFloat(editedAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setActionLoading(true);

      await updatePayout({
        id: selectedPayout.payoutId,
        paidAmount: parseFloat(editedAmount),
        payoutMode: paymentMethod,
        referenceNumber: transactionId, // ✅ FIX
        remarks: comment, // ✅ FIX
      }).unwrap();

      toast.success("Payment updated successfully!");
      setShowEditModal(false);
      setEditedAmount("");
      setPaymentMethod("");
      setTransactionId("");
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update payment");
    } finally {
      setActionLoading(false);
    }
  };

  const markAsPaid = async (payout) => {
    try {
      await updatePayout({
        id: payout.payoutId,
        paidAmount: payout.payableAmount,
        payoutMode: "bank_transfer",
      }).unwrap();

      toast.success("Payout marked as paid");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update payout");
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading payments...</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">
              Track your earnings and payment history
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
          >
            <option value="all">All Users</option>
            <option value="seller">Seller</option>
            <option value="supplier">Supplier</option>
          </select>
          <div className="flex items-center space-x-3">
            <div className="relative w-64">
              <DatePicker value={dateRange} onChange={setDateRange} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Earnings</div>
          <div className="text-2xl font-bold text-green-600">₹500</div>
          <div className="text-xs text-gray-500 mt-1">Completed payments</div>
        </div>
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Deductions</div>
          <div className="text-2xl font-bold text-red-600">₹10</div>
          <div className="text-xs text-gray-500 mt-1">Platform fees</div>
        </div>
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Pending Payments</div>
          <div className="text-2xl font-bold text-yellow-600">₹500</div>
          <div className="text-xs text-gray-500 mt-1">Processing</div>
        </div>
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Net Balance</div>
          <div className="text-2xl font-bold text-blue-600">₹20</div>
          <div className="text-xs text-gray-500 mt-1">Available balance</div>
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
                    <button
                      onClick={() => handleEditPayment(payout)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-md"
                      title="Edit Payment"
                    >
                      <Edit3 className="w-4 h-4" />
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

      {/* Edit Payment Modal */}
      {showEditModal && selectedPayout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Payment</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">Order Details</div>
              <div className="font-medium text-gray-900">
                {selectedPayout.productName}
              </div>
              <div className="text-sm text-gray-500">
                Order ID: {selectedPayout.orderId}
              </div>
              <div className="text-sm text-gray-500">
                User: {selectedPayout.userName}
              </div>
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
                Transaction ID (Optional)
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add any comments..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
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
    </div>
  );
};

export default AdminPayment;
