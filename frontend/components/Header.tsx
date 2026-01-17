"use client";

import Link from 'next/link';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

const Header = () => {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-20">
            <div className="container mx-auto px-4 h-full flex justify-between items-center">
                {isHome ? (
                    <Link href="/" className="text-2xl font-bold tracking-widest font-heading">
                        SHERPA <span className="text-primary">MOMO</span>
                    </Link>
                ) : (
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span className="uppercase tracking-wide font-semibold">Back to Menu</span>
                    </Link>
                )}

                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="gap-2 border-primary/50 hover:bg-primary/10 hover:text-primary" asChild>
                        <Link href="/cart">
                            <ShoppingCart className="w-4 h-4" />
                            <span>Cart (0)</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
