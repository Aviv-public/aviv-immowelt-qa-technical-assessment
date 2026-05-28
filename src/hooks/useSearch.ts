import { create } from 'zustand';
import { Property } from '../types';

interface SearchFilters {
  location?: string;
  type?: Property['type'];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: Property['status'];
  sortBy?: 'price-asc' | 'price-desc' | 'date-asc' | 'date-desc';
}

interface SearchState {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  resetFilters: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useSearch = create<SearchState>((set) => ({
  filters: {},
  searchTerm: '',
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters }
  })),
  resetFilters: () => set({ filters: {}, searchTerm: '' }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
}));