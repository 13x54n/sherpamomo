import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
    return (
        <footer className="bg-muted/30 border-t border-border py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                        <h3 className="text-xl font-heading font-bold mb-4 text-primary">SHERPA MOMO</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Authentic Himalayan frozen foods, and momos delivered to your doorstep. Handmade with love and the finest ingredients.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/faqs" className="hover:text-primary transition-colors">FAQs</Link></li>
                            <li><Link href="/support" className="hover:text-primary transition-colors">Support</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Support</h4>
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p><Link href="/support" className="hover:text-primary transition-colors">Contact us</Link></p>
                            <p>Email: sherpamomo@outlook.com</p>
                            <p>Phone: +1 416 725 8527</p>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="text-center text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Sherpa Momo Productions & Factory. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
