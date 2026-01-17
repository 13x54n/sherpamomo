import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
        <Header />
        <main className="flex-1 pt-20 hide-scrollbar">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
