import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
    return (
        <footer className="bg-muted/30 border-t border-border py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div>
                        <h3 className="text-xl font-heading font-bold mb-4 text-primary">SHERPA MOMO</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Authentic Himalayan frozen momos delivered to your doorstep. Handmade with love and the finest ingredients.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">FAQs</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>123 Himalayan Way, Kathmandu</p>
                            <p>Email: namaste@sherpamomo.com</p>
                            <p>Phone: +1 234 567 890</p>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="text-center text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Sherpa Momo. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
