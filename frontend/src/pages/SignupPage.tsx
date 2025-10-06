import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Store, Truck, Shield, Eye, EyeOff, ArrowLeft, Upload, CircleCheck as CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

const SignupPage = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    businessName: "",
    gstNumber: "",
    panNumber: "",
  });
  const [files, setFiles] = useState<{
    gstCertificate: File | null;
    panCard: File | null;
    cancelledCheque: File | null;
  }>({
    gstCertificate: null,
    panCard: null,
    cancelledCheque: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleConfig = {
    seller: { icon: Store, color: "blue", title: "Seller Dashboard" },
    supplier: { icon: Truck, color: "emerald", title: "Supplier Dashboard" },
    admin: { icon: Shield, color: "orange", title: "Admin Dashboard" },
  };

  const config = roleConfig[role as keyof typeof roleConfig];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload PDF, JPG, or PNG files only');
        return;
      }

      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setFiles({
        ...files,
        [fieldName]: file,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (role !== 'admin') {
      if (!files.gstCertificate || !files.panCard || !files.cancelledCheque) {
        setError("Please upload all required documents");
        setLoading(false);
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', role!);

      if (role !== 'admin') {
        formDataToSend.append('phoneNumber', formData.phoneNumber);
        formDataToSend.append('businessName', formData.businessName);
        formDataToSend.append('gstNumber', formData.gstNumber);
        formDataToSend.append('panNumber', formData.panNumber);

        if (files.gstCertificate) formDataToSend.append('gstCertificate', files.gstCertificate);
        if (files.panCard) formDataToSend.append('panCard', files.panCard);
        if (files.cancelledCheque) formDataToSend.append('cancelledCheque', files.cancelledCheque);
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
        if (role === 'admin') {
          navigate(`/admin/dashboard`);
        } else {
          navigate(`/login/${role}`);
        }
      } else {
        setError(data.message || 'Registration failed');
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return <div>Invalid role</div>;
  }

  const IconComponent = config.icon;
  const isAdminRole = role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div
              className={`w-16 h-16 bg-${config.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-4`}
            >
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">Join our {config.title}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {!isAdminRole && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter business name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number *
                    </label>
                    <input
                      type="text"
                      id="gstNumber"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter GST number"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Number *
                    </label>
                    <input
                      type="text"
                      id="panNumber"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter PAN number"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Document Uploads</h3>

                  {['gstCertificate', 'panCard', 'cancelledCheque'].map((docType) => (
                    <div key={docType} className="border border-gray-300 rounded-xl p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {docType === 'gstCertificate' && 'GST Certificate *'}
                        {docType === 'panCard' && 'PAN Card *'}
                        {docType === 'cancelledCheque' && 'Cancelled Cheque *'}
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors">
                            {files[docType as keyof typeof files] ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                <span className="text-sm">{files[docType as keyof typeof files]!.name}</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-500">
                                <Upload className="w-5 h-5 mr-2" />
                                <span className="text-sm">Click to upload (PDF, JPG, PNG - Max 5MB)</span>
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, docType)}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-${config.color}-600 hover:bg-${config.color}-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to={`/login/${role}`}
                className={`text-${config.color}-600 hover:text-${config.color}-700 font-semibold`}
              >
                Sign in here
              </Link>
            </p>

            <div className="border-t pt-4 space-y-2">
              <p className="text-sm text-gray-500 mb-3">Need different access?</p>
              {role !== "seller" && (
                <Link to="/signup/seller" className="block text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Need seller access? Seller Signup
                </Link>
              )}
              {role !== "supplier" && (
                <Link to="/signup/supplier" className="block text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  Need supplier access? Supplier Signup
                </Link>
              )}
              {role !== "admin" && (
                <Link to="/signup/admin" className="block text-sm text-orange-600 hover:text-orange-700 font-medium">
                  Admin access? Admin Signup
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
