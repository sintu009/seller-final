import React, { useState } from "react";
import {
  User,
  Store,
  CreditCard,
  Shield,
  Bell,
  Save,
  Upload,
  Camera,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
} from "lucide-react";

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    orders: true,
    payments: true,
    marketing: false,
    security: true,
  });

  // KYC Status
  const [kycStatus] = useState({
    gstCertificate: "verified", // verified, pending, missing
    panCard: "verified",
    cancelledCheque: "pending",
    overall: "partial", // complete, partial, missing
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "business", label: "Business Info", icon: Store },
    { id: "kyc", label: "KYC Verification", icon: FileText },
    { id: "payments", label: "Payment Methods", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  const getKycStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "missing":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getKycStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "missing":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Photo */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-20 h-20 bg-[#2c3338] rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <button className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Camera className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Profile Picture
          </h3>
          <p className="text-gray-600 text-sm">Update your profile photo</p>
          <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Change Photo
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            defaultValue="John"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            defaultValue="Smith"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              defaultValue="john.smith@example.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              defaultValue="+91 98765 43210"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
          <textarea
            defaultValue="123 Main Street, Mumbai, Maharashtra 400001"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderBusinessTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            defaultValue="Smith Electronics"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type
          </label>
          <select className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Individual</option>
            <option>Partnership</option>
            <option>Private Limited</option>
            <option>Public Limited</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GST Number
          </label>
          <input
            type="text"
            defaultValue="22AAAAA0000A1Z5"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAN Number
          </label>
          <input
            type="text"
            defaultValue="ABCTY1234D"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Address
        </label>
        <textarea
          defaultValue="456 Business Park, Sector 18, Noida, Uttar Pradesh 201301"
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="url"
            defaultValue="https://smithelectronics.com"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Description
        </label>
        <textarea
          defaultValue="We are a leading electronics retailer specializing in consumer electronics, gadgets, and accessories."
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
      </div>

      {/* Document Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Business Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">GST Certificate</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Upload File
            </button>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">PAN Card</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Upload File
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKycTab = () => (
    <div className="space-y-6">
      {/* KYC Status Overview */}
      <div
        className={`p-6 rounded-md border-2 ${
          kycStatus.overall === "complete"
            ? "bg-green-50 border-green-200"
            : kycStatus.overall === "partial"
            ? "bg-yellow-50 border-yellow-200"
            : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {kycStatus.overall === "complete" ? (
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            ) : (
              <AlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                KYC Verification Status
              </h3>
              <p
                className={`text-sm ${
                  kycStatus.overall === "complete"
                    ? "text-green-700"
                    : kycStatus.overall === "partial"
                    ? "text-yellow-700"
                    : "text-red-700"
                }`}
              >
                {kycStatus.overall === "complete"
                  ? "Your KYC is complete and verified"
                  : kycStatus.overall === "partial"
                  ? "Some documents are pending verification"
                  : "KYC verification required to start selling"}
              </p>
            </div>
          </div>
          <div
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              kycStatus.overall === "complete"
                ? "bg-green-100 text-green-800"
                : kycStatus.overall === "partial"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {kycStatus.overall === "complete"
              ? "Verified"
              : kycStatus.overall === "partial"
              ? "Partial"
              : "Incomplete"}
          </div>
        </div>

        {kycStatus.overall !== "complete" && (
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-gray-900 mb-2">
              Required Actions:
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {kycStatus.gstCertificate === "missing" && (
                <li>• Upload GST Certificate</li>
              )}
              {kycStatus.panCard === "missing" && <li>• Upload PAN Card</li>}
              {kycStatus.cancelledCheque === "missing" && (
                <li>• Upload Cancelled Cheque</li>
              )}
              {kycStatus.gstCertificate === "pending" && (
                <li>• GST Certificate under review</li>
              )}
              {kycStatus.panCard === "pending" && (
                <li>• PAN Card under review</li>
              )}
              {kycStatus.cancelledCheque === "pending" && (
                <li>• Cancelled Cheque under review</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Document Upload Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Required Documents
        </h3>

        {/* GST Certificate */}
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-gray-400 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900">GST Certificate</h4>
                <p className="text-sm text-gray-600">
                  Upload your valid GST registration certificate
                </p>
              </div>
            </div>
            <div
              className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getKycStatusColor(
                kycStatus.gstCertificate
              )}`}
            >
              {getKycStatusIcon(kycStatus.gstCertificate)}
              <span className="ml-2 capitalize">
                {kycStatus.gstCertificate}
              </span>
            </div>
          </div>

          {kycStatus.gstCertificate === "verified" ? (
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    GST_Certificate_12345.pdf
                  </span>
                </div>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  View Document
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Drag and drop your GST certificate here, or click to browse
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                Choose File
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, JPG, PNG (Max 5MB)
              </p>
            </div>
          )}
        </div>

        {/* PAN Card */}
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-gray-400 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900">PAN Card</h4>
                <p className="text-sm text-gray-600">
                  Upload clear image of your PAN card
                </p>
              </div>
            </div>
            <div
              className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getKycStatusColor(
                kycStatus.panCard
              )}`}
            >
              {getKycStatusIcon(kycStatus.panCard)}
              <span className="ml-2 capitalize">{kycStatus.panCard}</span>
            </div>
          </div>

          {kycStatus.panCard === "verified" ? (
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    PAN_Card_ABCTY1234D.jpg
                  </span>
                </div>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  View Document
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Drag and drop your PAN card here, or click to browse
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                Choose File
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: JPG, PNG (Max 2MB)
              </p>
            </div>
          )}
        </div>

        {/* Cancelled Cheque */}
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-gray-400 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  Cancelled Cheque
                </h4>
                <p className="text-sm text-gray-600">
                  Upload cancelled cheque for bank verification
                </p>
              </div>
            </div>
            <div
              className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getKycStatusColor(
                kycStatus.cancelledCheque
              )}`}
            >
              {getKycStatusIcon(kycStatus.cancelledCheque)}
              <span className="ml-2 capitalize">
                {kycStatus.cancelledCheque}
              </span>
            </div>
          </div>

          {kycStatus.cancelledCheque === "pending" ? (
            <div className="bg-yellow-50 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-medium">
                    Cancelled_Cheque_123456.jpg
                  </span>
                </div>
                <span className="text-yellow-600 text-sm font-medium">
                  Under Review
                </span>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Drag and drop your cancelled cheque here, or click to browse
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                Choose File
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: JPG, PNG (Max 2MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Verification Notes */}
      <div className="bg-blue-50 p-6 rounded-md">
        <h4 className="font-semibold text-blue-900 mb-3">Important Notes:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• All documents must be clear and readable</li>
          <li>• Documents should be valid and not expired</li>
          <li>• Verification typically takes 24-48 hours</li>
          <li>
            • You'll receive email notifications about verification status
          </li>
          <li>• Complete KYC is mandatory to start selling on the platform</li>
        </ul>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Security Settings
        </h3>

        {/* Change Password */}
        <div className="bg-white border border-gray-200 rounded-md p-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Change Password</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Enter current password"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition-colors">
              Update Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-gray-900">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-500">
            When enabled, you'll need to enter a code from your phone in
            addition to your password
          </p>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
            >
              <div>
                <div className="font-medium text-gray-900 capitalize">
                  {key === "orders"
                    ? "Order Updates"
                    : key === "payments"
                    ? "Payment Notifications"
                    : key === "marketing"
                    ? "Marketing & Promotions"
                    : "Security Alerts"}
                </div>
                <div className="text-sm text-gray-600">
                  {key === "orders"
                    ? "Get notified about order status changes"
                    : key === "payments"
                    ? "Receive payment and payout updates"
                    : key === "marketing"
                    ? "Tips, promotions, and product updates"
                    : "Account security and login alerts"}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={value}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [key]: e.target.checked,
                    })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account preferences and business information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-md p-8 shadow-sm border border-gray-100">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "business" && renderBusinessTab()}
            {activeTab === "kyc" && renderKycTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "security" && renderSecurityTab()}
            {activeTab === "payments" && (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Payment Methods
                </h3>
                <p className="text-gray-600">
                  Configure your bank accounts and payment preferences
                </p>
              </div>
            )}

            {/* Save Button */}
            {(activeTab === "profile" ||
              activeTab === "business" ||
              activeTab === "notifications") && (
              <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold flex items-center transition-colors">
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
