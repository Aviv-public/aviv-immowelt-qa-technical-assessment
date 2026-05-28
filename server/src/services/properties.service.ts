import type { Property } from '../types/domain.js';
import type { z } from 'zod';
import type { propertyQuerySchema } from '../schemas.js';

type Query = z.infer<typeof propertyQuerySchema>;

export function filterAndSort(properties: Property[], q: Query): Property[] {
  let out = properties.filter((p) => {
    if (q.type && p.type !== q.type) return false;
    if (q.status && p.status !== q.status) return false;
    if (q.minPrice !== undefined && p.price < q.minPrice) return false;
    if (q.maxPrice !== undefined && p.price > q.maxPrice) return false;
    if (q.bedrooms !== undefined && p.features.bedrooms < q.bedrooms)
      return false;
    if (q.bathrooms !== undefined && p.features.bathrooms < q.bathrooms)
      return false;
    if (q.location) {
      const needle = q.location.toLowerCase();
      const hay =
        `${p.location.address} ${p.location.city} ${p.location.state} ${p.location.zipCode}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    if (q.q) {
      const needle = q.q.toLowerCase();
      const hay = `${p.title} ${p.description}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });

  switch (q.sort) {
    case 'price_asc':
      out = [...out].sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      out = [...out].sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      out = [...out].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case 'oldest':
      out = [...out].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      break;
  }
  return out;
}
