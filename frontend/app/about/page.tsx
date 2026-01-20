import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ChefHat, Heart, Mountain, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="shrink-0">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-4xl font-bold font-heading">About Sherpa Momo</h1>
                        <p className="text-muted-foreground mt-2">Authentic Himalayan flavors, frozen with love</p>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="mb-12">
                    <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-primary/5">
                        <img
                            src="https://images.unsplash.com/photo-1552353288-5405ac4846f1?q=80&w=985&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Himalayan mountains"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8 text-white">
                            <h2 className="text-3xl font-bold font-heading mb-2">From the Himalayas to Your Table</h2>
                            <p className="text-lg opacity-90 max-w-md">Bringing authentic Nepali and Tibetan cuisine to food lovers worldwide</p>
                        </div>
                    </div>
                </div>

                {/* Story Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h3 className="text-2xl font-bold font-heading mb-6">Our Story</h3>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                Founded in 2020, Sherpa Momo began as a dream to share the rich culinary heritage of the Himalayas with the world. Our founders, originally from the mountainous regions of Nepal and Tibet, recognized the need for authentic frozen momos and Himalayan foods that maintained the traditional flavors and quality.
                            </p>
                            <p>
                                What started as a small kitchen operation has grown into a beloved brand, serving thousands of customers who crave the authentic taste of Himalayan cuisine. Every momo is handmade with traditional recipes passed down through generations, using only the finest ingredients.
                            </p>
                            <p>
                                We believe that food is more than just sustenance—it's a bridge between cultures, a way to share stories, and a connection to heritage. That's why we're committed to preserving traditional cooking methods while making them accessible to modern households.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ChefHat className="w-5 h-5 text-primary" />
                                    Traditional Craftsmanship
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Each momo is carefully hand-folded using techniques perfected over centuries in Himalayan kitchens. No shortcuts, just pure tradition.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-primary" />
                                    Quality Ingredients
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    We source the finest ingredients, from locally grown vegetables to premium meats, ensuring every bite tastes authentic.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mountain className="w-5 h-5 text-primary" />
                                    Himalayan Heritage
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Our recipes are rooted in centuries-old traditions, bringing the flavors of the Himalayas directly to your kitchen.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-16">
                    <h3 className="text-2xl font-bold font-heading mb-8 text-center">Our Values</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                            <h4 className="font-semibold mb-2">Community</h4>
                            <p className="text-sm text-muted-foreground">
                                Supporting local communities and sharing cultural heritage through authentic cuisine.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-primary" />
                            </div>
                            <h4 className="font-semibold mb-2">Authenticity</h4>
                            <p className="text-sm text-muted-foreground">
                                Preserving traditional recipes and cooking methods for genuine Himalayan flavors.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ChefHat className="w-8 h-8 text-primary" />
                            </div>
                            <h4 className="font-semibold mb-2">Quality</h4>
                            <p className="text-sm text-muted-foreground">
                                Every product meets our high standards for taste, freshness, and nutritional value.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-muted/30 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold font-heading mb-4">Ready to Experience Himalayan Flavors?</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Join thousands of satisfied customers who have discovered the authentic taste of Sherpa Momo.
                    </p>
                    <Button asChild size="lg">
                        <Link href="/">Explore Our Menu</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}