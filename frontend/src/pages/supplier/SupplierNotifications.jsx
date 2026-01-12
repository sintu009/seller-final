import React, { useState } from "react";
import {
  Bell,
  Package,
  CheckCircle,
  XCircle,
  DollarSign,
  AlertTriangle,
  Clock,
  Filter,
  BookMarked as MarkAsRead,
  Trash2,
} from "lucide-react";

import {
  useGetMyNotificationsQuery,
  useMarkNotificationsReadMutation,
  useDeleteNotificationsMutation,
} from "../../store/slices/apiSlice";

const SupplierNotifications = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const { data, isLoading } = useGetMyNotificationsQuery();
  const [markRead] = useMarkNotificationsReadMutation();
  const [deleteNoti] = useDeleteNotificationsMutation();

  const mapNotification = (n) => {
    const map = {
      success: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-600",
        type: "approval",
      },
      error: {
        icon: XCircle,
        color: "bg-red-100 text-red-600",
        type: "approval",
      },
      system: {
        icon: AlertTriangle,
        color: "bg-yellow-100 text-yellow-600",
        type: "system",
      },
      payment: {
        icon: DollarSign,
        color: "bg-emerald-100 text-emerald-600",
        type: "payment",
      },
    };

    const config = map[n.type] || {};

    return {
      id: n._id,
      type: config.type || "system",
      title: n.title,
      message: n.message,
      read: n.isRead,
      icon: config.icon || Clock,
      color: config.color || "bg-gray-100 text-gray-600",
      time: new Date(n.createdAt).toLocaleString(),
    };
  };

  const notifications = (data?.data || []).map(mapNotification);
  const filters = [
    { id: "all", label: "All Notifications", count: notifications.length },
    {
      id: "order",
      label: "Orders",
      count: notifications.filter((n) => n.type === "order").length,
    },
    {
      id: "approval",
      label: "Approvals",
      count: notifications.filter((n) => n.type === "approval").length,
    },
    {
      id: "payment",
      label: "Payments",
      count: notifications.filter((n) => n.type === "payment").length,
    },
    {
      id: "system",
      label: "System",
      count: notifications.filter((n) => n.type === "system").length,
    },
  ];

  const filteredNotifications =
    selectedFilter === "all"
      ? notifications
      : notifications.filter((n) => n.type === selectedFilter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSelectNotification = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const handleMarkAsReadOld = () => {
    console.log("Marking as read:", selectedNotifications);
    setSelectedNotifications([]);
  };

  const handleMarkAsRead = async () => {
    if (selectedNotifications.length === 0) return;

    try {
      await markRead(selectedNotifications).unwrap();

      setSelectedNotifications([]);
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };
  const handleDelete = () => {
    console.log("Deleting notifications:", selectedNotifications);
    setSelectedNotifications([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with orders, approvals, and payments
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedNotifications.length > 0 && (
            <>
              <button
                onClick={handleMarkAsRead}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center"
              >
                <MarkAsRead className="w-4 h-4 mr-2" />
                Mark as Read
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${
                selectedFilter === filter.id
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter.label}
              <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        {filteredNotifications.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={
                  selectedNotifications.length === filteredNotifications.length
                }
                onChange={handleSelectAll}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="ml-3 text-sm text-gray-700">
                Select All ({filteredNotifications.length})
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-md p-6 shadow-sm border transition-all duration-200 ${
              notification.read
                ? "border-gray-100"
                : "border-emerald-200 bg-emerald-50/30"
            } ${
              selectedNotifications.includes(notification.id)
                ? "ring-2 ring-emerald-500 border-emerald-300"
                : "hover:shadow-md"
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedNotifications.includes(notification.id)}
                onChange={() => handleSelectNotification(notification.id)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-1"
              />

              {/* Icon */}
              <div
                className={`p-3 rounded-md ${notification.color} flex-shrink-0`}
              >
                <notification.icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3
                      className={`font-semibold ${
                        notification.read ? "text-gray-900" : "text-gray-900"
                      }`}
                    >
                      {notification.title}
                      {!notification.read && (
                        <span className="ml-2 w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                      )}
                    </h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>

                    {/* Additional Info */}
                    <div className="mt-3 space-y-2">
                      {notification.orderId && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500">Order ID:</span>
                          <span className="ml-2 font-mono text-emerald-600">
                            {notification.orderId}
                          </span>
                        </div>
                      )}
                      {notification.productName && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500">Product:</span>
                          <span className="ml-2 text-gray-900">
                            {notification.productName}
                          </span>
                        </div>
                      )}
                      {notification.amount && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500">Amount:</span>
                          <span className="ml-2 font-semibold text-emerald-600">
                            ₹{notification.amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {notification.rejectionReason && (
                        <div className="bg-red-50 p-3 rounded-mdg">
                          <div className="text-sm">
                            <span className="text-red-800 font-medium">
                              Rejection Reason:
                            </span>
                            <span className="ml-2 text-red-700">
                              {notification.rejectionReason}
                            </span>
                          </div>
                        </div>
                      )}
                      {notification.stockLevel && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500">Stock Level:</span>
                          <span className="ml-2 font-semibold text-yellow-600">
                            {notification.stockLevel} units
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <div className="text-sm text-gray-500 flex-shrink-0 ml-4">
                    {notification.time}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-md shadow-sm border border-gray-100">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">
              No notifications found
            </div>
            <p className="text-gray-400">
              {selectedFilter === "all"
                ? "You're all caught up! No new notifications."
                : `No ${selectedFilter} notifications at the moment.`}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredNotifications.length > 0 && (
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-gray-600">
              Showing {filteredNotifications.length} notifications
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-mdg hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-mdg hover:bg-emerald-700 transition-colors">
                1
              </button>
              <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-mdg hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierNotifications;
