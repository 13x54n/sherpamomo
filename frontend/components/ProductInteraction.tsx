"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/cart';
import { Product } from '@/types/product';

interface ProductInteractionProps {
    product: Product;
    basePrice?: number; // Keep for backward compatibility, but prefer product.price
    amountPerUnit?: number; // Keep for backward compatibility, but prefer product.amount
    unitName?: string; // Keep for backward compatibility, but prefer product.unit
}

export default function ProductInteraction({
    product,
    basePrice,
    amountPerUnit,
    unitName = "pcs"
}: ProductInteractionProps) {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const { addToCart } = useCart();

    // Use product data if available, fallback to props for backward compatibility
    const price = product?.price ?? basePrice ?? 0;
    const perUnit = product?.amount ?? amountPerUnit ?? 1;
    const unit = product?.unit ?? unitName;

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => Math.max(1, q - 1));

    const totalAmount = quantity * perUnit;
    const totalPrice = (quantity * price).toFixed(2);

    const handleAddToCart = async () => {
        if (product && !isLoading) {
            setIsLoading(true);
            try {
                addToCart(product, quantity);
                // Add a small delay to show the loading animation
                setTimeout(() => setIsLoading(false), 1000);
            } catch (error) {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-muted/30 rounded-xl border border-border/50">
                <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Per Quantity</span>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold font-heading">{totalAmount}</span>
                        <span className="text-sm font-medium text-muted-foreground">{unitName}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-background p-1.5 rounded-full shadow-sm border border-border/50">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={decrement}
                        disabled={quantity <= 1}
                        className="rounded-full h-10 w-10 hover:bg-muted text-foreground"
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={increment}
                        className="rounded-full h-10 w-10 hover:bg-muted text-foreground"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <Button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full text-lg h-14 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-3"
                size="lg"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <ShoppingCart className="w-5 h-5" />
                )}
                <span>{isLoading ? 'Adding...' : 'Add to Cart'}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-semibold ml-auto">
                    ${totalPrice}
                </span>
            </Button>

            {quantity >= 5 && (
                <p className="text-xs text-center text-primary font-medium animate-pulse">
                    🎉 Great choice! That's a feast!
                </p>
            )}
        </div>
    );
}
