import React, { createContext, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCredentials, logout as logoutAction, setLoading } from '../store/slices/authSlice';
import { useLoginMutation, useRegisterMutation, useLogoutMutation, useGetProfileQuery } from '../store/slices/apiSlice';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery(undefined, { 
    skip: !isAuthenticated 
  });

  useEffect(() => {
    if (profileData?.success && profileData?.data) {
      dispatch(setCredentials(profileData.data));
    }
  }, [profileData, dispatch]);

  const login = async (email, password) => {
    try {
      dispatch(setLoading(true));
      const result = await loginMutation({ email, password }).unwrap();
      if (result.success) {
        dispatch(setCredentials(result.data));
        toast.success('Login successful!');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.data?.message || 'Login failed');
      return { success: false, message: error.data?.message || 'Login failed' };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const signup = async (email, password, name, role) => {
    try {
      dispatch(setLoading(true));
      const result = await registerMutation({ email, password, name, role }).unwrap();
      if (result.success) {
        dispatch(setCredentials(result.data));
        toast.success('Account created successfully!');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.data?.message || 'Registration failed');
      return { success: false, message: error.data?.message || 'Registration failed' };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      dispatch(logoutAction());
      toast.success('Logged out successfully!');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
