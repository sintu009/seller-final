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
import { useGetSupplierProductsQuery, useGetSupplierOrdersQuery } from '../../store/slices/apiSlice';
import { useAppSelector } from '../../store/hooks';

const SupplierOverview = () => {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const { data: productsData, isLoading: productsLoading } = useGetSupplierProductsQuery(undefined, {
        skip: !isAuthenticated || user?.role !== 'supplier'
    });

    const { data: ordersData, isLoading: ordersLoading } = useGetSupplierOrdersQuery(undefined, {
        skip: !isAuthenticated || user?.role !== 'supplier'
    });

    const products = productsData?.data || [];
    const orders = ordersData?.data || [];

    // Calculate real stats
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const pendingProducts = products.filter(p => p.status === 'pending').length;
    const totalRevenue = orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    const stats = [
        {
            title: 'Total Products Listed',
            value: totalProducts > 0 ? totalProducts.toString() : 'N/A',
            change: 'N/A',
            trend: 'up',
            icon: Package,
            color: 'text-blue-600 bg-blue-50'
        },
        {
            title: 'Total Orders Received',
            value: totalOrders > 0 ? totalOrders.toString() : 'N/A',
            change: 'N/A',
            trend: 'up',
            icon: ShoppingCart,
            color: 'text-green-600 bg-green-50'
        },
        {
            title: 'Revenue Generated',
            value: totalRevenue > 0 ? `₹${totalRevenue.toLocaleString()}` : 'N/A',
            change: 'N/A',
            trend: 'up',
            icon: DollarSign,
            color: 'text-emerald-600 bg-emerald-50'
        },
        {
            title: 'Pending Approvals',
            value: pendingProducts > 0 ? pendingProducts.toString() : 'N/A',
            change: 'N/A',
            trend: 'down',
            icon: Clock,
            color: 'text-orange-600 bg-orange-50'
        }
    ];

    // Revenue trends data from real orders
    const getMonthlyData = () => {
        const monthlyData = {};
        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { revenue: 0, orders: 0 };
            }
            monthlyData[monthKey].orders += 1;
            if (order.status === 'delivered') {
                monthlyData[monthKey].revenue += order.totalPrice || 0;
            }
        });
        return Object.entries(monthlyData).map(([name, data]) => ({
            name,
            revenue: data.revenue,
            orders: data.orders
        }));
    };

    const revenueData = orders.length > 0 ? getMonthlyData() : [
        { name: 'No Data', revenue: 0, orders: 0 }
    ];

    // Orders trend data from real orders (last 4 weeks)
    const getWeeklyData = () => {
        const weeklyData = {};
        const now = new Date();

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
            const weekNumber = Math.floor(daysDiff / 7) + 1;

            if (weekNumber <= 4) {
                const weekKey = `Week ${weekNumber}`;
                if (!weeklyData[weekKey]) {
                    weeklyData[weekKey] = 0;
                }
                weeklyData[weekKey] += 1;
            }
        });

        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(week => ({
            name: week,
            orders: weeklyData[week] || 0
        }));
    };

    const ordersChartData = orders.length > 0 ? getWeeklyData() : [
        { name: 'Week 1', orders: 0 },
        { name: 'Week 2', orders: 0 },
        { name: 'Week 3', orders: 0 },
        { name: 'Week 4', orders: 0 }
    ];

    // Recent orders from real data
    const recentOrders = orders.slice(0, 3).map(order => ({
        id: order.orderNumber,
        seller: order.seller?.name || 'N/A',
        product: order.product?.name || 'N/A',
        quantity: order.quantity,
        amount: order.totalPrice,
        status: order.status === 'pushed' ? 'Processing' :
            order.status === 'shipped' ? 'Shipped' :
                order.status === 'delivered' ? 'Delivered' : 'Pending',
        date: new Date(order.createdAt).toLocaleDateString()
    }));

    // Top selling products from real data
    const productOrderCounts = {};
    orders.forEach(order => {
        const productName = order.product?.name;
        if (productName) {
            if (!productOrderCounts[productName]) {
                productOrderCounts[productName] = { orders: 0, revenue: 0 };
            }
            productOrderCounts[productName].orders += 1;
            productOrderCounts[productName].revenue += order.totalPrice || 0;
        }
    });

    const topProducts = Object.entries(productOrderCounts)
        .map(([name, data]) => ({
            name,
            orders: data.orders,
            revenue: data.revenue,
            growth: 'N/A'
        }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 3);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Shipped': return 'bg-purple-100 text-purple-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (productsLoading || ordersLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-mdg shadow-md text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

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
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-semibold flex items-center transition-colors">
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
                        className="bg-white rounded-md p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-md ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            {stat.change !== 'N/A' && (
                                <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                                    {stat.change}
                                </div>
                            )}
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
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
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
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Orders Trend</h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Orders</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ordersChartData}>
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
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                        <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.map((order, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-emerald-100 rounded-mdg">
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
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
                        <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-mdg flex items-center justify-center text-white font-bold text-sm">
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