import { useEffect } from 'react';
import { create } from 'zustand';
import { authApi } from '../services/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  loginWithCredentials: (email: string, password: string) => Promise<User>;
  registerAccount: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'user' | 'agent';
  }) => Promise<User>;
  logout: () => void;
  hydrate: () => Promise<void>;
  /**
   * @deprecated kept for callers that still hand back a freshly loaded user
   * (e.g. settings screen after PUT /users/me); use setUser + setToken instead.
   */
  login: (user: User) => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isHydrating: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  loginWithCredentials: async (email, password) => {
    const { user, token } = await authApi.login(email, password);
    localStorage.setItem('token', token);
    set({ user, isAuthenticated: true });
    return user;
  },

  registerAccount: async (data) => {
    const { user, token } = await authApi.register(data);
    localStorage.setItem('token', token);
    set({ user, isAuthenticated: true });
    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  hydrate: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (get().isHydrating) return;
    set({ isHydrating: true });
    try {
      const user = await authApi.me();
      set({ user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isHydrating: false });
    }
  },

  login: (user) => set({ user, isAuthenticated: true }),
}));

/** Mount once at app root to restore the session from a stored JWT. */
export const useAuthHydration = () => {
  const hydrate = useAuth((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
};
