import { apiSlice } from "./apiSlice";

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🧑‍💼 SELLER DASHBOARD
    getSellerDashboardCounts: builder.query({
      query: () => "/seller/dashboard-counts",
      providesTags: ["User", "Product", "KYC", "Order"],
    }),

    // 🧑‍💼 SUPPLIER DASHBOARD
    getSupplierDashboardCounts: builder.query({
      query: () => "/supplier/dashboard-counts",
      providesTags: ["Product", "Order"],
    }),
  }),
});

export const {
  useGetAdminDashboardCountsQuery,
  useGetSellerDashboardCountsQuery,
  useGetSupplierDashboardCountsQuery,
} = dashboardApiSlice;
