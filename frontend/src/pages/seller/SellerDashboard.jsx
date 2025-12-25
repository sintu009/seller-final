import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import SellerOverview from './SellerOverview';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import PaymentsWallet from './PaymentsWallet';
import AccountSettings from './AccountSettings';
import ManageDelivery from './ManageDelivery';

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  BarChart3,
  Settings,
  Truck
} from 'lucide-react';
import MyStores from './MyStores';


const SellerDashboard = () => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/seller/dashboard' },
    { id: 'products', label: 'Products', icon: Package, path: '/seller/products' },
    { id: 'store', label: 'My Stores', icon: Package, path: '/seller/Store' },
    // { id: 'orders', label: 'Manage Orders', icon: ShoppingCart, path: '/seller/orders', badge: '5' },
    { id: 'orders', label: 'Manage Orders', icon: ShoppingCart, path: '/seller/orders' },
    { id: 'Delivery', label: 'Manage Delivery', icon: Truck, path: '/seller/Delivery' },
    { id: 'payments', label: 'Payments', icon: Wallet, path: '/seller/payments' },
    // { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/seller/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/seller/settings' }
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Kyzen Seller">
      <Routes>
        <Route path="/dashboard" element={<SellerOverview />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/store" element={<MyStores />} />
        <Route path="/Delivery" element={<ManageDelivery />} />
        <Route path="/payments" element={<PaymentsWallet />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/" element={<Navigate to="/seller/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default SellerDashboard;