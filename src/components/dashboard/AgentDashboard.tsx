import React, { useState } from 'react';
import { Plus, Home, Users, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { PropertyCard } from '../property/PropertyCard';
import { AddPropertyModal } from '../property/AddPropertyModal';
import { useProperties, useAddProperty } from '../../hooks/useProperties';
import { useAuth } from '../../hooks/useAuth';

export const AgentDashboard = () => {
  const { user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: properties = [] } = useProperties();
  const addPropertyMutation = useAddProperty();
  
  // Filter properties for the current agent
  const agentProperties = properties.filter(
    property => property.agent.email === user?.email
  );

  const handleAddProperty = async (data: any) => {
    try {
      await addPropertyMutation.mutateAsync({
        ...data,
        price: parseFloat(data.price),
        features: {
          bedrooms: parseInt(data.bedrooms),
          bathrooms: parseFloat(data.bathrooms),
          area: parseInt(data.area),
          yearBuilt: parseInt(data.yearBuilt),
        },
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        agent: {
          id: user?.id || '',
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
        },
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add property:', error);
      throw new Error('Failed to add property. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Agent Dashboard</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Home className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold">Active Listings</h3>
          <p className="text-3xl font-bold">{agentProperties.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Users className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="text-lg font-semibold">Total Inquiries</h3>
          <p className="text-3xl font-bold">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <MessageSquare className="w-8 h-8 text-purple-600 mb-2" />
          <h3 className="text-lg font-semibold">Messages</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agentProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {agentProperties.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">You don't have any active listings yet.</p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Property
          </Button>
        </div>
      )}

      {isAddModalOpen && (
        <AddPropertyModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddProperty}
        />
      )}
    </div>
  );
};