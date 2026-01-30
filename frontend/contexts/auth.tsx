'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AppUser {
  id: string;
  name: string | null;
  email: string | null;
  photoURL?: string | null;
}

interface AuthContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (options?: { useRedirect?: boolean }) => Promise<{ success: boolean; message: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function firebaseUserToAppUser(firebaseUser: FirebaseUser): AppUser {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName,
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Consume redirect result (required when using signInWithRedirect, e.g. in-app browser from mobile)
    getRedirectResult(auth).catch((err) => {
      if (err?.code !== 'auth/popup-closed-by-user') console.error('Redirect result error:', err);
    });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser(firebaseUserToAppUser(firebaseUser));
        try {
          localStorage.setItem('sherpamomo_user', JSON.stringify(firebaseUserToAppUser(firebaseUser)));
        } catch {
          // ignore when storage is restricted
        }
      } else {
        setUser(null);
        try {
          localStorage.removeItem('sherpamomo_user');
        } catch {
          // ignore
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (options?: { useRedirect?: boolean }): Promise<{ success: boolean; message: string }> => {
    const useRedirect = options?.useRedirect === true;

    if (useRedirect) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { success: true, message: 'Redirecting to Google…' };
      } catch (error: any) {
        console.error('Google sign-in redirect error:', error);
        return {
          success: false,
          message: error?.message || 'Redirect sign-in failed. Try again.',
        };
      }
    }

    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      return { success: true, message: 'Signed in with Google successfully!' };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      let errorMessage = 'An error occurred during sign in';
      if (error?.code === 'auth/popup-closed-by-user') errorMessage = 'Sign-in was cancelled';
      else if (error?.code === 'auth/popup-blocked') errorMessage = 'Pop-up was blocked by your browser';
      else if (error?.code === 'auth/account-exists-with-different-credential') errorMessage = 'Account exists with a different sign-in method';
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Since we're only using Google sign-in, this method is not used
    // But keeping it for API compatibility
    return { success: false, message: 'Please use Google sign-in' };
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      // Firebase auth state listener will handle updating the user state
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback: clear local state even if Firebase sign out fails
      setUser(null);
      localStorage.removeItem('sherpamomo_user');
    }
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}