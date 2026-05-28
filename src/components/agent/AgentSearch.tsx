import React from 'react';
import { useForm } from 'react-hook-form';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useAgentSearch } from '../../hooks/useAgentSearch';

interface AgentSearchFormData {
  name: string;
  specialization: string;
  location: string;
}

export const AgentSearch = () => {
  const { 
    setSearchTerm, 
    setSpecialization, 
    setLocation, 
    searchAgents, 
    resetFilters 
  } = useAgentSearch();

  const { register, handleSubmit, reset } = useForm<AgentSearchFormData>();

  const onSubmit = (data: AgentSearchFormData) => {
    setSearchTerm(data.name);
    setSpecialization(data.specialization);
    setLocation(data.location);
    searchAgents();
  };

  const handleReset = () => {
    reset();
    resetFilters();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name"
            className="pl-10"
            {...register('name')}
          />
        </div>
        
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Select
            {...register('specialization')}
            className="pl-10"
            options={[
              { value: '', label: 'All Specializations' },
              { value: 'Luxury Properties', label: 'Luxury Properties' },
              { value: 'Commercial Properties', label: 'Commercial Properties' },
              { value: 'Residential Properties', label: 'Residential Properties' },
              { value: 'Investment Properties', label: 'Investment Properties' },
              { value: 'New Developments', label: 'New Developments' },
            ]}
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Location"
            className="pl-10"
            {...register('location')}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};