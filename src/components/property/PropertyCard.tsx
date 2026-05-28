import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bed, Bath, Square } from 'lucide-react';
import { Property } from '../../types';
import { formatCurrency } from '../../utils/format';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, featured }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const isFavorite = isInWishlist(property.id);

  const toggleWishlist = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (isFavorite) {
      void removeFromWishlist(property.id).catch(() => undefined);
    } else {
      void addToWishlist(property).catch(() => undefined);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${featured ? 'border-2 border-blue-500' : ''}`}>
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
        {featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
            {property.type.toUpperCase()}
          </span>
          <span className={`px-3 py-1 rounded-md text-sm text-white ${
            property.status === 'available' ? 'bg-green-600' :
            property.status === 'sold' ? 'bg-red-600' : 'bg-yellow-600'
          }`}>
            {property.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-4">
        <Link to={`/properties/${property.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
        </Link>
        <p className="text-gray-500 text-sm mb-2">{property.location.address}</p>
        <p className="text-2xl font-bold text-blue-600 mb-4">
          {formatCurrency(property.price)}
        </p>

        <div className="flex justify-between text-gray-500 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.features.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.features.bathrooms} baths</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.features.area} sqft</span>
          </div>
        </div>

        <Link to={`/properties/${property.id}`}>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};