"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/cart';
import { CartItem } from '@/types/cart';

export default function CartPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeItem } = useCart();
    const { items: cartItems, subtotal, totalItems } = cart;

    const shipping = totalItems > 0 ? 5.00 : 0;
    const total = subtotal + shipping;

    const handleCheckout = () => {
        // Navigate to checkout page for user information
        router.push('/checkout');
    };

    return (
        <div className="container px-4 py-5 mx-auto">
            <h1 className="text-4xl font-bold font-heading mb-10">Your Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.length > 0 ? (
                        cartItems.map((item: CartItem, i: number) => (
                            <Card key={i} className="flex flex-col sm:flex-row overflow-hidden border-border/50">
                                <div className="w-full sm:w-32 h-32 shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col sm:flex-row justify-between p-6 gap-4">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <p className="text-secondary font-semibold">${item.price} per {item.unit}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center border border-border rounded-md">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-none"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-none"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="text-right min-w-[80px]">
                                            <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 border border-dashed rounded-lg">
                            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
                            <Button asChild>
                                <Link href="/">Browse Menu</Link>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-24 border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Shipping</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Tax</span>
                                <span>${(subtotal * 0.13).toFixed(2)}</span> {/* 13% tax */}
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0}
                            >
                                Proceed to Checkout
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
