export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent' | 'user';
  avatar?: string;
  phone?: string;
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

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    yearBuilt: number;
  };
  type: 'sale' | 'rent' | 'commercial';
  status: 'available' | 'sold' | 'under-contract';
  images: string[];
  agent: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}