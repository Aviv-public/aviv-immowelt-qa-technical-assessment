import React from 'react';
import { Bed, Bath, Square } from 'lucide-react';
import { Property } from '../../types';

interface PropertyFeaturesProps {
  features: Property['features'];
}

export const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ features }) => {
  return (
    <div className="flex justify-between text-gray-500" data-testid="property-features">
      <div className="flex items-center">
        <Bed className="h-4 w-4 mr-1" />
        <span className="text-sm">{features.bedrooms} beds</span>
      </div>
      <div className="flex items-center">
        <Bath className="h-4 w-4 mr-1" />
        <span className="text-sm">{features.bathrooms} baths</span>
      </div>
      <div className="flex items-center">
        <Square className="h-4 w-4 mr-1" />
        <span className="text-sm">{features.area} sqft</span>
      </div>
    </div>
  );
};