'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Phone, User, Loader2, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/cart';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, checkout } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  // Pre-populate form with user data from profile (if available)
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
      }));

      // Load saved profile data from localStorage
      const savedProfile = localStorage.getItem(`sherpamomo_profile_${user.id}`);
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setFormData(prev => ({
            ...prev,
            phone: profile.phone || prev.phone,
            address: profile.address || prev.address,
          }));
        } catch (error) {
          console.warn('Failed to parse saved profile:', error);
        }
      }
    }
  }, [user]);

  const { items: cartItems, subtotal, totalItems } = cart;
  const shipping = totalItems > 0 ? 5.00 : 0;
  const total = subtotal + shipping;

  // Redirect if cart is empty
  if (cartItems.length === 0 && !isCompleted) {
    router.push('/cart');
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const result = await checkout({
        customerInfo: {
          name: formData.name.trim(),
          email: user?.email || '', // Use authenticated user's email
          phone: formData.phone.trim(),
          address: formData.address.trim()
        },
        paymentInfo: {
          method: 'cash_on_delivery'
        }
      });

      if (result.success) {
        // If user provided phone/address and we have a user, save to profile
        if (user && (formData.phone.trim() || formData.address.trim())) {
          try {
            const profileData = {
              phone: formData.phone.trim(),
              address: formData.address.trim(),
              updatedAt: new Date().toISOString()
            };
            localStorage.setItem(`sherpamomo_profile_${user.id}`, JSON.stringify(profileData));
            console.log('✅ Profile updated with checkout information');
          } catch (profileError) {
            console.warn('⚠️ Could not save profile:', profileError);
            // Don't show error to user as order was successful
          }
        }

        setIsCompleted(true);
        toast.success('Order placed successfully!');
      } else {
        toast.error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An error occurred while processing your order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[70vh] flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Your order has been placed and will be delivered to your address.
              Our team will contact you shortly for delivery confirmation.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/cart">Back to Cart</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-heading">Checkout</h1>
            <p className="text-muted-foreground mt-1">Complete your order with pay on delivery</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address *
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete delivery address"
                      rows={4}
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address}</p>
                    )}
                  </div>

                  

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      'Place Order - Pay on Delivery'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST/HST</span>
                    <span>${(subtotal * 0.13).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-muted/50 rounded p-3">
                  <p>🚚 Free delivery on orders over $50</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}