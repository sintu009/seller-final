const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const getAuthHeadersMultipart = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok && data.message) {
      throw new Error(data.message);
    }
    return data;
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok && result.message) {
      throw new Error(result.message);
    }
    return result;
  },

  async put(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok && result.message) {
      throw new Error(result.message);
    }
    return result;
  },

  async delete(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok && data.message) {
      throw new Error(data.message);
    }
    return data;
  },

  async postFormData(endpoint, formData) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeadersMultipart(),
      body: formData,
    });
    const data = await response.json();
    if (!response.ok && data.message) {
      throw new Error(data.message);
    }
    return data;
  },

  async putFormData(endpoint, formData) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      credentials: 'include',
      headers: getAuthHeadersMultipart(),
      body: formData,
    });
    const data = await response.json();
    if (!response.ok && data.message) {
      throw new Error(data.message);
    }
    return data;
  }
};

export default apiClient;
