import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  credentials: 'include',
  prepareHeaders: (headers, { endpoint }) => {
    if (endpoint !== 'createProduct') {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Product', 'User', 'KYC', 'Order'],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query({
      query: () => '/admin/products',
      providesTags: ['Product'],
      transformErrorResponse: (response) => {
        if (response.status === 401) {
          window.location.href = '/login/admin';
        }
        return response;
      },
    }),
    getSupplierProducts: builder.query({
      query: () => '/supplier/products',
      providesTags: ['Product'],
    }),
    getSellerProducts: builder.query({
      query: () => '/seller/products',
      providesTags: ['Product'],
    }),
    approveProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/products/${id}/approve`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    rejectProduct: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/admin/products/${id}/reject`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['Product'],
    }),
    createProduct: builder.mutation({
      query: (formData) => ({
        url: '/supplier/products',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Product'],
    }),
    
    // KYC
    getAllKYC: builder.query({
      query: () => '/kyc/all',
      providesTags: ['KYC'],
      transformErrorResponse: (response) => {
        if (response.status === 401) {
          window.location.href = '/login/admin';
        }
        return response;
      },
    }),
    approveKYC: builder.mutation({
      query: ({ id, plan }) => ({
        url: `/kyc/approve/${id}`,
        method: 'PUT',
        body: { plan },
      }),
      invalidatesTags: ['KYC'],
    }),
    rejectKYC: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/kyc/reject/${id}`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['KYC'],
    }),
    
    // Users
    getAllUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['User'],
    }),
    approveUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: ['User', 'KYC'],
    }),
    rejectUser: builder.mutation({
      query: ({ userId, reason }) => ({
        url: `/admin/users/${userId}/reject`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['User', 'KYC'],
    }),
    blockUser: builder.mutation({
      query: ({ userId, reason }) => ({
        url: `/admin/users/${userId}/block`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['User'],
    }),
    updateUserPlan: builder.mutation({
      query: ({ userId, plan }) => ({
        url: `/admin/users/${userId}/plan`,
        method: 'PUT',
        body: { plan },
      }),
      invalidatesTags: ['User', 'KYC'],
    }),
    
    // Auth
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getProfile: builder.query({
      query: () => '/auth/profile',
    }),
    
    // Supplier Dashboard
    getSupplierDashboard: builder.query({
      query: () => '/supplier/dashboard',
      providesTags: ['Product', 'Order'],
    }),
    
    // Orders
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),
    getAdminOrders: builder.query({
      query: () => '/orders/admin',
      providesTags: ['Order'],
      transformErrorResponse: (response) => {
        console.error('Admin orders API error:', response);
        if (response.status === 401) {
          window.location.href = '/login/admin';
        }
        return response;
      },
    }),
    getSupplierOrders: builder.query({
      query: () => '/orders/supplier',
      providesTags: ['Order'],
    }),
    getSellerOrders: builder.query({
      query: () => '/orders/seller',
      providesTags: ['Order'],
    }),
    approveOrder: builder.mutation({
      query: ({ orderId, notes }) => ({
        url: `/orders/${orderId}/approve`,
        method: 'PUT',
        body: { notes },
      }),
      invalidatesTags: ['Order'],
    }),
    rejectOrder: builder.mutation({
      query: ({ orderId, notes }) => ({
        url: `/orders/${orderId}/reject`,
        method: 'PUT',
        body: { notes },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetSupplierProductsQuery,
  useGetSellerProductsQuery,
  useApproveProductMutation,
  useRejectProductMutation,
  useCreateProductMutation,
  useGetAllKYCQuery,
  useApproveKYCMutation,
  useRejectKYCMutation,
  useGetAllUsersQuery,
  useApproveUserMutation,
  useRejectUserMutation,
  useBlockUserMutation,
  useUpdateUserPlanMutation,
  useGetSupplierDashboardQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useCreateOrderMutation,
  useGetAdminOrdersQuery,
  useGetSupplierOrdersQuery,
  useGetSellerOrdersQuery,
  useApproveOrderMutation,
  useRejectOrderMutation,
} = apiSlice;