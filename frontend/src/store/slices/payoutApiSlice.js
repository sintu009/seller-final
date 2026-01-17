import { apiSlice } from "./apiSlice";

export const payoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPayouts: builder.query({
      query: () => "/admin/payouts",
      providesTags: ["Payout"],
    }),

    getPayoutById: builder.query({
      query: (id) => `/admin/payouts/${id}`,
      providesTags: ["Payout"],
    }),

    createPayout: builder.mutation({
      query: (data) => ({
        url: "/admin/payouts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payout"],
    }),

    updatePayout: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/payouts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Payout"],
    }),

    deletePayout: builder.mutation({
      query: (id) => ({
        url: `/admin/payouts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payout"],
    }),

    /* =========================
       SELLER / SUPPLIER PAYOUT APIs
       ========================= */

    getSellerPayouts: builder.query({
      query: () => "/seller/payouts/",
      providesTags: ["Payout"],
    }),

    getSupplierPayouts: builder.query({
      query: () => "/supplier/payouts/",
      providesTags: ["Payout"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllPayoutsQuery,
  useGetPayoutByIdQuery,
  useCreatePayoutMutation,
  useUpdatePayoutMutation,
  useDeletePayoutMutation,
  useGetSellerPayoutsQuery,
  useGetSupplierPayoutsQuery,
} = payoutApiSlice;
