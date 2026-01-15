import React, { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBagIcon,
  FileText,
  Eye,
  Building2,
  CreditCard,
  Phone,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const API_URL = "https://seller-final-2.onrender.com";

const SellerOverview = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/profile`, {
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        setUserData(result.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (filepath) => {
    if (filepath) {
      window.open(`${API_URL}/${filepath}`, "_blank");
    }
  };
  // Business Summary Mock Data
  const stats = [
    {
      title: "Total Orders Received",
      value: "1,847",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Total Revenue Generated",
      value: "₹4,67,890",
      change: "+18.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Pending Orders",
      value: "23",
      change: "-5.2%",
      trend: "down",
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      title: "Delivered Orders",
      value: "1,756",
      change: "+15.8%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
  ];

  // Revenue trends over time
  const revenueData = [
    { name: "Jan", revenue: 45000, orders: 145 },
    { name: "Feb", revenue: 52000, orders: 167 },
    { name: "Mar", revenue: 48000, orders: 156 },
    { name: "Apr", revenue: 61000, orders: 189 },
    { name: "May", revenue: 55000, orders: 172 },
    { name: "Jun", revenue: 67000, orders: 203 },
    { name: "Jul", revenue: 73000, orders: 234 },
  ];

  // Order volume trends
  const orderVolumeData = [
    { name: "Week 1", orders: 45 },
    { name: "Week 2", orders: 52 },
    { name: "Week 3", orders: 48 },
    { name: "Week 4", orders: 61 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Business Overview
          </h1>
          {/* <p className="text-gray-600 mt-1">
            Your business profile and verification status
          </p> */}
        </div>
      </div>

      {/* Business Information Card */}
      {/* <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Business Information</h2> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
      {/* Business Name */}
      {/* <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-50 rounded-md">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Business Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {userData?.businessName || 'N/A'}
              </p>
            </div>
          </div> */}

      {/* Phone Number */}
      {/* <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-50 rounded-md">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="text-lg font-semibold text-gray-900">
                {userData?.phoneNumber || 'N/A'}
              </p>
            </div>
          </div> */}

      {/* GST Number */}
      {/* <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-50 rounded-md">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">GST Number</p>
              <p className="text-lg font-semibold text-gray-900">
                {userData?.gstNumber || 'N/A'}
              </p>
            </div>
          </div> */}

      {/* PAN Number */}
      {/* <div className="flex items-start space-x-4">
            <div className="p-3 bg-orange-50 rounded-md">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">PAN Number</p>
              <p className="text-lg font-semibold text-gray-900">
                {userData?.panNumber || 'N/A'}
              </p>
            </div>
          </div>
        </div> */}

      {/* KYC Status */}
      {/* <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">KYC Verification Status</p>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userData?.kycStatus === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : userData?.kycStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {userData?.kycStatus === 'approved'
                    ? 'Verified'
                    : userData?.kycStatus === 'pending'
                    ? 'Pending Verification'
                    : 'Rejected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Documents Section */}
      {/* <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Uploaded Documents</h2> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}
      {/* GST Certificate */}
      {/* <div className="border border-gray-200 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">GST Certificate</span>
              </div>
            </div> */}
      {/* {userData?.kycDocuments?.gstCertificate ? (
              <button
                onClick={() => handleViewDocument(userData.kycDocuments.gstCertificate)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-mdg font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View Document</span>
              </button>
            ) : (
              <div className="text-center text-gray-500 text-sm py-2">
                Not uploaded
              </div>
            )}
          </div> */}

      {/* PAN Card */}
      {/* <div className="border border-gray-200 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">PAN Card</span>
              </div>
            </div>
            {userData?.kycDocuments?.panCard ? (
              <button
                onClick={() => handleViewDocument(userData.kycDocuments.panCard)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-mdg font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View Document</span>
              </button>
            ) : (
              <div className="text-center text-gray-500 text-sm py-2">
                Not uploaded
              </div>
            )}
          </div> */}

      {/* Cancelled Cheque */}
      {/* <div className="border border-gray-200 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Cancelled Cheque</span>
              </div>
            </div>
            {userData?.kycDocuments?.cancelledCheque ? (
              <button
                onClick={() => handleViewDocument(userData.kycDocuments.cancelledCheque)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-mdg font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View Document</span>
              </button>
            ) : (
              <div className="text-center text-gray-500 text-sm py-2">
                Not uploaded
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* Business Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-md p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-md ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div
                className={`flex items-center text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue and Order Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Trends
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
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
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Volume Trends */}
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Order Volume Trends
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Orders</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value) => [value, "Orders"]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="orders" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SellerOverview;
