// Mirror of /src/types/index.ts. Keep in sync if you change either side.

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent' | 'user';
  avatar?: string;
  phone?: string;
}

export interface StoredUser extends PublicUser {
  passwordHash: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  specialization: string;
  experience: number;
  rating: number;
  reviews: number;
  listings: number;
  location: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt: number;
}

export interface PropertyAgentRef {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: PropertyLocation;
  features: PropertyFeatures;
  type: 'sale' | 'rent' | 'commercial';
  status: 'available' | 'sold' | 'under-contract';
  images: string[];
  agent: PropertyAgentRef;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistEntry {
  userId: string;
  propertyIds: string[];
}

export interface AgentMessage {
  id: string;
  agentId: string;
  fromUserId: string | null;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

export interface DbSchema {
  users: StoredUser[];
  agents: Agent[];
  properties: Property[];
  wishlists: WishlistEntry[];
  messages: AgentMessage[];
}
