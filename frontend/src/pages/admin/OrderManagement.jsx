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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionNotes, setActionNotes] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

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

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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
    <div className="space-y-6 bg-gray-50 min-h-screen">
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
          ) : (
            <Package className="w-4 h-4 mr-2" />
          )}
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
          <>
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
                  {paginatedOrders.map((order) => (
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
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {order.product?.image ? (
                              <img
                                src={order.product.image}
                                alt={order.product?.name || "Product"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-full flex items-center justify-center ${order.product?.image ? 'hidden' : 'flex'}`}>
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.product?.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.product?.category || "N/A"}
                            </div>
                          </div>
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
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDetailsModal(true);
                            }}
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(startIndex + ordersPerPage, filteredOrders.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredOrders.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => {
                          const page = index + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === page
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Order Details</h2>
                  <p className="text-blue-100 text-sm mt-1">{selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-blue-500 rounded-lg transition-colors text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
              {/* Status and Amount Banner */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <Package className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-3xl font-bold text-green-600">₹{selectedOrder.totalPrice?.toLocaleString() || "0"}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Order Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Order Number</span>
                      <span className="text-gray-900 font-semibold">{selectedOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Order Date</span>
                      <span className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Quantity</span>
                      <span className="text-gray-900 font-semibold">{selectedOrder.quantity} units</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-600">Unit Price</span>
                      <span className="text-gray-900">₹{selectedOrder.product?.price?.toLocaleString() || "0"}</span>
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedOrder.product?.image && (
                      <div className="py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600 block mb-2">Product Image</span>
                        <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={selectedOrder.product.image}
                            alt={selectedOrder.product?.name || "Product"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center hidden">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600 block">Product Name</span>
                      <span className="text-gray-900 font-semibold text-lg">{selectedOrder.product?.name || "N/A"}</span>
                    </div>
                    <div className="py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600 block">Category</span>
                      <span className="text-gray-900">{selectedOrder.product?.category || "N/A"}</span>
                    </div>
                    <div className="py-2">
                      <span className="text-sm font-medium text-gray-600 block">Description</span>
                      <span className="text-gray-900">{selectedOrder.product?.description || "No description available"}</span>
                    </div>
                  </div>
                </div>

                {/* Seller Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Seller Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedOrder.seller?.name || "N/A"}</p>
                        <p className="text-sm text-gray-600">{selectedOrder.seller?.email || "N/A"}</p>
                      </div>
                    </div>
                    <div className="py-2">
                      <span className="text-sm font-medium text-gray-600 block">Phone</span>
                      <span className="text-gray-900">{selectedOrder.seller?.phone || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Supplier Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Supplier Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedOrder.supplier?.name || "N/A"}</p>
                        <p className="text-sm text-gray-600">{selectedOrder.supplier?.email || "N/A"}</p>
                      </div>
                    </div>
                    <div className="py-2">
                      <span className="text-sm font-medium text-gray-600 block">Phone</span>
                      <span className="text-gray-900">{selectedOrder.supplier?.phone || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Order created on {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
                <div className="flex gap-3">
                  {selectedOrder.status === "admin_review" && (
                    <>
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleAction(selectedOrder, "reject");
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject Order
                      </button>
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleAction(selectedOrder, "approve");
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve Order
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                className={`flex-1 px-4 py-2 text-white rounded-mdg disabled:opacity-50 ${actionType === "approve"
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
