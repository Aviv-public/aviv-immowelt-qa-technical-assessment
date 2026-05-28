import React from 'react';
import { Property } from '../../types';
import { PropertyCard } from './PropertyCard';

interface SimilarPropertiesProps {
  currentProperty: Property;
  properties: Property[];
}

export const SimilarProperties: React.FC<SimilarPropertiesProps> = ({
  currentProperty,
  properties
}) => {
  const similarProperties = properties
    .filter(property => 
      property.id !== currentProperty.id &&
      property.type === currentProperty.type &&
      Math.abs(property.price - currentProperty.price) < currentProperty.price * 0.3
    )
    .slice(0, 3);

  if (similarProperties.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};