import React, { useState } from "react";
import {
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Calendar,
  Filter,
  Eye,
  Plus,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const PaymentsWallet = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");

  // Mock data
  const walletBalance = {
    available: 2456.5, // Low balance to trigger recharge popup
    pending: 12345.75,
    total: 14802.25,
    minimumRequired: 5000, // Minimum balance required for operations
  };

  // Check if wallet balance is low
  const isLowBalance = walletBalance.available < walletBalance.minimumRequired;

  const paymentData = [
    { name: "Jan", earnings: 45000, payouts: 40000 },
    { name: "Feb", earnings: 52000, payouts: 47000 },
    { name: "Mar", earnings: 48000, payouts: 43000 },
    { name: "Apr", earnings: 61000, payouts: 55000 },
    { name: "May", earnings: 55000, payouts: 50000 },
    { name: "Jun", earnings: 67000, payouts: 60000 },
    { name: "Jul", earnings: 73000, payouts: 65000 },
  ];

  const recentTransactions = [
    {
      id: "TXN-AMZ-001",
      type: "Credit",
      description: "Order Payment Received",
      amount: 2999,
      platformMargin: 20, // ₹20 platform margin included
      status: "Completed",
      date: "2024-01-15",
      orderId: "#AMZ-12345",
      platform: "Amazon",
    },
    {
      id: "TXN-WLT-002",
      type: "Debit",
      description: "Wallet Recharge (Platform Margin: ₹20)",
      amount: 5000,
      platformMargin: 20,
      status: "Completed",
      date: "2024-01-15",
      orderId: null,
      platform: "Wallet",
    },
    {
      id: "TXN-FLK-003",
      type: "Credit",
      description: "Order Payment Received",
      amount: 7999,
      platformMargin: 20,
      status: "Completed",
      date: "2024-01-14",
      orderId: "#FLK-12346",
      platform: "Flipkart",
    },
    {
      id: "TXN-SUP-004",
      type: "Debit",
      description: "Supplier Payment (Base Cost)",
      amount: 1800,
      platformMargin: 0, // No margin on supplier payment
      status: "Completed",
      date: "2024-01-14",
      orderId: "#AMZ-12345",
      platform: "Supplier",
    },
    {
      id: "TXN-MSH-005",
      type: "Credit",
      description: "Order Payment Received",
      amount: 2499,
      platformMargin: 20,
      status: "Completed",
      date: "2024-01-13",
      orderId: "#MSH-12347",
      platform: "Meesho",
    },
    {
      id: "TXN-COM-006",
      type: "Debit",
      description: "Platform Commission (₹20 Margin Collected)",
      amount: 450,
      platformMargin: 20,
      status: "Completed",
      date: "2024-01-13",
      orderId: "#AMZ-12345",
      platform: "Commission",
    },
  ];

  // Wallet recharge options
  const rechargeOptions = [1000, 2500, 5000, 10000, 25000, 50000];

  const handleRecharge = (amount) => {
    setRechargeAmount(amount.toString());
    setShowRechargeModal(true);
  };

  const processRecharge = () => {
    // Here you would integrate with payment gateway
    alert(`Processing recharge of ₹${rechargeAmount}`);
    setShowRechargeModal(false);
    setRechargeAmount("");
  };

  const getTransactionColor = (type, status) => {
    if (status === "Processing") return "text-yellow-600";
    return type === "Credit" ? "text-green-600" : "text-red-600";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Low Balance Alert */}
      {isLowBalance && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 mr-4" />
              <div>
                <h3 className="text-xl font-bold">Low Wallet Balance!</h3>
                <p className="text-red-100">
                  Your wallet balance is below the minimum required amount.
                  Recharge now to continue operations.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRechargeModal(true)}
              className="bg-white text-red-600 px-6 py-3 rounded-md font-semibold hover:bg-red-50 transition-colors"
            >
              Recharge Now
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Wallet & Payments
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your prepaid wallet, earnings, and transaction history
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
          <button
            onClick={() => setShowRechargeModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Money
          </button>
        </div>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`rounded-md p-6 text-white ${
            isLowBalance
              ? "bg-gradient-to-br from-red-500 to-red-600"
              : "bg-gradient-to-br from-blue-600 to-blue-700"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-md">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div
                className={`text-sm ${
                  isLowBalance ? "text-red-100" : "text-blue-100"
                }`}
              >
                Available Balance
              </div>
              <div className="text-2xl font-bold">
                ₹{walletBalance.available.toLocaleString()}
              </div>
              {isLowBalance && (
                <div className="text-red-200 text-xs mt-1">
                  Below minimum required
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowRechargeModal(true)}
            className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            {isLowBalance ? "Recharge Wallet" : "Add Money"}
          </button>
        </div>

        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-md">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-right">
              <div className="text-gray-600 text-sm">Pending Balance</div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{walletBalance.pending.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">From recent orders...</div>
        </div>

        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-md">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-gray-600 text-sm">Total Balance</div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{walletBalance.total.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>Available + Pending</span>
          </div>
        </div>
      </div>

      {/* Quick Recharge Options */}
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Quick Recharge
          </h3>
          <span className="text-sm text-gray-500">
            Add money to your wallet instantly
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {rechargeOptions.map((amount) => (
            <button
              key={amount}
              onClick={() => handleRecharge(amount)}
              className="p-4 border-2 border-gray-200 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <div className="font-semibold text-gray-900">
                ₹{amount.toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Wallet Activity */}
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Wallet Activity
            </h3>
            <select
              className="bg-gray-50 border border-gray-200 rounded-mdg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value, name) => [
                  `₹${value.toLocaleString()}`,
                  name === "earnings" ? "Credits" : "Debits",
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="earnings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="payouts" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Payment Summary
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              View All
            </button>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-md">
                <div className="text-green-600 text-sm font-medium">
                  Total Credits
                </div>
                <div className="text-2xl font-bold text-green-700">₹45,678</div>
                <div className="text-xs text-green-600 mt-1">This month</div>
              </div>
              <div className="p-4 bg-red-50 rounded-md">
                <div className="text-red-600 text-sm font-medium">
                  Total Debits
                </div>
                <div className="text-2xl font-bold text-red-700">₹32,456</div>
                <div className="text-xs text-red-600 mt-1">This month</div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-md">
              <div className="text-blue-600 text-sm font-medium">
                Net Balance Change
              </div>
              <div className="text-2xl font-bold text-blue-700">+₹13,222</div>
              <div className="text-xs text-blue-600 mt-1">
                Positive growth this month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Margin Information */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-md p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 mr-3" />
            <div>
              <h3 className="text-xl font-bold">Platform Margin Information</h3>
              <p className="text-orange-100">
                ₹20 platform fee included in every product cost
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-md p-4">
          <div className="text-sm space-y-2">
            <div>
              <strong>How it works:</strong> ₹20 is automatically included in
              product costs
            </div>
            <div>
              <strong>Collection:</strong> Collected when you recharge your
              wallet
            </div>
            <div>
              <strong>Transparency:</strong> Built into product pricing for
              seamless operations
            </div>
            <div>
              <strong>Your Benefit:</strong> Simple pricing with no hidden
              charges
            </div>
          </div>
        </div>
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Recharge Wallet
              </h3>
              <p className="text-gray-600">
                Add money to your wallet for seamless operations
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-600">Available Balance</div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{walletBalance.available.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1000, 5000, 10000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setRechargeAmount(amount.toString())}
                    className="p-2 border border-gray-200 rounded-mdg hover:border-green-500 hover:bg-green-50 transition-colors text-sm"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              <div className="bg-orange-50 p-4 rounded-md border border-orange-200">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mr-2 mt-0.5" />
                  <div className="text-sm text-orange-800">
                    <div className="font-medium">
                      Platform Margin Collection
                    </div>
                    <div>
                      ₹20 platform fee will be collected from your recharge for
                      each processed order
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowRechargeModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processRecharge}
                  disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h3>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Transaction ID
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Description
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Platform
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Amount
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Platform Margin
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Date
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Order ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="font-mono text-sm text-blue-600">
                      {transaction.id}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-mdg mr-3 ${
                          transaction.type === "Credit"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "Credit" ? (
                          <ArrowDownRight
                            className={`w-4 h-4 ${getTransactionColor(
                              transaction.type,
                              transaction.status
                            )}`}
                          />
                        ) : (
                          <ArrowUpRight
                            className={`w-4 h-4 ${getTransactionColor(
                              transaction.type,
                              transaction.status
                            )}`}
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      {transaction.platform}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div
                      className={`font-semibold ${getTransactionColor(
                        transaction.type,
                        transaction.status
                      )}`}
                    >
                      {transaction.type === "Credit" ? "+" : "-"}₹
                      {transaction.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {transaction.platformMargin > 0 ? (
                      <div className="font-semibold text-orange-600">
                        ₹{transaction.platformMargin}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {transaction.date}
                  </td>
                  <td className="py-4 px-6">
                    {transaction.orderId ? (
                      <span className="font-mono text-sm text-blue-600">
                        {transaction.orderId}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Margin Breakdown */}
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Platform Margin Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-orange-50 rounded-md">
            <div className="text-orange-600 text-sm font-medium">
              Total Orders Processed
            </div>
            <div className="text-2xl font-bold text-orange-700">234</div>
            <div className="text-xs text-orange-600 mt-1">This month</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-md">
            <div className="text-orange-600 text-sm font-medium">
              Platform Margin Collected
            </div>
            <div className="text-2xl font-bold text-orange-700">₹4,680</div>
            <div className="text-xs text-orange-600 mt-1">234 orders × ₹20</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-md">
            <div className="text-blue-600 text-sm font-medium">
              Your Net Earnings
            </div>
            <div className="text-2xl font-bold text-blue-700">₹40,998</div>
            <div className="text-xs text-blue-600 mt-1">
              After platform margin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsWallet;
