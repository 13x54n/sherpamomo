import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Shield, Users, CreditCard } from 'lucide-react';

export default function TermsOfServicePage() {
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
            <h1 className="text-4xl font-bold font-heading">Terms of Service</h1>
            <p className="text-muted-foreground mt-2">Last updated: January 20, 2026</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Sherpa Momo Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Sherpa Momo ("we," "us," or "our"). These Terms of Service ("Terms") govern your use of our website,
                mobile application, and services (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If you do not agree to these Terms, please do not use our Service.
              </p>
            </section>

            {/* Services */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Our Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sherpa Momo provides an online platform for ordering authentic Himalayan cuisine, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                <li>Browse and purchase frozen momos and traditional Himalayan foods</li>
                <li>Online ordering and payment processing</li>
                <li>Delivery services within our supported areas</li>
                <li>Customer support and order tracking</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                3. User Accounts
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To use certain features of our Service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            {/* Orders and Payment */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                4. Orders and Payment
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Order Acceptance</h3>
                  <p className="text-muted-foreground">
                    All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order
                    for any reason, including but not limited to product availability, errors in product information, or payment issues.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Pricing and Payment</h3>
                  <p className="text-muted-foreground">
                    All prices are subject to change without notice. Payment is due at the time of order placement.
                    We accept various payment methods as displayed on our checkout page.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Pay on Delivery</h3>
                  <p className="text-muted-foreground">
                    For pay on delivery orders, payment is collected upon delivery. You agree to have the exact amount
                    ready at the time of delivery.
                  </p>
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Delivery</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to deliver orders within the estimated timeframes provided. However, delivery times may vary
                due to factors beyond our control. We are not liable for delays caused by weather, traffic, or other unforeseen circumstances.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Risk of loss passes to you upon delivery. Please inspect your order upon receipt and report any issues immediately.
              </p>
            </section>

            {/* Returns and Refunds */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Returns and Refunds</h2>
              <p className="text-muted-foreground leading-relaxed">
                Due to the perishable nature of our products, we generally do not accept returns. However, we will
                consider refunds or replacements on a case-by-case basis for damaged or incorrect items. Please contact
                our customer service within 24 hours of delivery.
              </p>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. User Conduct</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to use our Service to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Transmit harmful or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of our Service</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                8. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on our Service, including text, graphics, logos, images, and software, is owned by Sherpa Momo
                or our licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create
                derivative works without our express written permission.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, Sherpa Momo shall not be liable for any indirect, incidental,
                special, or consequential damages arising out of or in connection with your use of our Service.
                Our total liability shall not exceed the amount paid by you for the specific order giving rise to the claim.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to terminate or suspend your account and access to our Service at our discretion,
                without notice, for any reason including violation of these Terms.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting
                on our Service. Your continued use of our Service after changes are posted constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> legal@sherpamomo.com<br />
                  <strong>Phone:</strong> +1 (555) 123-MOMO<br />
                  <strong>Address:</strong> 123 Himalayan Way, Kathmandu, Nepal
                </p>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-primary hover:underline">
              Contact Us
            </Link>
            <Link href="/" className="text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}