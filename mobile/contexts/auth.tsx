import { useRouter, useSegments } from "expo-router";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

type User = {
  id: string;
  phone: string;
  name?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Hook to protect routes
function useProtectedRoute(user: User | null, isLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(tabs)";
    const onSignIn = segments[0] === "signin";
    const atRoot = segments.length === 0;

    if (user) {
      // User is authenticated - go to home if on signin or root
      if (onSignIn || atRoot) {
        router.replace("/(tabs)");
      }
    } else {
      // User is not authenticated - go to signin if not already there
      if (!onSignIn) {
        router.replace("/signin");
      }
    }
  }, [user, segments, isLoading, router]);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  // Protect routes based on auth state
  useProtectedRoute(user, isLoading);

  const signIn = async (newToken: string, newUser: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser)),
      ]);
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      console.error("Failed to save auth:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Failed to clear auth:", error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!user && !!token,
      signIn,
      signOut,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
