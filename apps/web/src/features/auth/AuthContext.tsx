import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '@fieldops/contracts';

export interface AuthUser {
  id: string;
  organizationId: string | null;
  email: string;
  role: UserRole | string;
  firstName: string;
  lastName: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check current session on mount
  useEffect(() => {
    async function checkCurrentSession() {
      try {
        const res = await fetch('/api/v1/auth/me', {
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.user) {
            setUser(json.data.user);
          }
        }
      } catch {
        // Not logged in or network error
      } finally {
        setIsLoading(false);
      }
    }

    checkCurrentSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        return {
          success: false,
          error: json.error?.message || 'Login failed. Please check your credentials.',
        };
      }

      setUser(json.data.user);
      return { success: true };
    } catch {
      return {
        success: false,
        error: 'Cannot connect to server. Please ensure the backend is running.',
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

