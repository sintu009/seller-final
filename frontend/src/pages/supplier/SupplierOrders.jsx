import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  User,
  Calendar,
  Edit3,
  XCircle,
} from "lucide-react";
import { useGetSupplierOrdersQuery } from "../../store/slices/apiSlice";
import { useAppSelector } from "../../store/hooks";

const SupplierOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useGetSupplierOrdersQuery(undefined, {
    skip: !isAuthenticated || user?.role !== "supplier",
  });

  const orders = ordersData?.data || [];
  console.log("Fetched Orders:", orders);
  const getStatusIcon = (status) => {
    switch (status) {
      case "admin_review":
        return <Clock className="w-4 h-4" />;
      case "pushed":
        return <CheckCircle className="w-4 h-4" />;
      case "admin_rejected":
        return <XCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "admin_review":
        return "bg-yellow-100 text-yellow-800";
      case "pushed":
        return "bg-green-100 text-green-800";
      case "admin_rejected":
        return "bg-red-100 text-red-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "admin_review":
        return "Admin Review";
      case "pushed":
        return "Approved";
      case "admin_rejected":
        return "Rejected";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "admin_review").length,
    approved: orders.filter((o) => o.status === "pushed").length,
    rejected: orders.filter((o) => o.status === "admin_rejected").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  if (!isAuthenticated || user?.role !== "supplier") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-mdg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">Only suppliers can access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-mdg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage orders from connected sellers
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => refetch()}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-mdg p-4">
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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900">
            {orderStats.total}
          </div>
        </div>
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Admin Review</div>
          <div className="text-2xl font-bold text-yellow-600">
            {orderStats.pending}
          </div>
        </div>
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Approved</div>
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
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Shipped</div>
          <div className="text-2xl font-bold text-blue-600">
            {orderStats.shipped}
          </div>
        </div>
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Delivered</div>
          <div className="text-2xl font-bold text-green-600">
            {orderStats.delivered}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Seller Name, or Product..."
              className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="admin_review">Admin Review</option>
            <option value="pushed">Approved</option>
            <option value="admin_rejected">Rejected</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">No orders found</div>
            <p className="text-gray-400">
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Order ID
                  </th>
                  {/*<th className="text-left py-4 px-6 font-semibold text-gray-900">Seller</th>*/}
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Product
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Qty
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Admin Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-mono text-sm font-medium text-emerald-600">
                        {order.orderNumber}
                      </div>
                    </td>
                    {/*
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.seller?.name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.seller?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">
                        {order.product?.name || "N/A"}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">
                        {order.quantity}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-emerald-600">
                        ₹{order.supplierTotalPrice?.toLocaleString() || "0"}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-2">
                          {getStatusLabel(order.status)}
                        </span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <div className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {order.adminReview?.notes ? (
                        <div className="text-sm text-gray-600 max-w-xs">
                          <div className="font-medium mb-1">
                            {order.adminReview.action === "approved"
                              ? "Approval Notes:"
                              : "Rejection Reason:"}
                          </div>
                          <div className="text-xs">
                            {order.adminReview.notes}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No notes</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">{startIndex + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(
                            startIndex + ordersPerPage,
                            filteredOrders.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {filteredOrders.length}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
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
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierOrders;
