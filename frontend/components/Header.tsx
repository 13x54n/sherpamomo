"use client";

import Link from 'next/link';
import { ShoppingCart, ArrowLeft, User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/cart';
import { useAuth } from '@/contexts/auth';

const Header = () => {
    const pathname = usePathname();
    const isHome = pathname === '/';
    const { cart } = useCart();
    const { user, isAuthenticated, signOut } = useAuth();

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
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">Hi, {user?.name?.split(' ')[0]}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders" className="flex items-center">
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            <span>Order History</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="flex items-center">
                                            <Settings className="w-4 h-4 mr-2" />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                        onClick={() => signOut()}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary" asChild>
                            <Link href="/signin">
                                <User className="w-4 h-4" />
                                <span>Sign In</span>
                            </Link>
                        </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-2 border-primary/50 hover:bg-primary/10 hover:text-primary" asChild>
                        <Link href="/cart">
                            <ShoppingCart className="w-4 h-4" />
                            <span>Cart ({cart.totalItems})</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
