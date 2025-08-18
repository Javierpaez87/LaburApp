import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import {
  onAuthStateChanged,
  signInWithGoogle as authSignInWithGoogle,
  signOut as authSignOut,
  signUpWithEmail as authSignUpWithEmail,
  signInWithEmail as authSignInWithEmail
} from '@/services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null); // 👈 inicia en null
  const [isLoading, setIsLoading] = useState(true);    // 👈 inicia cargando

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false); // 👈 se resuelve después de saber si hay user
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const user = await authSignInWithGoogle();
      setUser(user);
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authSignOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const user = await authSignUpWithEmail(email, password, name);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authSignInWithEmail(email, password);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOut
  };
};
