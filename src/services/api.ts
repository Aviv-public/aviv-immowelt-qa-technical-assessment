import axios from 'axios';
import { Property, User, Agent } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
  register: async (
    userData: Partial<User> & { password: string; phone: string },
  ) => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },
  me: async () => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  },
};

export type PropertyFilters = {
  type?: Property['type'];
  status?: Property['status'];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  q?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
};

export const propertyApi = {
  getProperties: async (params?: PropertyFilters) => {
    const response = await api.get<Property[]>('/properties', { params });
    return response.data;
  },
  getProperty: async (id: string) => {
    const response = await api.get<Property>(`/properties/${id}`);
    return response.data;
  },
  createProperty: async (data: Partial<Property>) => {
    const response = await api.post<Property>('/properties', data);
    return response.data;
  },
  updateProperty: async (id: string, data: Partial<Property>) => {
    const response = await api.put<Property>(`/properties/${id}`, data);
    return response.data;
  },
  deleteProperty: async (id: string) => {
    await api.delete(`/properties/${id}`);
  },
};

export const agentApi = {
  getAgents: async (params?: {
    q?: string;
    specialization?: string;
    location?: string;
  }) => {
    const response = await api.get<Agent[]>('/agents', { params });
    return response.data;
  },
  getAgent: async (id: string) => {
    const response = await api.get<Agent>(`/agents/${id}`);
    return response.data;
  },
  contact: async (
    agentId: string,
    payload: { name: string; email: string; phone?: string; message: string },
  ) => {
    const response = await api.post(`/agents/${agentId}/messages`, payload);
    return response.data;
  },
};

export const userApi = {
  list: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },
  adminUpdate: async (id: string, data: Partial<User>) => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },
  adminDelete: async (id: string) => {
    await api.delete(`/users/${id}`);
  },
  updateMe: async (data: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    const response = await api.put<AuthResponse>('/users/me', data);
    return response.data;
  },
};

export const wishlistApi = {
  list: async () => {
    const response = await api.get<Property[]>('/users/me/wishlist');
    return response.data;
  },
  add: async (propertyId: string) => {
    const response = await api.post<{ propertyIds: string[] }>(
      `/users/me/wishlist/${propertyId}`,
    );
    return response.data;
  },
  remove: async (propertyId: string) => {
    const response = await api.delete<{ propertyIds: string[] }>(
      `/users/me/wishlist/${propertyId}`,
    );
    return response.data;
  },
};
