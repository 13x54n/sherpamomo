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

// Mock data - in production, fetch from API
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

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(false);

  // In production, fetch real data from API
  useEffect(() => {
    // fetchDashboardStats();
  }, []);

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
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
            )}
            <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
              {trend.value}%
            </span>
            <span className="ml-1">from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );

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
          onClick={() => {
            setLoading(true);
            // Simulate refresh
            setTimeout(() => setLoading(false), 1000);
          }}
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
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          trend={{ value: 15.3, isPositive: true }}
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
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">Pending Orders</p>
                    <p className="text-sm text-yellow-700">Orders waiting for confirmation</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-900">{stats.pendingOrders}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Delivered Today</p>
                    <p className="text-sm text-green-700">Orders completed successfully</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-900">{stats.deliveredToday}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900">Low Stock Alert</p>
                    <p className="text-sm text-orange-700">{stats.lowStockProducts.length} products need restocking</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-orange-900">{stats.lowStockProducts.length}</span>
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
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {stats.lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-orange-900">{product.name}</p>
                    <p className="text-sm text-orange-700">Only {product.stock} items left</p>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    Low Stock
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start space-y-2 hover:bg-accent"
              onClick={() => router.push('/admin/products')}
            >
              <Package className="h-6 w-6" />
              <div className="text-left">
                <div className="font-medium">Add New Product</div>
                <div className="text-xs text-muted-foreground">Create a new product listing</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start space-y-2 hover:bg-accent"
              onClick={() => router.push('/admin/orders')}
            >
              <ShoppingCart className="h-6 w-6" />
              <div className="text-left">
                <div className="font-medium">View All Orders</div>
                <div className="text-xs text-muted-foreground">Manage customer orders</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start space-y-2 opacity-50 cursor-not-allowed"
              disabled
            >
              <Users className="h-6 w-6" />
              <div className="text-left">
                <div className="font-medium">Manage Users</div>
                <div className="text-xs text-muted-foreground">Coming soon</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
