import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'platform',
  showApiModal: false,
  showRoleModal: false,
  editingRole: null,
  newApiKey: { platform: '', keyType: '', key: '' },
  showApiKeys: {},
};

const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setShowApiModal: (state, action) => {
      state.showApiModal = action.payload;
    },
    setShowRoleModal: (state, action) => {
      state.showRoleModal = action.payload;
    },
    setEditingRole: (state, action) => {
      state.editingRole = action.payload;
    },
    setNewApiKey: (state, action) => {
      state.newApiKey = action.payload;
    },
    resetNewApiKey: (state) => {
      state.newApiKey = { platform: '', keyType: '', key: '' };
    },
    toggleApiKeyVisibility: (state, action) => {
      const keyId = action.payload;
      state.showApiKeys[keyId] = !state.showApiKeys[keyId];
    },
    resetState: () => initialState,
  },
});

export const {
  setActiveTab,
  setShowApiModal,
  setShowRoleModal,
  setEditingRole,
  setNewApiKey,
  resetNewApiKey,
  toggleApiKeyVisibility,
  resetState,
} = superAdminSlice.actions;

export default superAdminSlice.reducer;