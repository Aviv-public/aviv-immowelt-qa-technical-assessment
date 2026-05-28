import { useEffect } from 'react';
import { create } from 'zustand';
import {
  agentApi,
  propertyApi,
  userApi,
} from '../services/api';
import { User, Agent, Property } from '../types';

interface AdminState {
  users: User[];
  agents: Agent[];
  properties: Property[];
  isLoading: boolean;
  load: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  updateAgent: (id: string, data: Partial<Agent>) => Promise<void>;
  updateProperty: (id: string, data: Partial<Property>) => Promise<void>;
}

export const useAdmin = create<AdminState>((set, get) => ({
  users: [],
  agents: [],
  properties: [],
  isLoading: false,

  load: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const [users, agents, properties] = await Promise.all([
        userApi.list(),
        agentApi.getAgents(),
        propertyApi.getProperties(),
      ]);
      set({ users, agents, properties });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (id) => {
    await userApi.adminDelete(id);
    set((s) => ({ users: s.users.filter((u) => u.id !== id) }));
  },

  deleteAgent: async (id) => {
    // No DELETE /agents endpoint by design — agents are a curated catalog.
    // Keep the local mutation so existing UI still works.
    set((s) => ({ agents: s.agents.filter((a) => a.id !== id) }));
  },

  deleteProperty: async (id) => {
    await propertyApi.deleteProperty(id);
    set((s) => ({
      properties: s.properties.filter((p) => p.id !== id),
    }));
  },

  updateUser: async (id, data) => {
    const updated = await userApi.adminUpdate(id, data);
    set((s) => ({
      users: s.users.map((u) => (u.id === id ? updated : u)),
    }));
  },

  updateAgent: async (id, data) => {
    set((s) => ({
      agents: s.agents.map((a) => (a.id === id ? { ...a, ...data } : a)),
    }));
  },

  updateProperty: async (id, data) => {
    const updated = await propertyApi.updateProperty(id, data);
    set((s) => ({
      properties: s.properties.map((p) => (p.id === id ? updated : p)),
    }));
  },
}));

/** Loads admin data on mount; safe to call from the AdminDashboard. */
export const useAdminAutoLoad = () => {
  const load = useAdmin((s) => s.load);
  useEffect(() => {
    void load();
  }, [load]);
};
