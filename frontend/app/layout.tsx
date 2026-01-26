import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartProvider } from '@/contexts/cart';
import { AuthProvider } from '@/contexts/auth';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'Sherpa Momo - Premium Frozen Himalayan Momos',
  description: 'Authentic frozen momos handmade with traditional recipes. Order online for delivery.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1 pt-20 hide-scrollbar">
              {children}
            </main>
            <Footer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
        <Analytics/>
      </body>
    </html>
  );
}
