export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}