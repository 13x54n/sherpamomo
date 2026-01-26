'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types/product';
import { getProduct } from '@/lib/api/products';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Star, ChefHat } from 'lucide-react';
import ProductInteraction from '@/components/ProductInteraction';
import ReviewMarquee from '@/components/ReviewMarquee';

export default function ProductPage() {
    const params = useParams();
    const id = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id || id === 'undefined') {
                setError('Invalid product ID');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const productData = await getProduct(id);
                setProduct(productData);
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setError('Product not found');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                    >
                        Back to Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start lg:h-[calc(100vh-8rem)]">
                {/* Product Image */}
                <div className="relative aspect-[5/3] md:aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 text-lg px-4 py-1" variant="secondary">{product.category}</Badge>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center text-yellow-500">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="text-lg font-bold text-foreground ml-1.5">{product.rating}</span>
                            </div>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground underline decoration-dotted">{product.reviewCount} Reviews</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold font-heading leading-tight mb-2">
                            {product.name}
                        </h1>
                        <p className="text-3xl font-bold text-primary">
                            ${product.price}
                        </p>
                    </div>

                    <div>
                        {/* <span className="text-secondary font-semibold">Description:</span> */}
                        <p className="text-muted-foreground text-lg leading-relaxed ">
                            {product.description}
                        </p>
                    </div>

                    {/* Ingredients */}
                    <div className="bg-secondary/5 rounded-xl">
                        <div className="flex items-center gap-2 mb-4 text-secondary font-semibold">
                            <ChefHat className="w-5 h-5" />
                            <span>Ingredients</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {product.ingredients?.map((img) => (
                                <Badge key={img} variant="outline" className="bg-background/50 border-secondary/20 hover:border-secondary/50">
                                    {img}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Interaction - Client Component */}
                    <div className="pt-4">
                        <ProductInteraction
                            product={product}
                        />
                    </div>

                </div>
            </div>
            {/* Simple Reviews Section */}
            <div className="border-t border-border pt-4 ">
                {/* <h3 className="text-2xl font-bold mb-8">Customer Reviews</h3> */}
                <ReviewMarquee />
            </div>


        </div>
    );
}
