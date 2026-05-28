import { User, Agent, Property } from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    email: 'test@example.com',
    name: 'John Doe',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=John%20Doe&backgroundColor=b6e3f4',
    phone: '(555) 123-4567'
  },
  {
    id: 'u2',
    email: 'agent@example.com',
    name: 'Sarah Wilson',
    role: 'agent',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Sarah%20Wilson%20user&backgroundColor=c0aede',
    phone: '(555) 234-5678'
  },
  {
    id: 'u3',
    email: 'admin@example.com',
    name: 'Mike Johnson',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Mike%20Johnson&backgroundColor=ffdfbf',
    phone: '(555) 345-6789'
  }
];

export const mockAgents: Agent[] = [
  {
    id: 'a1',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '(555) 234-5678',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Sarah%20Wilson&backgroundColor=b6e3f4',
    bio: 'Experienced real estate agent specializing in luxury properties with over 8 years in the market.',
    specialization: 'Luxury Properties',
    experience: 8,
    rating: 4.9,
    reviews: 124,
    listings: 45,
    location: 'Los Angeles, CA'
  },
  {
    id: 'a2',
    name: 'David Chen',
    email: 'david@example.com',
    phone: '(555) 456-7890',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=David%20Chen&backgroundColor=c0aede',
    bio: 'Commercial property expert with extensive market knowledge and proven track record.',
    specialization: 'Commercial Properties',
    experience: 12,
    rating: 4.8,
    reviews: 98,
    listings: 32,
    location: 'San Francisco, CA'
  },
  {
    id: 'a3',
    name: 'Emily Brown',
    email: 'emily@example.com',
    phone: '(555) 567-8901',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Emily%20Brown&backgroundColor=ffd5dc',
    bio: 'Residential property specialist focusing on family homes and first-time buyers.',
    specialization: 'Residential Properties',
    experience: 5,
    rating: 4.7,
    reviews: 76,
    listings: 28,
    location: 'New York, NY'
  },
  {
    id: 'a4',
    name: 'Michael Torres',
    email: 'michael@example.com',
    phone: '(555) 678-9012',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Michael%20Torres&backgroundColor=ffdfbf',
    bio: 'Investment property specialist with expertise in multi-family units and ROI optimization.',
    specialization: 'Investment Properties',
    experience: 15,
    rating: 4.9,
    reviews: 156,
    listings: 62,
    location: 'Miami, FL'
  },
  {
    id: 'a5',
    name: 'Jessica Lee',
    email: 'jessica@example.com',
    phone: '(555) 789-0123',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Jessica%20Lee&backgroundColor=d1f4d9',
    bio: 'New construction and development specialist with architectural background.',
    specialization: 'New Developments',
    experience: 7,
    rating: 4.8,
    reviews: 89,
    listings: 34,
    location: 'Seattle, WA'
  }
];

export const mockProperties: Property[] = [
  {
    id: 'p1',
    title: 'Modern Luxury Villa',
    description: 'Stunning modern villa with panoramic ocean views and high-end finishes throughout. Features include a gourmet kitchen, home theater, infinity pool, and smart home technology.',
    price: 2500000,
    location: {
      address: '123 Ocean View Dr',
      city: 'Malibu',
      state: 'CA',
      zipCode: '90265'
    },
    features: {
      bedrooms: 5,
      bathrooms: 4.5,
      area: 4500,
      yearBuilt: 2020
    },
    type: 'sale',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
    ],
    agent: mockAgents[0],
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'p2',
    title: 'Downtown Penthouse',
    description: 'Luxurious penthouse apartment with stunning city views and private rooftop terrace. Featuring floor-to-ceiling windows, designer kitchen, and premium amenities.',
    price: 1800000,
    location: {
      address: '456 City Center Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90012'
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 2800,
      yearBuilt: 2019
    },
    type: 'sale',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80'
    ],
    agent: mockAgents[1],
    createdAt: '2024-03-02T00:00:00Z',
    updatedAt: '2024-03-02T00:00:00Z'
  },
  {
    id: 'p3',
    title: 'Cozy Family Home',
    description: 'Beautiful family home in a quiet neighborhood with great schools nearby. Features updated kitchen, spacious backyard, and finished basement.',
    price: 850000,
    location: {
      address: '789 Maple St',
      city: 'Pasadena',
      state: 'CA',
      zipCode: '91101'
    },
    features: {
      bedrooms: 4,
      bathrooms: 2.5,
      area: 2200,
      yearBuilt: 2015
    },
    type: 'sale',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566752547-c1148af2371c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566752421-2f36b76764d0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566752734-42c828b17f8a?auto=format&fit=crop&w=800&q=80'
    ],
    agent: mockAgents[2],
    createdAt: '2024-03-03T00:00:00Z',
    updatedAt: '2024-03-03T00:00:00Z'
  },
  {
    id: 'p4',
    title: 'Luxury Beachfront Condo',
    description: 'Spectacular beachfront condo with unobstructed ocean views. Features high-end appliances, private balcony, and resort-style amenities.',
    price: 1200000,
    location: {
      address: '321 Seaside Ave',
      city: 'Miami Beach',
      state: 'FL',
      zipCode: '33139'
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1800,
      yearBuilt: 2018
    },
    type: 'sale',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=800&q=80'
    ],
    agent: mockAgents[3],
    createdAt: '2024-03-04T00:00:00Z',
    updatedAt: '2024-03-04T00:00:00Z'
  },
  {
    id: 'p5',
    title: 'Modern Office Space',
    description: 'Prime commercial office space in downtown business district. Open floor plan, meeting rooms, and state-of-the-art facilities.',
    price: 2000000,
    location: {
      address: '567 Business Center Dr',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94111'
    },
    features: {
      bedrooms: 0,
      bathrooms: 4,
      area: 5000,
      yearBuilt: 2017
    },
    type: 'commercial',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366671610-3bb6a807b8e0?auto=format&fit=crop&w=800&q=80'
    ],
    agent: mockAgents[1],
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z'
  },
  {
    id: 'p6',
    title: 'Luxury Townhouse',
    description: 'Contemporary townhouse with rooftop terrace and city views. Features modern finishes, private garage, and smart home integration.',
    price: 950000,
    location: {
      address: '789 Urban Lane',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    },
    features: {
      bedrooms: 3,
      bathrooms: 2.5,
      area: 2000,
      yearBuilt: 2021
    },
    type: 'sale',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
    ],
    agent: mockAgents[4],
    createdAt: '2024-03-06T00:00:00Z',
    updatedAt: '2024-03-06T00:00:00Z'
  }
];