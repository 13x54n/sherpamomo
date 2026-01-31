'use client';

import { Suspense, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function redirectToAppWithCode(mobileRedirectUri: string) {
  const { getAuth } = await import('firebase/auth');
  const { default: firebaseApp } = await import('@/lib/firebase');
  const user = getAuth(firebaseApp).currentUser;
  if (!user) return false;
  const res = await fetch(`${API_BASE}/auth/mobile-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firebaseUid: user.uid,
      email: user.email ?? undefined,
      name: user.displayName ?? undefined,
      redirect_uri: mobileRedirectUri,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    toast.error(data.message || 'Could not complete sign-in for app.');
    return false;
  }
  const { code } = data;
  const sep = mobileRedirectUri.includes('?') ? '&' : '?';
  if (typeof window !== 'undefined') {
    window.location.href = `${mobileRedirectUri}${sep}code=${encodeURIComponent(code)}`;
  }
  return true;
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, isLoading, isAuthenticated } = useAuth();
  const mobileRedirectUri = searchParams.get('redirect_uri');
  const isMobileFlow = searchParams.get('mobile') === '1' && mobileRedirectUri;
  const didAutoRedirect = useRef(false);

  // When opened from mobile and user is already logged in (e.g. previous session in browser),
  // immediately get a fresh code and redirect back to the app so the flow always works.
  useEffect(() => {
    if (!isMobileFlow || !mobileRedirectUri || isLoading || didAutoRedirect.current) return;
    if (!isAuthenticated) return;

    didAutoRedirect.current = true;
    redirectToAppWithCode(mobileRedirectUri).catch((err) => {
      console.error('Auto redirect for mobile failed:', err);
      didAutoRedirect.current = false;
    });
  }, [isMobileFlow, mobileRedirectUri, isLoading, isAuthenticated]);

  const handleGoogleSignIn = async () => {
    try {
      // Use redirect in mobile in-app browser (avoids "missing initial state" / sessionStorage issues)
      const result = await signIn({ useRedirect: Boolean(isMobileFlow) });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      if (isMobileFlow) {
        // Page is navigating to Google; after redirect back, getRedirectResult + useEffect will send code to app
        return;
      }

      toast.success(result.message);
      router.push('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    }
  };

  const isRedirecting = isMobileFlow && isAuthenticated && !isLoading;

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
              {isRedirecting ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Redirecting you back to the app…</p>
                </div>
              ) : (
              <Button
                onClick={handleGoogleSignIn}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
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
              )}

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

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 pt-20 py-8 min-h-[70%] flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}