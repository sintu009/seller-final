import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useLoginMutation } from "../store/slices/apiSlice";
import { setCredentials } from "../store/slices/authSlice";

const SuperAdminLogin = () => {
  const [loginMutation] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    pin: ["", "", "", "", "", ""],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...formData.pin];
    newPin[index] = value.slice(-1);
    setFormData((prev) => ({ ...prev, pin: newPin }));

    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !formData.pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

  const pinString = formData.pin.join("");

  if (!formData.username || !formData.password || pinString.length !== 6) {
    setError("Email, password and 6-digit PIN are required");
    return;
  }

    try {
      const result = await loginMutation({ username: formData.username, password: formData.password, pin: pinString, role:"super-admin" }).unwrap();
      console.log("Login successful:", result);
      dispatch(setCredentials(result.data));
      toast.success("Super Admin login successful!");
      navigate("/super-admin/dashboard");
    } catch (err: any) {
      setError("Login failed");
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link
          to="/"
          className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-gray-800 border border-purple-500/30 rounded-md shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Super Admin Access
            </h2>
            <p className="text-gray-400">
              Restricted Area - Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Username or Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Enter your username or email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                6-Digit Security PIN
              </label>
              <div className="flex justify-center space-x-3 mb-2">
                {formData.pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="w-12 h-12 bg-gray-700 border border-gray-600 rounded-md text-white text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    maxLength={1}
                    required
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center">
                Enter your 6-digit security PIN
              </p>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={false}
              className="w-full bg-[#ea9a39] text-white py-3 px-6 rounded-md font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
              <Shield className="w-5 h-5 mr-2" />
              Access Super Admin
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="border-t border-gray-700 pt-6 space-y-3">
              <p className="text-sm text-gray-400 mb-3">Regular Access</p>
              <div className="flex justify-center space-x-6">
                <Link
                  to="/login/admin"
                  className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Admin Login
                </Link>
                <Link
                  to="/login/seller"
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Seller Login
                </Link>
                <Link
                  to="/login/supplier"
                  className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Supplier Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This is a restricted area. All access attempts are logged and
            monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
