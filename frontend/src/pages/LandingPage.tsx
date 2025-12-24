import { useNavigate } from "react-router-dom";
import { Store, Truck, Shield, ArrowRight } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const dashboards = [
    {
      title: "Seller Dashboard",
      description:
        "Manage your online store, track orders, and grow your business with powerful analytics.",
      icon: Store,
      color: "bg-blue-600 hover:bg-blue-700",
      role: "seller",
      features: [
        "Product Management",
        "Order Tracking",
        "Analytics & Reports",
        "Payment Management",
      ],
    },
    {
      title: "Supplier Dashboard",
      description:
        "Manage your product catalog, connect with sellers, and streamline your wholesale operations.",
      icon: Truck,
      color: "bg-emerald-600 hover:bg-emerald-700",
      role: "supplier",
      features: [
        "Catalog Management",
        "Seller Network",
        "Inventory Control",
        "Approval System",
      ],
    },
    {
      title: "Admin Dashboard",
      description:
        "Oversee the entire platform, manage users, and access comprehensive business intelligence.",
      icon: Shield,
      color: "bg-orange-600 hover:bg-orange-700",
      role: "admin",
      features: [
        "User Management",
        "Platform Analytics",
        "Revenue Control",
        "System Monitoring",
      ],
    },
  ];

  const handleNavigate = (role) => {
    navigate(`/login/${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  MarketPlace
                </h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            One Platform, Unlimited Growth Choose <br></br> Your Roles to Begin
          </h2>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {dashboards.map((dashboard, index) => (
            <div
              key={index}
              className="bg-white rounded-md shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-8">
                <div
                  className={`w-16 h-16 rounded-md ${dashboard.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <dashboard.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {dashboard.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {dashboard.description}
                </p>

                <div className="space-y-3 mb-8">
                  {dashboard.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleNavigate(dashboard.role)}
                    className={`w-full ${dashboard.color} text-white py-3 px-6 rounded-md font-medium flex items-center justify-center transition-all duration-300 hover:scale-105`}
                  >
                    Access {dashboard.title.split(" ")[0]} Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>
              &copy; 2025 MarketPlace Platform. Built for sellers, suppliers,
              and administrators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
