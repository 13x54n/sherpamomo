import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-bold font-heading">Privacy Policy</h1>
            <p className="text-muted-foreground mt-2">Last updated: January 20, 2026</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Sherpa Momo Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At Sherpa Momo ("we," "us," or "our"), we are committed to protecting your privacy and personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website,
                mobile application, and services (collectively, the "Service").
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                By using our Service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                2. Information We Collect
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                  <p className="text-muted-foreground">
                    When you create an account or place an order, we may collect:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Name and contact information</li>
                    <li>Email address and phone number</li>
                    <li>Delivery address</li>
                    <li>Payment information (processed securely by third parties)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Usage Information</h3>
                  <p className="text-muted-foreground">
                    We automatically collect certain information about your use of our Service:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>IP address and location information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent</li>
                    <li>Device information and screen resolution</li>
                    <li>Referral sources</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect for various purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                <li><strong>Order Processing:</strong> To process and fulfill your orders</li>
                <li><strong>Account Management:</strong> To create and manage your account</li>
                <li><strong>Customer Service:</strong> To respond to your inquiries and provide support</li>
                <li><strong>Communication:</strong> To send order confirmations, updates, and promotional materials</li>
                <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our Service</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our Service</li>
                <li><strong>Delivery Partners:</strong> With delivery services to fulfill your orders</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                5. Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access,
                alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We use industry-standard encryption for sensitive data and regularly review our security practices.
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience on our Service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our Service</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You can control cookie settings through your browser preferences, though disabling cookies may affect site functionality.
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service may contain links to third-party websites or integrate with third-party services:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                <li><strong>Google Sign-In:</strong> For authentication purposes</li>
                <li><strong>Payment Processors:</strong> For secure payment processing</li>
                <li><strong>Delivery Services:</strong> For order fulfillment</li>
                <li><strong>Analytics Services:</strong> To improve our Service</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                These third parties have their own privacy policies, which we encourage you to review.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information
                from children under 13. If we become aware that we have collected personal information from a child under 13,
                we will take steps to delete such information.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last updated" date. Changes will be effective immediately
                upon posting.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                11. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> privacy@sherpamomo.com<br />
                  <strong>Phone:</strong> +1 (555) 123-MOMO<br />
                  <strong>Address:</strong> 123 Himalayan Way, Kathmandu, Nepal<br />
                  <strong>Data Protection Officer:</strong> dpo@sherpamomo.com
                </p>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
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