import { useState, useEffect, useRef } from 'react';
import apiClient from '../utils/api';

// Global cache store
const cache = new Map();
const subscribers = new Map();

// Cache manager
export const cacheManager = {
  get: (key) => cache.get(key),
  set: (key, data) => {
    cache.set(key, { data, timestamp: Date.now() });
    // Notify subscribers
    const subs = subscribers.get(key) || [];
    subs.forEach(callback => callback(data));
  },
  invalidate: (key) => {
    cache.delete(key);
    const subs = subscribers.get(key) || [];
    subs.forEach(callback => callback(null));
  },
  subscribe: (key, callback) => {
    if (!subscribers.has(key)) {
      subscribers.set(key, []);
    }
    subscribers.get(key).push(callback);
    return () => {
      const subs = subscribers.get(key) || [];
      const index = subs.indexOf(callback);
      if (index > -1) subs.splice(index, 1);
    };
  }
};

// Custom hook for API data
export const useApiData = (key, fetcher, options = {}) => {
  const { staleTime = 5 * 60 * 1000, enabled = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    // Check cache first
    const cached = cacheManager.get(key);
    if (cached && Date.now() - cached.timestamp < staleTime) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    // Subscribe to cache updates
    const unsubscribe = cacheManager.subscribe(key, (newData) => {
      if (mountedRef.current) {
        setData(newData);
        setLoading(false);
      }
    });

    // Fetch fresh data
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetcher();
        if (mountedRef.current) {
          setData(result);
          setError(null);
          cacheManager.set(key, result);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      unsubscribe();
      mountedRef.current = false;
    };
  }, [key, staleTime, enabled]);

  const refetch = () => {
    cacheManager.invalidate(key);
    setLoading(true);
  };

  return { data, loading, error, refetch };
};

// Specific hooks for different data types
export const useProducts = () => {
  return useApiData('products', () => apiClient.get('/api/admin/products'));
};

export const useKycData = () => {
  return useApiData('kyc', () => apiClient.get('/api/kyc/all'));
};

export const useSupplierProducts = () => {
  return useApiData('supplier-products', () => apiClient.get('/api/supplier/products'));
};

export const useDashboardCounts = () => {
  const { data: products } = useProducts();
  const { data: kyc } = useKycData();
  
  return {
    pendingProducts: products?.data?.filter(p => p.approvalStatus === 'pending').length || 0,
    pendingKyc: kyc?.data?.filter(user => user.kycStatus === 'pending').length || 0,
    pendingSupport: 3
  };
};