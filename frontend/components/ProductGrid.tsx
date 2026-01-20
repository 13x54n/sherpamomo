"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/cart';
import { Product } from '@/types/product';

export default function ProductGrid({ products }: { products: Product[] }) {
    const { addToCart } = useCart();
    const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Always try to restore scroll position if it exists
        // This handles returning from any page (product, cart, signin, etc.)
        const savedPosition = sessionStorage.getItem('home_scroll_position');

        if (savedPosition) {
            // Small delay to ensure the page has fully rendered
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedPosition));
            }, 100);
        } else {
            // No saved position - fresh page load, scroll to top
            window.scrollTo(0, 0);
        }

        // Save scroll position on scroll events
        const handleScroll = () => {
            sessionStorage.setItem('home_scroll_position', window.scrollY.toString());
        };

        // Throttle scroll events for better performance
        let scrollTimeout: NodeJS.Timeout;
        const throttledScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 100);
        };

        window.addEventListener('scroll', throttledScroll);

        // Save scroll position when page becomes hidden (user navigates away)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                sessionStorage.setItem('home_scroll_position', window.scrollY.toString());
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('scroll', throttledScroll);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearTimeout(scrollTimeout);
        };
    }, []);

    const handleProductClick = () => {
        sessionStorage.setItem('home_scroll_position', window.scrollY.toString());
    };

    const handleAddToCart = async (product: Product) => {
        if (loadingProducts.has(product.id)) return;

        setLoadingProducts(prev => new Set(prev).add(product.id));

        try {
            addToCart(product, 1);
            // Keep loading state for a bit to show the animation
            setTimeout(() => {
                setLoadingProducts(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(product.id);
                    return newSet;
                });
            }, 1000);
        } catch (error) {
            setLoadingProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.id);
                return newSet;
            });
        }
    };

    return (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {products.filter(product => product.id).map((product, i) => {
                return (
                    <Card
                        key={i}
                        className="group border-2 shadow-none flex flex-col h-full"
                    >
                        <Link
                            href={`/product/${product.id}`}
                            onClick={handleProductClick}
                            className="block aspect-[4/3] rounded-xl rounded-b-none overflow-hidden mb-4 relative"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </Link>

                        <div className="space-y-1 px-4 pb-2 flex-grow">
                            <Link href={`/product/${product.id}`} onClick={handleProductClick}>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    <span className="font-semibold text-sm bg-secondary/10 text-secondary px-2 py-0.5 rounded ml-2">
                                        ${product.price}
                                    </span>
                                </div>
                            </Link>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-sm ${i < Math.round(product.rating || 5) ? 'text-yellow-500' : 'text-gray-300'}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-muted-foreground text-sm">
                                    ({product.reviewCount || 10} reviews)
                                </span>
                            </div>
                        </div>

                        <div className="p-4 pt-2 mt-auto grid grid-cols-2 gap-3">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/product/${product.id}`} onClick={handleProductClick}>
                                    View More
                                </Link>
                            </Button>

                            <Button
                                onClick={() => handleAddToCart(product)}
                                disabled={loadingProducts.has(product.id)}
                            >
                                {loadingProducts.has(product.id) ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    'Add to Cart'
                                )}
                            </Button>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}