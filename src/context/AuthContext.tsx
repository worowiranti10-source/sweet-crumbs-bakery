import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUser } from '../types';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isFirebaseActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'sweet_crumbs_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const adminUser: AdminUser = {
            email: firebaseUser.email || 'admin@sweetcrumbs.com',
            name: firebaseUser.displayName || 'Bakery Admin',
            role: 'superadmin',
          };
          setUser(adminUser);
          sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
        } else {
          // If no firebase user and we were not using demo session
          const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
          if (saved) {
            setUser(JSON.parse(saved));
          } else {
            setUser(null);
          }
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      // In demo mode, load from session
      try {
        const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      if (isFirebaseConfigured && auth) {
        // Attempt Firebase sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const adminUser: AdminUser = {
          email: userCredential.user.email || email,
          name: userCredential.user.displayName || 'Admin Sweet Crumbs',
          role: 'superadmin',
        };
        setUser(adminUser);
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
        setIsLoading(false);
        return true;
      } else {
        // Demo authentication fallback
        // Accept admin credentials or any validly formatted test credentials
        if (
          (email.trim().toLowerCase() === 'admin@sweetcrumbs.com' && password === 'admin123') ||
          (email.includes('@') && password.length >= 6)
        ) {
          const adminUser: AdminUser = {
            email: email.trim().toLowerCase(),
            name: 'Kepala Toko Sweet Crumbs',
            role: 'superadmin',
          };
          setUser(adminUser);
          sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
          setIsLoading(false);
          return true;
        } else {
          setError('Email atau password tidak sesuai. Gunakan admin@sweetcrumbs.com dan password admin123 untuk mode demo.');
          setIsLoading(false);
          return false;
        }
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errMsg = err instanceof Error ? err.message : 'Gagal masuk. Silakan periksa kembali email & password Anda.';
      setError(errMsg);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error('Firebase signout error:', e);
      }
    }
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        isFirebaseActive: isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
