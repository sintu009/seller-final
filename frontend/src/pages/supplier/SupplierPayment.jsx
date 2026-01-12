import React, { useState } from "react";
import {
  Search,
  Eye,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowDownLeft,
} from "lucide-react";
import DatePicker from "../../components/DatePicker.jsx";
import { useGetSupplierPayoutsQuery } from "../../store/slices/payoutApiSlice.js";

const SupplierPayment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState([]);

  const { data, isLoading } = useGetSupplierPayoutsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const payouts = data?.data || [];

  /* =========================
     FILTER LOGIC (FIXED)
     ========================= */
  const filteredPayments = payouts.filter((payout) => {
    const orderNumber = payout.order?.orderNumber || "";

    const matchesSearch = orderNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || payout.payoutStatus === selectedStatus;

    const matchesDate =
      dateRange.length !== 2 ||
      (new Date(payout.createdAt) >= dateRange[0] &&
        new Date(payout.createdAt) <= dateRange[1]);

    return matchesSearch && matchesStatus && matchesDate;
  });

  /* =========================
     STATS
     ========================= */
  const totalEarnings = payouts
    .filter((p) => p.payoutStatus === "paid")
    .reduce((sum, p) => sum + p.paidAmount, 0);

  const pendingPayments = payouts
    .filter((p) => p.payoutStatus === "pending")
    .reduce((sum, p) => sum + p.payableAmount, 0);

  if (isLoading) {
    return <div className="text-center py-10">Loading payments...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Track your payout history</p>
        </div>
        <DatePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Earnings"
          value={`₹${totalEarnings.toLocaleString()}`}
          color="green"
        />
        <StatCard
          title="Pending Payments"
          value={`₹${pendingPayments.toLocaleString()}`}
          color="yellow"
        />
        <StatCard
          title="Net Balance"
          value={`₹${totalEarnings.toLocaleString()}`}
          color="blue"
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-6 border rounded-md">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number..."
              className="pl-10 pr-4 py-3 w-full border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-3 border rounded-md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">Order</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredPayments.map((payout) => (
              <tr key={payout._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">{payout.order?.orderNumber}</div>
                  <div className="text-sm text-gray-500">
                    Order ID: {payout.order?._id}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center text-green-600">
                    <ArrowDownLeft className="w-4 h-4 mr-2" />
                    Credit
                  </div>
                </td>

                <td className="px-6 py-4 font-semibold text-green-600">
                  ₹
                  {payout.payoutStatus === "paid"
                    ? payout.paidAmount
                    : payout.payableAmount}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      payout.payoutStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payout.payoutStatus === "paid" ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <Clock className="w-4 h-4 mr-1" />
                    )}
                    {payout.payoutStatus}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-700">
                  <Calendar className="inline w-4 h-4 mr-2 text-gray-400" />
                  {new Date(payout.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            No payments found
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => {
  const colors = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
  };

  return (
    <div className="bg-white border rounded-md p-6">
      <div className="text-sm text-gray-600">{title}</div>
      <div className={`text-2xl font-bold ${colors[color]}`}>{value}</div>
    </div>
  );
};

export default SupplierPayment;
