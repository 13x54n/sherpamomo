import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';

export default function CartPage() {
    const cartItems = [
        {
            id: '1',
            name: 'Steamed Chicken Momo',
            price: 12.99,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        }
    ];

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 5.00;
    const total = subtotal + shipping;

    return (
        <div className="container px-4 py-5 mx-auto">
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 py-2 bg-muted/20 rounded-full hover:bg-muted/40 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
            </Link>

            <h1 className="text-4xl font-bold font-heading mb-10">Your Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <Card key={item.id} className="flex flex-col sm:flex-row overflow-hidden border-border/50">
                                <div className="w-full sm:w-32 h-32 shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col sm:flex-row justify-between p-6 gap-4">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <p className="text-secondary font-semibold">${item.price}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center border border-border rounded-md">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="text-right min-w-[80px]">
                                            <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
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
                                <Link href="/menu">Browse Menu</Link>
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
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg">Proceed to Checkout</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
