'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AppUser {
  id: string;
  name: string | null;
  email: string | null;
  photoURL?: string | null;
  // Add more user fields as needed
}

interface AuthContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<{ success: boolean; message: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Firebase handles user authentication

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in
        const userData: AppUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        };
        setUser(userData);
        // Store in localStorage for persistence
        localStorage.setItem('sherpamomo_user', JSON.stringify(userData));
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem('sherpamomo_user');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Firebase handles the authentication automatically
      // The onAuthStateChanged listener will update the user state

      return { success: true, message: 'Signed in with Google successfully!' };
    } catch (error: any) {
      console.error('Google sign-in error:', error);

      let errorMessage = 'An error occurred during sign in';

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up was blocked by your browser';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'Account exists with a different sign-in method';
      }

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