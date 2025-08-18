import { User } from '@/types/user';
import { auth, googleProvider } from './firebase';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

export const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider);
  const firebaseUser = result.user;

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || '',
    photoUrl: firebaseUser.photoURL || '',
    createdAt: new Date()
  };
};

export const signUpWithEmail = async (email: string, password: string, name: string): Promise<User> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = result.user;

  // Update the user's display name
  await updateProfile(firebaseUser, {
    displayName: name
  });

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: name,
    photoUrl: firebaseUser.photoURL || '',
    createdAt: new Date()
  };
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = result.user;

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || '',
    photoUrl: firebaseUser.photoURL || '',
    createdAt: new Date()
  };
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const getCurrentUser = (): User | null => {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) return null;

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || '',
    photoUrl: firebaseUser.photoURL || '',
    createdAt: new Date()
  };
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
    console.log('=== AUTH STATE CHANGED ===');
    console.log('Firebase user:', firebaseUser);
    console.log('User ID:', firebaseUser?.uid);
    console.log('User email:', firebaseUser?.email);
    
    if (firebaseUser) {
      const user = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        photoUrl: firebaseUser.photoURL || '',
        createdAt: new Date()
      };
      console.log('Converted user object:', user);
      callback(user);
    } else {
      console.log('No user authenticated');
      callback(null);
    }
  });
};
