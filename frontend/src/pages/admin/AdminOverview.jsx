import React, { useState } from "react";
import { useGetAdminDashboardCountsQuery } from "../../store/slices/apiSlice";
import { useAppSelector } from "../../store/hooks";
import {
  Users,
  Building,
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
});

const AdminOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: dashboardResponse, isLoading: dashboardLoading } =
    useGetAdminDashboardCountsQuery(undefined, {
      skip: !isAuthenticated,
      pollingInterval: 30000,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    });

  // 🔥 KEEP VARIABLE NAME SAME
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
    },
  };

  const loading = dashboardLoading;

  const stats = [
    {
      title: "Total Sellers Registered",
      value: loading ? "..." : dashboardData.totalSellers.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Total Suppliers Registered",
      value: loading ? "..." : dashboardData.totalSuppliers.toLocaleString(),
      change: "+8.3%",
      trend: "up",
      icon: Building,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Total Products Listed",
      value: loading ? "..." : dashboardData.totalProducts.toLocaleString(),
      change: "+15.7%",
      trend: "up",
      icon: Package,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Total Orders Processed",
      value: loading ? "..." : dashboardData.totalOrders.toLocaleString(),
      change: "+22.1%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Total Revenue Generated",
      value: dashboardData.totalRevenue
        ? `₹${dashboardData.totalRevenue.toLocaleString()}`
        : "N/A",
      change: dashboardData.totalRevenue ? "+18.9%" : "N/A",
      trend: "up",
      icon: DollarSign,
      color: "text-orange-600 bg-orange-50",
    },
    {
      title: "Pending Approvals",
      value: loading ? "..." : dashboardData.pendingApprovals.toString(),
      change: "-5.2%",
      trend: "down",
      icon: Clock,
      color: "text-red-600 bg-red-50",
    },
  ];

  // Revenue trend data
  const revenueData = [
    { name: "Jan", revenue: 450000, orders: 2450 },
    { name: "Feb", revenue: 520000, orders: 2870 },
    { name: "Mar", revenue: 480000, orders: 2560 },
    { name: "Apr", revenue: 610000, orders: 3240 },
    { name: "May", revenue: 550000, orders: 2980 },
    { name: "Jun", revenue: 670000, orders: 3560 },
    { name: "Jul", revenue: 730000, orders: 3980 },
  ];

  // Orders by platform data
  const platformData = [
    { name: "Amazon", value: 45, orders: 40234, color: "#FF9500" },
    { name: "Flipkart", value: 30, orders: 26823, color: "#047BD1" },
    { name: "Meesho", value: 15, orders: 13412, color: "#9333EA" },
    { name: "Others", value: 10, orders: 8965, color: "#6B7280" },
  ];

  // Performance comparison data
  const performanceData = [
    { name: "Week 1", sellers: 85, suppliers: 45 },
    { name: "Week 2", sellers: 92, suppliers: 52 },
    { name: "Week 3", sellers: 78, suppliers: 48 },
    { name: "Week 4", sellers: 105, suppliers: 58 },
  ];

  // Recent activities
  const recentActivities = [
    {
      type: "approval",
      message: 'New seller "TechStore India" registered and pending approval',
      time: "2 minutes ago",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      type: "product",
      message:
        'Product "Wireless Headphones Pro" approved for supplier Kumar Electronics',
      time: "15 minutes ago",
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      type: "kyc",
      message:
        'KYC documents submitted by supplier "Electronics Manufacturing Ltd"',
      time: "1 hour ago",
      icon: AlertTriangle,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      type: "order",
      message: "High-value order ₹45,000 processed on Amazon platform",
      time: "2 hours ago",
      icon: ShoppingCart,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const pendingApprovals = [
    { type: "Seller KYC", count: 8, color: "bg-blue-100 text-blue-800" },
    {
      type: "Supplier KYC",
      count: 5,
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      type: "Product Approval",
      count: 15,
      color: "bg-purple-100 text-purple-800",
    },
    {
      type: "Payout Requests",
      count: 3,
      color: "bg-orange-100 text-orange-800",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Complete platform overview and management control
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="bg-white border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="year">This year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-md p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-md ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.change !== "N/A" && (
                <div
                  className={`flex items-center text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Trends
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#EA580C"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Platform */}
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Orders by Platform
          </h3>
          <div className="flex items-center justify-center mb-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {platformData.map((platform, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: platform.color }}
                  ></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {platform.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {platform.orders.toLocaleString()} orders
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {platform.value}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Seller vs Supplier Performance
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Sellers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Suppliers</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
              }}
            />
            <Bar dataKey="sellers" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="suppliers" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activities
            </h3>
            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div
                  className={`p-2 rounded-mdg ${activity.color} flex-shrink-0`}
                >
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Approvals
            </h3>
            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              Manage All
            </button>
          </div>
          <div className="space-y-4">
            {pendingApprovals.map((approval, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {approval.type}
                  </div>
                  <div className="text-sm text-gray-600">
                    Requires immediate attention
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${approval.color}`}
                  >
                    {approval.count} pending
                  </span>
                  <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
