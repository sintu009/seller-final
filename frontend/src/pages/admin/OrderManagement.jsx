import React, { useState, useEffect } from "react";
import {
  Package,
  User,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetAdminOrdersQuery,
  useApproveOrderMutation,
  useRejectOrderMutation,
} from "../../store/slices/apiSlice";
import { useAppSelector } from "../../store/hooks";

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionNotes, setActionNotes] = useState("");

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const shouldFetch = isAuthenticated && user?.role === "admin";

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useGetAdminOrdersQuery(undefined, {
    skip: !shouldFetch,
    refetchOnMountOrArgChange: true,
  });

  const [approveOrder, { isLoading: approving }] = useApproveOrderMutation();
  const [rejectOrder, { isLoading: rejecting }] = useRejectOrderMutation();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-mdg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please log in as an admin to access order management.
          </p>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-mdg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            Only administrators can access order management.
          </p>
        </div>
      </div>
    );
  }

  const orders = ordersData?.data || [];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAction = (order, type) => {
    setSelectedOrder(order);
    setActionType(type);
    setActionNotes("");
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedOrder) return;

    if (actionType === "reject" && !actionNotes.trim()) {
      toast.error("Please provide rejection notes");
      return;
    }

    try {
      if (actionType === "approve") {
        await approveOrder({
          orderId: selectedOrder._id,
          notes: actionNotes,
        }).unwrap();
        toast.success("Order approved successfully!");
      } else {
        await rejectOrder({
          orderId: selectedOrder._id,
          notes: actionNotes,
        }).unwrap();
        toast.success("Order rejected successfully!");
      }

      setShowModal(false);
      setSelectedOrder(null);
      setActionNotes("");
      refetch();
    } catch (error) {
      console.error("Action error:", error);
      toast.error(error?.data?.message || `Failed to ${actionType} order`);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      admin_review: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending Review",
      },
      pushed: { color: "bg-green-100 text-green-800", label: "Pushed" },
      admin_rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
      pending: { color: "bg-gray-100 text-gray-800", label: "Pending" },
      shipped: { color: "bg-blue-100 text-blue-800", label: "Shipped" },
      delivered: { color: "bg-green-100 text-green-800", label: "Delivered" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "admin_review").length,
    approved: orders.filter((o) => o.status === "pushed").length,
    rejected: orders.filter((o) => o.status === "admin_rejected").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-mdg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">
            Review and manage seller order requests
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-mdg hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : null}
          Refresh Orders
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-mdg p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">
            Error Loading Orders:
          </h3>
          <p className="text-red-700 mb-2">
            {error?.data?.message || "Failed to load orders"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-mdg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900">
            {orderStats.total}
          </div>
        </div>
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Pending Review</div>
          <div className="text-2xl font-bold text-yellow-600">
            {orderStats.pending}
          </div>
        </div>
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Pushed</div>
          <div className="text-2xl font-bold text-green-600">
            {orderStats.approved}
          </div>
        </div>
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Rejected</div>
          <div className="text-2xl font-bold text-red-600">
            {orderStats.rejected}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="admin_review">Pending Review</option>
            <option value="pushed">Pushed</option>
            <option value="admin_rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-500">
              {orders.length === 0
                ? "No orders have been placed yet."
                : "No orders match your current filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        Qty: {order.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {order.product?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {order.seller?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.seller?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {order.supplier?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.supplier?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        ₹{order.totalPrice?.toLocaleString() || "0"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {order.status === "admin_review" && (
                          <>
                            <button
                              onClick={() => handleAction(order, "approve")}
                              disabled={approving || rejecting}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-mdg disabled:opacity-50"
                              title="Approve Order"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction(order, "reject")}
                              disabled={approving || rejecting}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-mdg disabled:opacity-50"
                              title="Reject Order"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-mdg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {actionType === "approve" ? "Approve Order" : "Reject Order"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-mdg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Order: {selectedOrder.orderNumber}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Product: {selectedOrder.product?.name}
              </p>
              <p className="text-sm text-gray-600">
                Amount: ₹{selectedOrder.totalPrice?.toLocaleString()}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {actionType === "approve"
                  ? "Approval Notes (Optional)"
                  : "Rejection Reason *"}
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder={
                  actionType === "approve"
                    ? "Add any notes..."
                    : "Please provide reason for rejection..."
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-mdg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required={actionType === "reject"}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-mdg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={
                  approving ||
                  rejecting ||
                  (actionType === "reject" && !actionNotes.trim())
                }
                className={`flex-1 px-4 py-2 text-white rounded-mdg disabled:opacity-50 ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {approving || rejecting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : actionType === "approve" ? (
                  "Approve Order"
                ) : (
                  "Reject Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
