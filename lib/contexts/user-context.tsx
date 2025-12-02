"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { User, USER_STORAGE_KEY } from "@/lib/types";

interface UserContextValue {
  /** Current user data, null if not set */
  user: User | null;
  /** Whether user data is being loaded from storage */
  isLoading: boolean;
  /** Whether user has completed onboarding */
  isAuthenticated: boolean;
  /** Save user data to state and localStorage */
  saveUser: (user: User) => void;
  /** Clear user data from state and localStorage */
  clearUser: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages user state with localStorage persistence.
 * Handles hydration safely to avoid SSR/client mismatch.
 */
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        // Validate the stored data has required fields
        if (parsed.username && parsed.jobTitle) {
          setUser(parsed);
        }
      }
    } catch (error) {
      // Invalid JSON or storage error - clear corrupted data
      console.error("Failed to load user from storage:", error);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUser = useCallback((newUser: User) => {
    setUser(newUser);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } catch (error) {
      console.error("Failed to save user to storage:", error);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear user from storage:", error);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      saveUser,
      clearUser,
    }),
    [user, isLoading, saveUser, clearUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Hook to access user context.
 * Must be used within a UserProvider.
 */
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
