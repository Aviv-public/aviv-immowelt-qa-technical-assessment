import React from 'react';
import { Property } from '../../types';
import { PropertyCard } from './PropertyCard';
import { useSearch } from '../../hooks/useSearch';

interface PropertyGridProps {
  properties: Property[];
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({ properties }) => {
  const { filters, searchTerm } = useSearch();

  const filteredProperties = properties.filter(property => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        property.title.toLowerCase().includes(searchLower) ||
        property.description.toLowerCase().includes(searchLower) ||
        property.location.address.toLowerCase().includes(searchLower) ||
        property.location.city.toLowerCase().includes(searchLower) ||
        property.location.state.toLowerCase().includes(searchLower) ||
        property.location.zipCode.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filters.type && property.type !== filters.type) return false;

    // Price range filter
    if (filters.minPrice && property.price < filters.minPrice) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;

    // Bedrooms filter
    if (filters.bedrooms && property.features.bedrooms < parseInt(filters.bedrooms.toString())) return false;

    // Location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      const propertyLocation = [
        property.location.address,
        property.location.city,
        property.location.state,
        property.location.zipCode
      ].join(' ').toLowerCase();
      
      if (!propertyLocation.includes(locationLower)) return false;
    }

    return true;
  });

  // Sort properties based on filters
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.price - b.price;
    if (filters.sortBy === 'price-desc') return b.price - a.price;
    if (filters.sortBy === 'date-asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (filters.sortBy === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  if (sortedProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No properties match your search criteria.</p>
        <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};