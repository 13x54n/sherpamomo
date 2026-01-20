'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn();

      if (result.success) {
        toast.success(result.message);
        router.push('/');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 pt-20 py-8 min-h-[70%] flex justify-center">
      <div className="w-full max-w-md">

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Sherpa Momo</CardTitle>
            <CardDescription>
              Sign in to your account to access your orders and preferences.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <Button
                onClick={handleGoogleSignIn}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300"
                size="lg"
                disabled={false}
              >
                {false ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}