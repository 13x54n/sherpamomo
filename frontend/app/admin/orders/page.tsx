'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Search,
  Eye,
  Edit,
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data - in production, fetch from API
const mockOrders = [
  {
    id: 'ORD-001',
    orderId: 'ORD-MKM0RAG4-QOHRW',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    },
    items: [
      { name: 'Chicken Momo', quantity: 2, price: 12.99 },
      { name: 'Buff Momo', quantity: 1, price: 11.99 }
    ],
    subtotal: 37.97,
    tax: 3.04,
    shipping: 5.00,
    total: 46.01,
    status: 'pending',
    paymentMethod: 'cash_on_delivery',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ORD-002',
    orderId: 'ORD-XYZ123ABC',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1987654321'
    },
    items: [
      { name: 'Veg Momo', quantity: 3, price: 9.99 }
    ],
    subtotal: 29.97,
    tax: 2.40,
    shipping: 0,
    total: 32.37,
    status: 'confirmed',
    paymentMethod: 'cash_on_delivery',
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-14T16:00:00Z'
  },
  {
    id: 'ORD-003',
    orderId: 'ORD-DEF456GHI',
    customer: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1122334455'
    },
    items: [
      { name: 'Chicken Momo', quantity: 1, price: 12.99 },
      { name: 'Veg Momo', quantity: 2, price: 9.99 }
    ],
    subtotal: 32.97,
    tax: 2.64,
    shipping: 0,
    total: 35.61,
    status: 'delivered',
    paymentMethod: 'cash_on_delivery',
    createdAt: '2024-01-13T12:15:00Z',
    updatedAt: '2024-01-14T14:30:00Z'
  }
];

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-500' },
  { value: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-500' },
  { value: 'preparing', label: 'Preparing', icon: Package, color: 'bg-orange-500' },
  { value: 'ready', label: 'Ready for Pickup', icon: CheckCircle, color: 'bg-green-500' },
  { value: 'delivered', label: 'Delivered', icon: Truck, color: 'bg-green-600' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-500' }
];

export default function AdminOrders() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedOrders = orders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      );
      setOrders(updatedOrders);
      toast.success(`Order status updated to ${statusOptions.find(s => s.value === newStatus)?.label}`);
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    if (!statusOption) return <Badge variant="outline">Unknown</Badge>;

    const Icon = statusOption.icon;
    return (
      <Badge variant="secondary" className={`${statusOption.color} text-white border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {statusOption.label}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all customer orders, update statuses, and track deliveries.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'delivered' && new Date(o.updatedAt).toDateString() === new Date().toDateString()).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {updatingStatus === order.id ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Updating...</span>
                      </div>
                    ) : (
                      <Select
                        value={order.status}
                        onValueChange={(newStatus) => handleStatusUpdate(order.id, newStatus)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <status.icon className="w-4 h-4" />
                                {status.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderId}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Order Information</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Order ID:</span> {selectedOrder.orderId}</p>
                    <p><span className="text-muted-foreground">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                    <p><span className="text-muted-foreground">Payment:</span> Cash on Delivery</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customer.name}</p>
                    <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customer.email}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.customer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.price}
                        </p>
                      </div>
                      <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>${selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="font-medium mb-2">Order Status</h4>
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}