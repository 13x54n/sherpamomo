import { products } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Star, ChefHat } from 'lucide-react';
import { notFound } from 'next/navigation';
import ProductInteraction from '@/components/ProductInteraction';
import ReviewMarquee from '@/components/ReviewMarquee';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = products.find((p) => p.id === id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 px-4 py-2 bg-muted/20 rounded-full hover:bg-muted/40 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
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
                <div className="space-y-8">
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

                    <p className="text-muted-foreground text-lg leading-relaxed border-l-4 border-primary/20 pl-4">
                        {product.description}
                    </p>

                    {/* Ingredients */}
                    <div className="bg-secondary/5 rounded-xl p-6">
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
                            basePrice={product.price}
                            amountPerUnit={product.amount || 1}
                            unitName={product.unit || 'pcs'}
                        />
                    </div>

                </div>
            </div>
            {/* Simple Reviews Section */}
            <div className="border-t border-border pt-4 mt-15">
                <h3 className="text-2xl font-bold mb-8">Customer Reviews</h3>
                <ReviewMarquee />
            </div>


        </div>
    );
}
