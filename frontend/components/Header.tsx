import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-20">
            <div className="container mx-auto px-4 h-full flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-widest font-heading">
                    SHERPA <span className="text-primary">MOMO</span>
                </Link>

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
