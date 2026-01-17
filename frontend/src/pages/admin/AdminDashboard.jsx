import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  useGetProductsQuery,
  useGetAllKYCQuery,
  useGetAdminOrdersQuery,
} from "../../store/slices/apiSlice";
import { useAppSelector } from "../../store/hooks";
import DashboardLayout from "../../components/DashboardLayout";
import AdminOverview from "./AdminOverview";
import UserManagement from "./UserManagement";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";
import FinanceWallet from "./FinanceWallet";
import KYCCompliance from "./KYCCompliance";
import SupportHelpdesk from "./SupportHelpdesk";
import AdminSettings from "./AdminSettings";
import PlatformMargins from "./PlatformMargins";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  FileCheck,
  Headphones as HeadphonesIcon,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useGetAdminDashboardCountsQuery } from "../../store/slices/apiSlice";
import AdminPayment from "./AdminPayment";
import AdminNotification from "./AdminNotification";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: dashboardResponse, isLoading: dashboardLoading } =
    useGetAdminDashboardCountsQuery(undefined, {
      skip: !isAuthenticated,
      pollingInterval: 30000,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    });

  const dashboardData = dashboardResponse?.data ?? {
    totalSellers: 0,
    totalSuppliers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: null,
    pendingApprovals: 0,
    breakdown: {
      pendingProducts: 0,
      pendingKyc: 0,
      pendingOrders: 0, // future-ready
    },
  };

  const pendingProducts = dashboardData.breakdown.pendingProducts;
  const pendingKyc = dashboardData.breakdown.pendingKyc;
  const pendingOrders = dashboardData.breakdown.pendingOrders ?? 0;

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      path: "/admin/users",
    },
    {
      id: "products",
      label: "Product Management",
      icon: Package,
      path: "/admin/products",
      badge: pendingProducts > 0 ? pendingProducts.toString() : undefined,
    },
    {
      id: "orders",
      label: "Order Management",
      icon: ShoppingCart,
      path: "/admin/orders",
      badge: pendingOrders > 0 ? pendingOrders.toString() : undefined,
    },
    {
      id: "finance",
      label: "Finance & Wallet",
      icon: DollarSign,
      path: "/admin/finance",
    },
    {
      id: "margins",
      label: "Platform Margins",
      icon: TrendingUp,
      path: "/admin/margins",
    },
    {
      id: "kyc",
      label: "KYC & Compliance",
      icon: FileCheck,
      path: "/admin/kyc",
      badge: pendingKyc > 0 ? pendingKyc.toString() : undefined,
    },
    {
      id: "payment",
      label: "Payment",
      icon: FileCheck,
      path: "/admin/payment",
    },
    {
      id: "notification",
      label: "Notification",
      icon: FileCheck,
      path: "/admin/notification",
    },
    {
      id: "support",
      label: "Support & Helpdesk",
      icon: HeadphonesIcon,
      path: "/admin/support",
      badge: 3 > 0 ? "3" : undefined,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Admin Portal">
      <Routes>
        <Route path="/dashboard" element={<AdminOverview />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/finance" element={<FinanceWallet />} />
        <Route path="/margins" element={<PlatformMargins />} />
        <Route path="/kyc" element={<KYCCompliance />} />
        <Route path="/payment" element={<AdminPayment />} />
        <Route path="/notification" element={<AdminNotification />} />
        <Route path="/support" element={<SupportHelpdesk />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
