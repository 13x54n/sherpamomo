'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  Eye,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { getUserOrders, Order } from '@/lib/api/orders';
import { toast } from 'sonner';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'bg-orange-500', icon: Package },
  ready: { label: 'Ready for Pickup', color: 'bg-green-500', icon: CheckCircle },
  delivered: { label: 'Delivered', color: 'bg-green-600', icon: Truck },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: XCircle },
  completed: { label: 'Completed', color: 'bg-green-600', icon: CheckCircle },
  failed: { label: 'Failed', color: 'bg-red-500', icon: XCircle },
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated (only after loading is complete)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch orders when authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetchOrders();
    }
  }, [isLoading, isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading order history...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const userOrders = await getUserOrders();
      setOrders(userOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load your orders. Please try again.');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status: Order['status']) => {
    const config = statusConfig[status];
    const Icon = config?.icon || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const getStatusColor = (status: Order['status']) => {
    return statusConfig[status]?.color || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
           
            <div>
              <h1 className="text-4xl font-bold font-heading">Order History</h1>
              <p className="text-muted-foreground mt-1">Track your past orders</p>
            </div>
          </div>

          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Loading your orders...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            
            <div>
              <h1 className="text-4xl font-bold font-heading">Order History</h1>
              <p className="text-muted-foreground mt-1">Track your past orders</p>
            </div>
          </div>

          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Failed to Load Orders</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchOrders}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          
          <div>
            <h1 className="text-4xl font-bold font-heading">Order History</h1>
            <p className="text-muted-foreground mt-1">
              Track your past orders and delivery status
            </p>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start exploring our delicious momos!
            </p>
            <Button asChild>
              <Link href="/">Browse Menu</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                        <Badge
                          variant="secondary"
                          className={`${getStatusColor(order.status)} text-white border-0`}
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            <span>{statusConfig[order.status]?.label || 'Unknown'}</span>
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/orders/${order.orderId}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Order Items Preview */}
                  <div className="space-y-3 mb-4">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    ))}

                    {order.items.length > 2 && (
                      <p className="text-sm text-muted-foreground text-center">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  {/* Order Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Tax:</span>
                        <span>${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Shipping:</span>
                        <span>${order.shipping.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {order.customerInfo && (
                    <>
                      <Separator className="my-4" />
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">Delivery to:</p>
                        <p className="font-medium">{order.customerInfo.name}</p>
                        <p className="text-muted-foreground">{order.customerInfo.phone}</p>
                        <p className="text-muted-foreground">{order.customerInfo.address}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}