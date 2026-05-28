import React from 'react';
import { useForm } from 'react-hook-form';
import { Search, MapPin, Euro, Home } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useSearch } from '../../hooks/useSearch';

interface SearchFormData {
  location?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
}

export const PropertySearch = () => {
  const { setFilters, resetFilters } = useSearch();
  const { register, handleSubmit, reset } = useForm<SearchFormData>();

  const onSubmit = (data: SearchFormData) => {
    setFilters({
      location: data.location,
      type: data.type as any,
      minPrice: data.minPrice ? Number(data.minPrice) : undefined,
      maxPrice: data.maxPrice ? Number(data.maxPrice) : undefined,
      bedrooms: data.bedrooms ? Number(data.bedrooms) : undefined,
    });
  };

  const handleReset = () => {
    reset();
    resetFilters();
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Location"
            className="pl-10"
            {...register('location')}
          />
        </div>

        <div className="relative">
          <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="number"
            placeholder="Min Price (€)"
            className="pl-10"
            {...register('minPrice')}
          />
        </div>

        <div className="relative">
          <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="number"
            placeholder="Max Price (€)"
            className="pl-10"
            {...register('maxPrice')}
          />
        </div>

        <div className="relative">
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Select
            className="pl-10"
            options={[
              { value: '', label: 'All Types' },
              { value: 'sale', label: 'For Sale' },
              { value: 'rent', label: 'For Rent' },
              { value: 'commercial', label: 'Commercial' },
            ]}
            {...register('type')}
          />
        </div>

        <div className="relative">
          <Select
            className="w-full"
            options={[
              { value: '', label: 'Any Beds' },
              { value: '1', label: '1+ Beds' },
              { value: '2', label: '2+ Beds' },
              { value: '3', label: '3+ Beds' },
              { value: '4', label: '4+ Beds' },
            ]}
            {...register('bedrooms')}
          />
        </div>

        <div className="md:col-span-2 lg:col-span-5 flex gap-4">
          <Button type="submit" className="flex-1">
            <Search className="w-4 h-4 mr-2" />
            Search Properties
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};