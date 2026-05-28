import React from 'react';
import { useSearch } from '../../hooks/useSearch';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Filter } from 'lucide-react';

export const PropertyFilters = () => {
  const { filters, setFilters, resetFilters } = useSearch();

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="outline" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>
      
      <div className="space-y-4">
        <Select
          label="Property Type"
          options={[
            { value: '', label: 'All Types' },
            { value: 'sale', label: 'For Sale' },
            { value: 'rent', label: 'For Rent' },
            { value: 'commercial', label: 'Commercial' }
          ]}
          value={filters.type || ''}
          onChange={(e) => handleFilterChange('type', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Min Price"
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
          <Input
            label="Max Price"
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </div>

        <Select
          label="Bedrooms"
          options={[
            { value: '', label: 'Any' },
            { value: '1', label: '1+' },
            { value: '2', label: '2+' },
            { value: '3', label: '3+' },
            { value: '4', label: '4+' }
          ]}
          value={filters.bedrooms || ''}
          onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
        />

        <Button className="w-full">
          <Filter className="w-4 h-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};