import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Headphones, Mail, Phone, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold font-heading">Support</h1>
          <p className="text-muted-foreground mt-2">
            We're here to help. Get in touch or find answers below.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                For orders, product questions, or general inquiries.
              </p>
              <a
                href="mailto:sherpamomo@outlook.com"
                className="text-primary font-medium hover:underline"
              >
                sherpamomo@outlook.com
              </a>
              <div className="pt-2">
                <Button asChild size="sm">
                  <a href="mailto:sherpamomo@outlook.com">Send email</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Call us for urgent orders or quick questions.
              </p>
              <a
                href="tel:+14167258527"
                className="text-primary font-medium hover:underline"
              >
                +1 416 725 8527
              </a>
              <div className="pt-2">
                <Button asChild size="sm" variant="outline">
                  <a href="tel:+14167258527">Call now</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQs shortcut */}
        <div className="mb-12">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Frequently asked questions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Shipping, cooking, ingredients, and more.
              </p>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/faqs">View FAQs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center bg-muted/30 rounded-2xl p-8">
          <Headphones className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading mb-2">Need something else?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Browse our menu or check your order status. We typically respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/">Browse menu</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/orders">Order history</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
