import {
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShoppingCart,
  Info,
} from "lucide-react";

export const notificationConfig = {
  user: {
    default: {
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
  },

  product: {
    success: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    error: {
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
    default: {
      icon: ShoppingCart,
      color: "bg-gray-100 text-gray-600",
    },
  },

  order: {
    success: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    error: {
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
    default: {
      icon: ShoppingCart,
      color: "bg-purple-100 text-purple-600",
    },
  },

  kyc: {
    warning: {
      icon: AlertTriangle,
      color: "bg-yellow-100 text-yellow-600",
    },
    default: {
      icon: AlertTriangle,
      color: "bg-yellow-100 text-yellow-600",
    },
  },

  default: {
    default: {
      icon: Info,
      color: "bg-gray-100 text-gray-600",
    },
  },
};
