import { User } from '@/types/user';

// TODO: Replace with Firebase Auth integration
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

// Mock authentication service for development
let currentUser: User | null = null;
let authListeners: ((user: User | null) => void)[] = [];

const notifyAuthListeners = (user: User | null) => {
  authListeners.forEach(listener => listener(user));
};

export const signInWithGoogle = async (): Promise<User> => {
  // Simulate Google sign-in
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockUser: User = {
    id: 'user-' + Date.now(),
    email: 'usuario@gmail.com',
    name: 'Usuario Demo',
    photoUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    createdAt: new Date()
  };
  
  currentUser = mockUser;
  notifyAuthListeners(currentUser);
  return mockUser;
};

export const signOut = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  currentUser = null;
  notifyAuthListeners(null);
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  authListeners.push(callback);
  // Immediately call with current state
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    authListeners = authListeners.filter(listener => listener !== callback);
  };
};

// TODO: Firebase Auth integration
// const firebaseConfig = {
//   // Firebase config will go here
// };
// 
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const googleProvider = new GoogleAuthProvider();
// 
// export const signInWithGoogle = async () => {
//   const result = await signInWithPopup(auth, googleProvider);
//   return {
//     id: result.user.uid,
//     email: result.user.email!,
//     name: result.user.displayName!,
//     photoUrl: result.user.photoURL,
//     createdAt: new Date()
//   };
// };
// 
// export const signOut = () => signOut(auth);
// export const onAuthStateChanged = (callback) => onAuthStateChanged(auth, callback);