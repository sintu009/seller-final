import { Routes, Route, Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { useGetUnreadNotificationCountQuery } from "../../store/slices/apiSlice";

import DashboardLayout from "../../components/DashboardLayout";
import SupplierOverview from "./SupplierOverview";
import SupplierProductManagement from "./SupplierProductManagement";
import SupplierOrders from "./SupplierOrders";
import SupplierWallet from "./SupplierWallet";
import SupplierSettings from "./SupplierSettings";
import SupplierNotifications from "./SupplierNotifications";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  Settings,
  Bell,
} from "lucide-react";

const SupplierDashboard = () => {
  const { data } = useGetUnreadNotificationCountQuery(undefined);
  const unreadCount = data?.count || 0;

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/supplier/dashboard",
    },
    {
      id: "products",
      label: "Product Management",
      icon: Package,
      path: "/supplier/products",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      path: "/supplier/orders",
      badge: "12",
    },
    {
      id: "wallet",
      label: "Wallet & Payments",
      icon: Wallet,
      path: "/supplier/wallet",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/supplier/notifications",
      badge: unreadCount > 0 ? unreadCount.toString() : 0,
    },
    {
      id: "settings",
      label: "Profile & KYC",
      icon: Settings,
      path: "/supplier/settings",
    },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Kyzen Supplier">
      <Routes>
        <Route path="/dashboard" element={<SupplierOverview />} />
        <Route path="/products" element={<SupplierProductManagement />} />
        <Route path="/orders" element={<SupplierOrders />} />
        <Route path="/wallet" element={<SupplierWallet />} />
        <Route path="/notifications" element={<SupplierNotifications />} />
        <Route path="/settings" element={<SupplierSettings />} />
        <Route
          path="/"
          element={<Navigate to="/supplier/dashboard" replace />}
        />
      </Routes>
    </DashboardLayout>
  );
};

export default SupplierDashboard;
