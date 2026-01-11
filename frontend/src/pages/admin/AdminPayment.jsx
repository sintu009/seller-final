import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  Clock,
  Eye,
  User,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import { socket } from "../../socket";
import DatePicker from "../../components/DatePicker";

import {
  useGetAllPayoutsQuery,
  useUpdatePayoutMutation,
} from "../../store/slices/payoutApiSlice";

const AdminPayment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");
  const [dateRange, setDateRange] = useState([]);

  const { data, isLoading, refetch } = useGetAllPayoutsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updatePayout] = useUpdatePayoutMutation();
  const payouts = data?.data || [];

  useEffect(() => {
    socket.on("PAYOUT_UPDATED", refetch);
    return () => socket.off("PAYOUT_UPDATED", refetch);
  }, [refetch]);

  const today = new Date();

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch =
      payout.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.orderId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUser =
      selectedUser === "all" || payout.userRole === selectedUser;

    const matchesDate =
      dateRange.length !== 2 ||
      (new Date(payout.createdAt) >= dateRange[0] &&
        new Date(payout.createdAt) <= dateRange[1]);

    return matchesSearch && matchesUser && matchesDate;
  });

  const markAsPaid = async (payout) => {
    try {
      await updatePayout({
        id: payout.payoutId,
        paidAmount: payout.payableAmount,
        payoutMode: "bank_transfer",
      }).unwrap();

      toast.success("Payout marked as paid");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update payout");
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading payments...</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Summary</h1>
          <p className="text-gray-600">
            Review and manage seller & supplier payouts
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            <option value="all">All Users</option>
            <option value="seller">Seller</option>
            <option value="supplier">Supplier</option>
          </select>

          <DatePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-6 border rounded-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order, product or user..."
            className="pl-10 pr-4 py-3 w-full border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">Order / Product</th>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredPayouts.map((payout) => {
              const isOverdue =
                payout.dueDate &&
                new Date(payout.dueDate) < today &&
                payout.payoutStatus !== "paid";

              return (
                <tr
                  key={payout.payoutId}
                  className={`hover:bg-gray-50 ${isOverdue ? "bg-red-50" : ""}`}
                >
                  {/* ORDER / PRODUCT */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {payout.productName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Order ID: {payout.orderId}
                    </div>
                    <div className="text-xs text-gray-400">
                      Created: {new Date(payout.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* USER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-gray-900">{payout.userName}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {payout.userRole}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* AMOUNT */}
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>Payable: ₹{payout.payableAmount}</div>
                      <div className="text-green-600">
                        Paid: ₹{payout.paidAmount}
                      </div>
                    </div>
                  </td>

                  {/* STATUS + DUE DATE */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        payout.payoutStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payout.payoutStatus}
                    </span>

                    {payout.dueDate && (
                      <div
                        className={`text-xs mt-1 flex items-center gap-1 ${
                          isOverdue ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        {isOverdue && <AlertTriangle className="w-3 h-3" />}
                        Due: {new Date(payout.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4">
                    {payout.payoutStatus !== "paid" && (
                      <button
                        onClick={() => markAsPaid(payout)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                        title="Mark as Paid"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}

                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredPayouts.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No payouts found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayment;