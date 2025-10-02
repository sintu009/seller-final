import React from 'react';
import {
    Package,
    ShoppingCart,
    DollarSign,
    Clock,
    TrendingUp,
    Users,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const SupplierOverview = () => {
    // Mock data for supplier analytics
    const stats = [
        {
            title: 'Total Products Listed',
            value: '156',
            change: '+8.2%',
            trend: 'up',
            icon: Package,
            color: 'text-blue-600 bg-blue-50'
        },
        {
            title: 'Total Orders Received',
            value: '2,847',
            change: '+15.3%',
            trend: 'up',
            icon: ShoppingCart,
            color: 'text-green-600 bg-green-50'
        },
        {
            title: 'Revenue Generated',
            value: '₹8,45,670',
            change: '+22.1%',
            trend: 'up',
            icon: DollarSign,
            color: 'text-emerald-600 bg-emerald-50'
        },
        {
            title: 'Pending Approvals',
            value: '23',
            change: '-5.2%',
            trend: 'down',
            icon: Clock,
            color: 'text-orange-600 bg-orange-50'
        }
    ];

    // Revenue trends data
    const revenueData = [
        { name: 'Jan', revenue: 65000, orders: 245 },
        { name: 'Feb', revenue: 72000, orders: 287 },
        { name: 'Mar', revenue: 68000, orders: 256 },
        { name: 'Apr', revenue: 81000, orders: 324 },
        { name: 'May', revenue: 75000, orders: 298 },
        { name: 'Jun', revenue: 87000, orders: 356 },
        { name: 'Jul', revenue: 94000, orders: 398 }
    ];

    // Orders trend data
    const ordersData = [
        { name: 'Week 1', orders: 85 },
        { name: 'Week 2', orders: 92 },
        { name: 'Week 3', orders: 78 },
        { name: 'Week 4', orders: 105 }
    ];

    // Recent orders
    const recentOrders = [
        {
            id: '#ORD-12345',
            seller: 'TechStore India',
            product: 'Wireless Headphones Pro',
            quantity: 2,
            amount: 5998,
            status: 'Processing',
            date: '2024-01-15'
        },
        {
            id: '#ORD-12346',
            seller: 'ElectroMart',
            product: 'Bluetooth Speaker',
            quantity: 1,
            amount: 3499,
            status: 'Shipped',
            date: '2024-01-14'
        },
        {
            id: '#ORD-12347',
            seller: 'GadgetHub',
            product: 'Phone Case Premium',
            quantity: 5,
            amount: 2995,
            status: 'Delivered',
            date: '2024-01-13'
        }
    ];

    // Top selling products
    const topProducts = [
        {
            name: 'Wireless Headphones Pro',
            orders: 245,
            revenue: 73455,
            growth: '+15%'
        },
        {
            name: 'Bluetooth Speaker Premium',
            orders: 189,
            revenue: 66115,
            growth: '+22%'
        },
        {
            name: 'Phone Case Set',
            orders: 167,
            revenue: 9983,
            growth: '+8%'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Shipped': return 'bg-purple-100 text-purple-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Supplier Analytics</h1>
                    <p className="text-gray-600 mt-1">
                        Complete overview of your supplier business performance
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-colors">
                        <Package className="w-5 h-5 mr-2" />
                        Add New Product
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                                {stat.change}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-600 text-sm">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Revenue Trends */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">Revenue</span>
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10B981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders Trend */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Orders Trend</h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Orders</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ordersData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                formatter={(value) => [value, 'Orders']}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px'
                                }}
                            />
                            <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Orders & Top Products */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                        <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.map((order, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <ShoppingCart className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{order.id}</div>
                                        <div className="text-sm text-gray-600">{order.seller}</div>
                                        <div className="text-xs text-gray-500">{order.product}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-gray-900">₹{order.amount.toLocaleString()}</div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
                        <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{product.name}</div>
                                        <div className="text-sm text-gray-600">{product.orders} orders</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</div>
                                    <div className="text-sm text-green-600 font-medium">{product.growth}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierOverview;