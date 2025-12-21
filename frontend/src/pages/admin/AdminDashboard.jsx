import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useGetProductsQuery, useGetAllKYCQuery, useGetAdminOrdersQuery } from '../../store/slices/apiSlice';
import { useAppSelector } from '../../store/hooks';
import DashboardLayout from '../../components/DashboardLayout';
import AdminOverview from './AdminOverview';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import FinanceWallet from './FinanceWallet';
import KYCCompliance from './KYCCompliance';
import SupportHelpdesk from './SupportHelpdesk';
import AdminSettings from './AdminSettings';
import PlatformMargins from './PlatformMargins';
import { LayoutDashboard, Users, Package, ShoppingCart, DollarSign, FileCheck, Headphones as HeadphonesIcon, Settings, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: productsData } = useGetProductsQuery(undefined, { skip: !isAuthenticated });
  const { data: kycData } = useGetAllKYCQuery(undefined, { skip: !isAuthenticated });
  const { data: ordersData } = useGetAdminOrdersQuery(undefined, { skip: !isAuthenticated });
  
  const products = productsData?.data || [];
  const kycUsers = kycData?.data || [];
  const orders = ordersData?.data || [];
  
  const pendingProducts = products.filter(p => p.approvalStatus === 'pending').length;
  const pendingKyc = kycUsers.filter(user => user.kycStatus === 'pending').length;
  const pendingOrders = orders.filter(order => order.status === 'admin_review').length;

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
    { id: 'products', label: 'Product Management', icon: Package, path: '/admin/products', badge: pendingProducts > 0 ? pendingProducts.toString() : undefined },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart, path: '/admin/orders', badge: pendingOrders > 0 ? pendingOrders.toString() : undefined },
    { id: 'finance', label: 'Finance & Wallet', icon: DollarSign, path: '/admin/finance' },
    { id: 'margins', label: 'Platform Margins', icon: TrendingUp, path: '/admin/margins' },
    { id: 'kyc', label: 'KYC & Compliance', icon: FileCheck, path: '/admin/kyc', badge: pendingKyc > 0 ? pendingKyc.toString() : undefined },
    { id: 'support', label: 'Support & Helpdesk', icon: HeadphonesIcon, path: '/admin/support', badge: 3 > 0 ? '3' : undefined },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' }
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
        <Route path="/support" element={<SupportHelpdesk />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;