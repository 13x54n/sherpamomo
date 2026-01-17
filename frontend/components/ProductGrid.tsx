"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    rating?: number;
    reviewCount?: number;
}

export default function ProductGrid({ products }: { products: Product[] }) {

    useEffect(() => {
        const savedPosition = sessionStorage.getItem('home_scroll_position');
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition));
            // Optional: Clear it if you only want it to persist for one navigation
            // For "Back to Menu" + Browser Back similarity, keeping it might be better, 
            // but usually standard to clear or overwrite. 
            // Let's NOT clear it immediately to handle browser 'back' button quirks if any.
        }
    }, []);

    const handleProductClick = () => {
        sessionStorage.setItem('home_scroll_position', window.scrollY.toString());
    };

    return (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
                <Link
                    href={`/product/${product.id}`}
                    key={product.id}
                    onClick={handleProductClick}
                    scroll={true} // Ensure normal navigation behavior
                >
                    <Card className="group border-2 shadow-none cursor-pointer">
                        <div className="aspect-[4/3] rounded-xl rounded-b-none overflow-hidden mb-4 relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        <div className="space-y-1 px-4 pb-4">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                                <span className="font-semibold text-sm bg-secondary/10 text-secondary px-2 py-0.5 rounded ml-2">
                                    ${product.price}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`text-sm ${i < Math.round(product.rating || 5) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                                    ))}
                                </div>
                                <span className="text-muted-foreground text-sm">({product.reviewCount || 10} reviews)</span>
                            </div>
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
