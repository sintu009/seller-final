import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
    { id: 'products', label: 'Product Management', icon: Package, path: '/admin/products', badge: '15' },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart, path: '/admin/orders' },
    { id: 'finance', label: 'Finance & Wallet', icon: DollarSign, path: '/admin/finance' },
    { id: 'margins', label: 'Platform Margins', icon: TrendingUp, path: '/admin/margins' },
    { id: 'kyc', label: 'KYC & Compliance', icon: FileCheck, path: '/admin/kyc', badge: '8' },
    { id: 'support', label: 'Support & Helpdesk', icon: HeadphonesIcon, path: '/admin/support', badge: '3' },
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