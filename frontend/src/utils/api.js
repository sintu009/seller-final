const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json'
  };
};

const getAuthHeadersMultipart = () => {
  return {};
};

// Simple error handling for auth failures
const handleAuthError = (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export const apiClient = {
  async get(endpoint) {
    console.log('API GET request to:', `${API_URL}${endpoint}`);
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders(),
    });
    
    console.log('Response status:', response.status);
    
    if (response.status === 401) {
      handleAuthError(response);
      throw new Error('Authentication failed');
    }
    
    const text = await response.text();
    console.log('Response text preview:', text.substring(0, 100));
    
    if (text.startsWith('<!DOCTYPE')) {
      throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
    }
    
    try {
      const data = JSON.parse(text);
      if (!response.ok && data.message) {
        throw new Error(data.message);
      }
      return data;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid response from server');
    }
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (response.status === 401) {
      handleAuthError(response);
      throw new Error('Authentication failed');
    }
    
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
    
    if (response.status === 401) {
      handleAuthError(response);
      throw new Error('Authentication failed');
    }
    
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
    
    if (response.status === 401) {
      handleAuthError(response);
      throw new Error('Authentication failed');
    }
    
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
    
    if (response.status === 401) {
      handleAuthError(response);
      throw new Error('Authentication failed');
    }
    
    const data = await response.json();
    if (!response.ok && data.message) {
      throw new Error(data.message);
    }
    return data;
  }
};

export default apiClient;
