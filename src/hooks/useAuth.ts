import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { getCurrentUser, onAuthStateChanged, signInWithGoogle as authSignInWithGoogle, signOut as authSignOut } from '@/services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
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

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut
  };
};