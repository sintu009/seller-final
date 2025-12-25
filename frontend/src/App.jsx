import React,{useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TestLogin from './pages/TestLogin';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SellerDashboard from './pages/seller/SellerDashboard';
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { socket } from './socket';

function App() {
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    socket.on('NEW_SELLER_REGISTERED', (seller) => {
      console.log('🔥 Socket event received:', seller);

      // ✅ ADMIN-ONLY UI reaction
      if (user?.role === 'admin') {
        toast.info(`🆕 New seller registered: ${seller.name}`);
        dispatch(apiSlice.util.invalidateTags(['User', 'KYC']));
      }
    });

    return () => {
      socket.off('NEW_SELLER_REGISTERED');
    };
  }, [user, dispatch]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/test-login" element={<TestLogin />} />
            <Route path="/super-admin-login" element={<SuperAdminLogin />} />
            <Route path="/login/:role" element={<LoginPage />} />
            <Route path="/signup/:role" element={<SignupPage />} />
            <Route
              path="/seller/*"
              element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/supplier/*"
              element={
                <ProtectedRoute allowedRoles={['supplier']}>
                  <SupplierDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;