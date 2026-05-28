import { useEffect } from 'react';
import { create } from 'zustand';
import { Agent } from '../types';
import { agentApi } from '../services/api';

interface AgentSearchState {
  searchTerm: string;
  specialization: string;
  location: string;
  filteredAgents: Agent[];
  allAgents: Agent[];
  isLoading: boolean;
  setSearchTerm: (term: string) => void;
  setSpecialization: (specialization: string) => void;
  setLocation: (location: string) => void;
  loadAgents: () => Promise<void>;
  searchAgents: () => void;
  resetFilters: () => void;
}

const applyFilters = (
  agents: Agent[],
  searchTerm: string,
  specialization: string,
  location: string,
) =>
  agents.filter((agent) => {
    const matchesSearch =
      !searchTerm ||
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      !specialization ||
      agent.specialization
        .toLowerCase()
        .includes(specialization.toLowerCase());
    const matchesLocation =
      !location ||
      agent.location.toLowerCase().includes(location.toLowerCase());
    return matchesSearch && matchesSpecialization && matchesLocation;
  });

export const useAgentSearch = create<AgentSearchState>((set, get) => ({
  searchTerm: '',
  specialization: '',
  location: '',
  filteredAgents: [],
  allAgents: [],
  isLoading: false,

  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSpecialization: (specialization) => set({ specialization }),
  setLocation: (location) => set({ location }),

  loadAgents: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const agents = await agentApi.getAgents();
      set({ allAgents: agents, filteredAgents: agents });
    } finally {
      set({ isLoading: false });
    }
  },

  searchAgents: () => {
    const { allAgents, searchTerm, specialization, location } = get();
    set({
      filteredAgents: applyFilters(
        allAgents,
        searchTerm,
        specialization,
        location,
      ),
    });
  },

  resetFilters: () => {
    const { allAgents } = get();
    set({
      searchTerm: '',
      specialization: '',
      location: '',
      filteredAgents: allAgents,
    });
  },
}));

/** Loads the agent catalog from the API on mount. */
export const useAgentSearchBootstrap = () => {
  const loadAgents = useAgentSearch((s) => s.loadAgents);
  useEffect(() => {
    void loadAgents();
  }, [loadAgents]);
};
