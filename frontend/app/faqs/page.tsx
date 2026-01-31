import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, ChefHat } from 'lucide-react';

export default function FAQsPage() {
    const faqs = [
        {
            question: "What makes Sherpa Momo different from other frozen foods?",
            answer: "Sherpa Momo offers authentic Himalayan cuisine made with traditional recipes and premium ingredients. Our momos are handmade by skilled artisans using techniques passed down through generations, ensuring the authentic flavors and textures of Nepali cuisine."
        },
        {
            question: "How should I cook the frozen momos?",
            answer: "Our momos are non-cooked and frozen for convenience. Simply steam them for 15 minutes on boiling water. For best results, steam them to preserve the delicate wrapper texture."
        },
        {
            question: "Are your products gluten-free?",
            answer: "Most of our products contain wheat flour in the wrappers. However, we offer some gluten-free options like our chicken and vegetable fillings. Please check individual product labels for specific allergen information."
        },
        {
            question: "How long do the products stay fresh?",
            answer: "When stored in your freezer at 0°F (-18°C) or below, our products maintain their quality for up to 6 months from the date of manufacture. Once thawed, consume within 24 hours and do not refreeze."
        },
        {
            question: "Do you offer vegetarian and vegan options?",
            answer: "Yes! We offer a variety of vegetarian options including Paneer Momo, vegetable momos, and our sauce line. Our Momo Sauce (Achar) and Momo Jhol are vegan-friendly."
        },
        {
            question: "What is the shelf life of your sauces?",
            answer: "Our sauces have a shelf life of 12 months when stored in a cool, dry place. Once opened, refrigerate and consume within 3 months for best quality."
        },
        {
            question: "Can I freeze the sauces after opening?",
            answer: "We recommend consuming our sauces within 3 months after opening when refrigerated. Freezing opened sauces may affect texture and flavor, so we don't recommend it."
        },
        {
            question: "Are your products halal certified?",
            answer: "Our meat products are prepared according to Islamic dietary guidelines. However, we don't have official halal certification. Our preparation follows traditional Himalayan methods that align with halal principles."
        },
        {
            question: "Do you ship internationally?",
            answer: "Currently, we ship within the GTA, Ontario, Canada. International shipping may be available in the future."
        },
        {
            question: "What are your shipping costs?",
            answer: "Shipping costs vary based on location and order size. Orders over $50 qualify for free shipping. Standard shipping typically takes 1 business days."
        },
        {
            question: "How do I store the products after delivery?",
            answer: "Keep all products frozen at 0°F (-18°C) or below until ready to use. Our packaging is designed to maintain quality during shipping, so transfer items to your freezer immediately upon arrival."
        },
        {
            question: "Can I modify my order after placing it?",
            answer: "Orders can be modified within 2 hours of placement. Please contact our customer service team immediately if you need to make changes. Once processing begins, modifications may not be possible."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="max-w-4xl mx-auto">

                {/* Hero Section */}
                <div className="mb-12">
                    <div className="text-center bg-muted/30 rounded-2xl p-8">
                        <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold font-heading mb-4">Have Questions? We've Got Answers!</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Browse our comprehensive FAQ section to learn more about our products, shipping, and everything Sherpa Momo.
                            Can't find what you're looking for? Contact our customer service team.
                        </p>
                    </div>
                </div>

                {/* FAQ Accordion */}
                <div className="mb-16">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    <span className="font-medium">{faq.question}</span>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* Quick Help Cards */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <Card className="text-center">
                        <CardHeader>
                            <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                            <CardTitle className="text-lg">Product Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Learn about our ingredients, preparation methods, and storage guidelines.
                            </p>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="#product-info">Learn More</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardHeader>
                            <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                            <CardTitle className="text-lg">Shipping & Delivery</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Information about shipping costs, delivery times, and order tracking.
                            </p>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="#shipping">Learn More</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardHeader>
                            <CreditCard className="w-8 h-8 text-primary mx-auto mb-2" />
                            <CardTitle className="text-lg">Orders & Payments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Payment methods, order modifications, and refund policies.
                            </p>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="#orders">Learn More</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Contact Section */}
                <div className="text-center bg-primary/5 rounded-2xl p-8">
                    <ChefHat className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold font-heading mb-4">Still Have Questions?</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Our customer service team is here to help. Reach out to us and we'll get back to you within 24 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild>
                            <Link href="mailto:support@sherpamomo.com">Email Support</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/">Browse Products</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}