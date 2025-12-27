import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useGetProductsQuery, useGetAllKYCQuery, useGetAdminOrdersQuery } from '../../store/slices/apiSlice';
import { useAppSelector } from '../../store/hooks';
import DashboardLayout from '../../components/DashboardLayout';
import SupperAdminOverview from './SupperAdminOverview';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import FinanceWallet from './FinanceWallet';
import KYCCompliance from './KYCCompliance';
import SupportHelpdesk from './SupportHelpdesk';
import SupperAdminSettings from './SupperAdminSettings';
import PlatformMargins from './PlatformMargins';
import { LayoutDashboard, Users, Package, ShoppingCart, DollarSign, FileCheck, Headphones as HeadphonesIcon, Settings, TrendingUp } from 'lucide-react';
import { useGetAdminDashboardCountsQuery } from '../../store/slices/apiSlice';

const SupperAdminDashboard = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    data: dashboardResponse,
    isLoading: dashboardLoading,
  } = useGetAdminDashboardCountsQuery(undefined, {
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/super-admin/dashboard' },
    { id: 'users', label: 'User Management', icon: Users, path: '/super-admin/users' },
    { id: 'products', label: 'Product Management', icon: Package, path: '/super-admin/products', badge: pendingProducts > 0 ? pendingProducts.toString() : undefined },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart, path: '/super-admin/orders', badge: pendingOrders > 0 ? pendingOrders.toString() : undefined },
    { id: 'finance', label: 'Finance & Wallet', icon: DollarSign, path: '/super-admin/finance' },
    { id: 'margins', label: 'Platform Margins', icon: TrendingUp, path: '/super-admin/margins' },
    { id: 'kyc', label: 'KYC & Compliance', icon: FileCheck, path: '/super-admin/kyc', badge: pendingKyc > 0 ? pendingKyc.toString() : undefined },
    { id: 'support', label: 'Support & Helpdesk', icon: HeadphonesIcon, path: '/super-admin/support', badge: 3 > 0 ? '3' : undefined },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/super-admin/settings' }
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Super Admin">
      <Routes>
        <Route path="/dashboard" element={<SupperAdminOverview />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/finance" element={<FinanceWallet />} />
        <Route path="/margins" element={<PlatformMargins />} />
        <Route path="/kyc" element={<KYCCompliance />} />
        <Route path="/support" element={<SupportHelpdesk />} />
        <Route path="/settings" element={<SupperAdminSettings />} />
        <Route path="/" element={<Navigate to="/super-admin/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default SupperAdminDashboard;