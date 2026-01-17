import { apiSlice } from "./apiSlice";

export const storeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* =========================
       ADMIN STORE APIs
       ========================= */

    getAllStores: builder.query({
      query: () => "/admin/stores",
      providesTags: ["Store"],
    }),

    getStoreById: builder.query({
      query: (id) => `/admin/stores/${id}`,
      providesTags: ["Store"],
    }),

    /* =========================
       SELLER STORE APIs
       ========================= */

    getMyStores: builder.query({
      query: () => "/seller/stores/me",
      providesTags: ["Store"],
    }),

    connectStore: builder.mutation({
      query: (data) => ({
        url: "/seller/stores",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),

    updateStore: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/seller/stores/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),

    deleteStore: builder.mutation({
      query: (id) => ({
        url: `/seller/stores/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),

    /* =========================
       ACTIVE STORE MANAGEMENT
       ========================= */

    activateStore: builder.mutation({
      query: (id) => ({
        url: `/seller/stores/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Store"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllStoresQuery,
  useGetStoreByIdQuery,
  useGetMyStoresQuery,
  useConnectStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
  useActivateStoreMutation,
} = storeApiSlice;
