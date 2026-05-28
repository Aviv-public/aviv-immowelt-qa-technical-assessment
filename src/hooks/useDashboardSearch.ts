import { create } from 'zustand';
import { Property, User, Agent } from '../types';

interface DashboardSearchState {
  searchTerm: string;
  selectedTab: 'properties' | 'users' | 'agents';
  filters: {
    status?: Property['status'];
    role?: User['role'];
    location?: string;
    specialization?: string;
  };
  setSearchTerm: (term: string) => void;
  setSelectedTab: (tab: 'properties' | 'users' | 'agents') => void;
  setFilters: (filters: DashboardSearchState['filters']) => void;
  resetFilters: () => void;
}

export const useDashboardSearch = create<DashboardSearchState>((set) => ({
  searchTerm: '',
  selectedTab: 'properties',
  filters: {},
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedTab: (selectedTab) => set({ selectedTab }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  resetFilters: () => set({ searchTerm: '', filters: {} }),
}));