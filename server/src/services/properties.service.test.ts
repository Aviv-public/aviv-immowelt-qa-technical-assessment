import { describe, it, expect } from 'vitest';
import { filterAndSort } from './properties.service.js';
import type { Property } from '../types/domain.js';

const make = (overrides: Partial<Property>): Property => ({
  id: 'p',
  title: 'Title',
  description: 'Description',
  price: 100_000,
  location: { address: '1 Main', city: 'LA', state: 'CA', zipCode: '90000' },
  features: { bedrooms: 2, bathrooms: 1, area: 1000, yearBuilt: 2020 },
  type: 'sale',
  status: 'available',
  images: [],
  agent: { id: 'a1', name: 'A', phone: '5550000000', email: 'a@x.com' },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

const fixtures: Property[] = [
  make({ id: 'a', price: 500_000, type: 'sale', features: { bedrooms: 3, bathrooms: 2, area: 2000, yearBuilt: 2018 }, location: { address: '10 Beach', city: 'Malibu', state: 'CA', zipCode: '90265' }, title: 'Beach House', createdAt: '2024-03-01T00:00:00Z' }),
  make({ id: 'b', price: 1_200_000, type: 'commercial', status: 'sold', features: { bedrooms: 0, bathrooms: 4, area: 5000, yearBuilt: 2017 }, title: 'Office Tower', description: 'Downtown office', createdAt: '2024-03-05T00:00:00Z' }),
  make({ id: 'c', price: 800_000, type: 'sale', features: { bedrooms: 4, bathrooms: 3, area: 2500, yearBuilt: 2021 }, location: { address: '22 Park Ave', city: 'New York', state: 'NY', zipCode: '10001' }, title: 'NYC Condo', createdAt: '2024-03-03T00:00:00Z' }),
  make({ id: 'd', price: 300_000, type: 'rent', status: 'available', features: { bedrooms: 2, bathrooms: 1, area: 900, yearBuilt: 2010 }, title: 'Cozy Rental', createdAt: '2024-02-01T00:00:00Z' }),
];

describe('filterAndSort', () => {
  it('returns everything when no filters set', () => {
    expect(filterAndSort(fixtures, {})).toHaveLength(fixtures.length);
  });

  it('filters by type', () => {
    const out = filterAndSort(fixtures, { type: 'sale' });
    expect(out.map((p) => p.id).sort()).toEqual(['a', 'c']);
  });

  it('filters by status', () => {
    const out = filterAndSort(fixtures, { status: 'sold' });
    expect(out.map((p) => p.id)).toEqual(['b']);
  });

  it('filters by minPrice and maxPrice (inclusive)', () => {
    const out = filterAndSort(fixtures, { minPrice: 500_000, maxPrice: 1_000_000 });
    expect(out.map((p) => p.id).sort()).toEqual(['a', 'c']);
  });

  it('treats bedrooms filter as a minimum', () => {
    const out = filterAndSort(fixtures, { bedrooms: 3 });
    expect(out.map((p) => p.id).sort()).toEqual(['a', 'c']);
  });

  it('filters by case-insensitive location substring', () => {
    expect(filterAndSort(fixtures, { location: 'malibu' }).map((p) => p.id)).toEqual(['a']);
    expect(filterAndSort(fixtures, { location: 'NY' }).map((p) => p.id)).toEqual(['c']);
  });

  it('searches title and description with q', () => {
    expect(filterAndSort(fixtures, { q: 'tower' }).map((p) => p.id)).toEqual(['b']);
    expect(filterAndSort(fixtures, { q: 'downtown' }).map((p) => p.id)).toEqual(['b']);
  });

  it('combines multiple filters with AND', () => {
    const out = filterAndSort(fixtures, { type: 'sale', minPrice: 600_000 });
    expect(out.map((p) => p.id)).toEqual(['c']);
  });

  it('sorts by price ascending and descending', () => {
    expect(filterAndSort(fixtures, { sort: 'price_asc' }).map((p) => p.id)).toEqual(['d', 'a', 'c', 'b']);
    expect(filterAndSort(fixtures, { sort: 'price_desc' }).map((p) => p.id)).toEqual(['b', 'c', 'a', 'd']);
  });

  it('sorts by createdAt newest and oldest', () => {
    expect(filterAndSort(fixtures, { sort: 'newest' }).map((p) => p.id)).toEqual(['b', 'c', 'a', 'd']);
    expect(filterAndSort(fixtures, { sort: 'oldest' }).map((p) => p.id)).toEqual(['d', 'a', 'c', 'b']);
  });

  it('does not mutate the input array', () => {
    const before = fixtures.map((p) => p.id);
    filterAndSort(fixtures, { sort: 'price_desc' });
    expect(fixtures.map((p) => p.id)).toEqual(before);
  });

  it('returns [] when no row matches', () => {
    expect(filterAndSort(fixtures, { minPrice: 10_000_000 })).toEqual([]);
  });
});
