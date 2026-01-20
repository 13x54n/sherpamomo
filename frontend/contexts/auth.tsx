'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  // Add more user fields as needed
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password123' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', password: 'password123' }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('sherpamomo_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Handle Google OAuth token
      if (password === 'google_auth_token') {
        // Simulate Google user creation/verification
        let googleUser = MOCK_USERS.find(u => u.email === email);
        if (!googleUser) {
          // Create new Google user
          googleUser = {
            id: Date.now().toString(),
            name: email.split('@')[0].split('.').map(part =>
              part.charAt(0).toUpperCase() + part.slice(1)
            ).join(' '), // Convert email prefix to name
            email: email,
            password: 'google_oauth'
          };
          MOCK_USERS.push(googleUser);
        }

        const { password: _, ...userWithoutPassword } = googleUser;
        setUser(userWithoutPassword);
        localStorage.setItem('sherpamomo_user', JSON.stringify(userWithoutPassword));

        return { success: true, message: 'Signed in with Google successfully!' };
      }

      // Regular email/password authentication
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('sherpamomo_user', JSON.stringify(userWithoutPassword));

        return { success: true, message: 'Signed in successfully!' };
      } else {
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, message: 'An error occurred during sign in' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        return { success: false, message: 'An account with this email already exists' };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password // In real app, this would be hashed
      };

      MOCK_USERS.push(newUser);
      const { password: _, ...userWithoutPassword } = newUser;

      setUser(userWithoutPassword);
      localStorage.setItem('sherpamomo_user', JSON.stringify(userWithoutPassword));

      return { success: true, message: 'Account created successfully!' };
    } catch (error) {
      return { success: false, message: 'An error occurred during sign up' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('sherpamomo_user');
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