import React from 'react';
import { Heart, Bell, Clock } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import { PropertyCard } from '../property/PropertyCard';

export const UserDashboard = () => {
  const { wishlist } = useWishlist();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Heart className="w-8 h-8 text-red-600 mb-2" />
          <h3 className="text-lg font-semibold">Saved Properties</h3>
          <p className="text-3xl font-bold">{wishlist.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Bell className="w-8 h-8 text-yellow-600 mb-2" />
          <h3 className="text-lg font-semibold">Active Alerts</h3>
          <p className="text-3xl font-bold">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Clock className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold">Recent Views</h3>
          <p className="text-3xl font-bold">8</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Saved Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};