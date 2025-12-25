import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { useLoginMutation } from "../store/slices/apiSlice";
import { setCredentials } from "../store/slices/authSlice";
import { Store, Truck, Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginMutation] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleConfig = {
    seller: { icon: Store, color: "blue", title: "Seller Dashboard" },
    supplier: { icon: Truck, color: "emerald", title: "Supplier Dashboard" },
    admin: { icon: Shield, color: "orange", title: "Admin Dashboard" },
  };

  const config = roleConfig[role as keyof typeof roleConfig];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginMutation({ email, password }).unwrap();
      if (result.success) {
        dispatch(setCredentials(result.data));
        toast.success("Login successful!");
        navigate(`/${role}/dashboard`);
      }
    } catch (err: any) {
      const errorMessage =
        err.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return <div>Invalid role</div>;
  }

  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-md shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`w-16 h-16 bg-${config.color}-600 rounded-md flex items-center justify-center mx-auto mb-4`}
            >
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to your {config.title}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-${config.color}-600 hover:bg-${config.color}-700 text-white py-3 px-6 rounded-md font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to={`/signup/${role}`}
                className={`text-${config.color}-600 hover:text-${config.color}-700 font-semibold`}
              >
                Sign up here
              </Link>
            </p>

            <div className="border-t pt-4 space-y-2">
              <p className="text-sm text-gray-500 mb-3">
                Need different access?
              </p>
              {role !== "seller" && (
                <Link
                  to="/login/seller"
                  className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Need seller access? Seller Login
                </Link>
              )}
              {role !== "supplier" && (
                <Link
                  to="/login/supplier"
                  className="block text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Need supplier access? Supplier Login
                </Link>
              )}
              {role !== "admin" && (
                <Link
                  to="/login/admin"
                  className="block text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Admin access? Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
