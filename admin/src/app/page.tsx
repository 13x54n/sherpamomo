'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { fetchDashboardStats as fetchStatsFromAPI, type DashboardStats } from '@/lib/api/stats';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500' },
  preparing: { label: 'Preparing', color: 'bg-orange-500' },
  ready: { label: 'Ready', color: 'bg-green-500' },
  delivered: { label: 'Delivered', color: 'bg-green-600' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' },
  completed: { label: 'Completed', color: 'bg-green-600' },
  failed: { label: 'Failed', color: 'bg-red-500' },
};

// Sherpa Momo color scheme matching frontend
const themeColors = {
  primary: 'bg-red-600', // Sherpa Red
  secondary: 'bg-yellow-500', // Sherpa Gold
  accent: 'bg-orange-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500'
};

export default function AdminDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStatsFromAPI();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Mock data as fallback
  const mockStats = {
    totalRevenue: 12543.67,
    totalOrders: 247,
    totalProducts: 89,
    totalCustomers: 156,
    pendingOrders: 12,
    deliveredToday: 8,
    recentOrders: [
      {
        id: 'ORD-001',
        customer: 'John Doe',
        total: 45.99,
        status: 'pending',
        date: '2024-01-15'
      },
      {
        id: 'ORD-002',
        customer: 'Jane Smith',
        total: 32.50,
        status: 'confirmed',
        date: '2024-01-15'
      },
      {
        id: 'ORD-003',
        customer: 'Bob Johnson',
        total: 67.25,
        status: 'delivered',
        date: '2024-01-14'
      }
    ],
    lowStockProducts: [
      { name: 'Chicken Momo', stock: 5 },
      { name: 'Buff Momo', stock: 3 },
      { name: 'Veg Momo', stock: 8 }
    ]
  };

  // Use real data if available, otherwise fallback to mock data
  const stats = dashboardData ? {
    totalRevenue: dashboardData.orders.totalRevenue,
    totalOrders: dashboardData.orders.totalOrders,
    totalProducts: dashboardData.products.totalProducts,
    totalCustomers: dashboardData.users.totalUsers,
    pendingOrders: dashboardData.orders.orderStats.pending,
    deliveredToday: dashboardData.orders.deliveredToday,
    recentOrders: dashboardData.orders.recentOrders,
    lowStockProducts: dashboardData.products.lowStockProducts,
    // Enhanced stats
    revenueChange: dashboardData.orders.revenueChange,
    orderChange: dashboardData.orders.orderChange,
    inventoryValue: dashboardData.products.totalInventoryValue,
    averageRating: dashboardData.products.averageRating,
    newProductsThisMonth: dashboardData.products.newProductsThisMonth,
    userGrowthRate: dashboardData.users.userGrowthRate
  } : {
    ...mockStats,
    revenueChange: 12.5,
    orderChange: 8.2,
    inventoryValue: 15432.67,
    averageRating: 4.3,
    newProductsThisMonth: 3,
    userGrowthRate: 15.3
  };

  const StatCard = ({ title, value, icon: Icon, trend }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-red-600 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
            )}
            <span className={trend.isPositive ? 'text-red-600' : 'text-red-600'}>
              {trend.value}%
            </span>
            <span className="ml-1">from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 lg:p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchDashboardData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDashboardData}
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: Math.abs(stats.revenueChange), isPositive: stats.revenueChange >= 0 }}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend={{ value: Math.abs(stats.orderChange), isPositive: stats.orderChange >= 0 }}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend={{ value: stats.newProductsThisMonth, isPositive: true }}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          trend={{ value: Math.abs(stats.userGrowthRate), isPositive: stats.userGrowthRate >= 0 }}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Inventory Value"
          value={`$${stats.inventoryValue.toLocaleString()}`}
          icon={Package}
        />
        <StatCard
          title="Average Rating"
          value={`${stats.averageRating}/5.0`}
          icon={Users}
        />
        <StatCard
          title="New Products"
          value={stats.newProductsThisMonth}
          icon={Package}
          trend={{ value: stats.newProductsThisMonth, isPositive: true }}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockProducts.length}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total}</p>
                    <Badge
                      variant="secondary"
                      className={`${statusConfig[order.status as keyof typeof statusConfig]?.color} text-white border-0 text-xs`}
                    >
                      {statusConfig[order.status as keyof typeof statusConfig]?.label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">Pending Orders</p>
                    <p className="text-sm text-yellow-700">Orders waiting for confirmation</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-900">{stats.pendingOrders}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Delivered Today</p>
                    <p className="text-sm text-green-700">Orders completed successfully</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-900">{stats.deliveredToday}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Low Stock Alert</p>
                    <p className="text-sm text-red-700">{stats.lowStockProducts.length} products need restocking</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-red-900">{stats.lowStockProducts.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {stats.lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <p className="font-medium text-red-900">{product.name}</p>
                    <p className="text-sm text-red-700">Only {product.stock} items left</p>
                  </div>
                  <Badge variant="outline" className="text-red-600 border-red-300">
                    Low Stock
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
