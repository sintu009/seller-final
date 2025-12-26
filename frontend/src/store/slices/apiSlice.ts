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
  tagTypes: ['Product', 'User', 'KYC', 'Order', 'Notification', 'Settings', 'ApiKey', 'Role'],
  endpoints: (builder) => ({
    //Dashbaord Counts
     getAdminDashboardCounts: builder.query({
      query: () => '/admin/dashboard-counts',
      providesTags: ['User', 'Product', 'KYC'],
    }),

    // Products
    getProducts: builder.query({
      query: () => '/admin/products',
      providesTags: ['Product'],
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
    
    getPendingProducts: builder.query({
      query: () => '/admin/products/pending',
      providesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/supplier/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    
    // KYC
    getAllKYC: builder.query({
      query: () => '/kyc/all',
      providesTags: ['KYC'],
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

    unBlockUser: builder.mutation({
      query: ({ userId,reason }) => ({
        url: `/admin/users/${userId}/unblock`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    resetPasswordUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/reset-password`,
        method: 'POST',
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
        url: credentials.role === 'super-admin' ? '/superadmin/verify' : '/auth/login',
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

    // Notifications
    getMyNotifications: builder.query({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),

    markNotificationsRead: builder.mutation({
      query: (ids) => ({
        url: '/notifications/mark-read',
        method: 'PUT',
        body: { ids },
      }),
      invalidatesTags: ['Notification'],
    }),

    deleteNotifications: builder.mutation({
      query: (ids) => ({
        url: '/notifications/delete',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: ['Notification'],
    }),
    
    getUnreadNotificationCount: builder.query({
      query: () => '/notifications/unread-count',
      providesTags: ['Notification'],
    }),

    // Super Admin Settings
    getPlatformSettings: builder.query({
      query: () => '/admin/settings/platform',
      providesTags: ['Settings'],
    }),
    updatePlatformSettings: builder.mutation({
      query: (settings) => ({
        url: '/admin/settings/platform',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    getCommissionSettings: builder.query({
      query: () => '/admin/settings/commission',
      providesTags: ['Settings'],
    }),
    updateCommissionSettings: builder.mutation({
      query: (settings) => ({
        url: '/admin/settings/commission',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    getApiKeys: builder.query({
      query: () => '/admin/api-keys',
      providesTags: ['ApiKey'],
    }),
    createApiKey: builder.mutation({
      query: (keyData) => ({
        url: '/admin/api-keys',
        method: 'POST',
        body: keyData,
      }),
      invalidatesTags: ['ApiKey'],
    }),
    deleteApiKey: builder.mutation({
      query: (keyId) => ({
        url: `/admin/api-keys/${keyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ApiKey'],
    }),
    
    getNotificationSettings: builder.query({
      query: () => '/admin/settings/notifications',
      providesTags: ['Settings'],
    }),
    updateNotificationSettings: builder.mutation({
      query: (settings) => ({
        url: '/admin/settings/notifications',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    getAdminRoles: builder.query({
      query: () => '/admin/roles',
      providesTags: ['Role'],
    }),
    createAdminRole: builder.mutation({
      query: (roleData) => ({
        url: '/admin/roles',
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: ['Role'],
    }),
    updateAdminRole: builder.mutation({
      query: ({ id, ...roleData }) => ({
        url: `/admin/roles/${id}`,
        method: 'PUT',
        body: roleData,
      }),
      invalidatesTags: ['Role'],
    }),
    deleteAdminRole: builder.mutation({
      query: (roleId) => ({
        url: `/admin/roles/${roleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),
  }),
});

export const {
  useGetAdminDashboardCountsQuery,
  useGetProductsQuery,
  useGetSupplierProductsQuery,
  useGetSellerProductsQuery,
  useApproveProductMutation,
  useRejectProductMutation,
  useCreateProductMutation,
  useGetPendingProductsQuery,
  useDeleteProductMutation,
  useGetAllKYCQuery,
  useApproveKYCMutation,
  useRejectKYCMutation,
  useGetAllUsersQuery,
  useApproveUserMutation,
  useRejectUserMutation,
  useBlockUserMutation,
  useUnBlockUserMutation,
  useDeleteUserMutation,
  useResetPasswordUserMutation,
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
  useGetMyNotificationsQuery,
  useMarkNotificationsReadMutation,
  useDeleteNotificationsMutation,
  useGetUnreadNotificationCountQuery,
  
  // Super Admin Settings
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
  useGetCommissionSettingsQuery,
  useUpdateCommissionSettingsMutation,
  useGetApiKeysQuery,
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useGetAdminRolesQuery,
  useCreateAdminRoleMutation,
  useUpdateAdminRoleMutation,
  useDeleteAdminRoleMutation,
} = apiSlice;