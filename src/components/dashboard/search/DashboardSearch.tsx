import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Button } from '../../ui/Button';
import { useDashboardSearch } from '../../../hooks/useDashboardSearch';

interface DashboardSearchProps {
  type: 'properties' | 'users' | 'agents';
}

export const DashboardSearch: React.FC<DashboardSearchProps> = ({ type }) => {
  const { searchTerm, filters, setSearchTerm, setFilters, resetFilters } = useDashboardSearch();

  const renderFilters = () => {
    switch (type) {
      case 'properties':
        return (
          <Select
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'available', label: 'Available' },
              { value: 'sold', label: 'Sold' },
              { value: 'under-contract', label: 'Under Contract' },
            ]}
            value={filters.status || ''}
            onChange={(e) => setFilters({ status: e.target.value as any })}
          />
        );
      case 'users':
        return (
          <Select
            options={[
              { value: '', label: 'All Roles' },
              { value: 'user', label: 'User' },
              { value: 'agent', label: 'Agent' },
              { value: 'admin', label: 'Admin' },
            ]}
            value={filters.role || ''}
            onChange={(e) => setFilters({ role: e.target.value as any })}
          />
        );
      case 'agents':
        return (
          <Select
            options={[
              { value: '', label: 'All Specializations' },
              { value: 'Luxury Properties', label: 'Luxury Properties' },
              { value: 'Commercial Properties', label: 'Commercial Properties' },
              { value: 'Residential Properties', label: 'Residential Properties' },
              { value: 'Investment Properties', label: 'Investment Properties' },
            ]}
            value={filters.specialization || ''}
            onChange={(e) => setFilters({ specialization: e.target.value })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={`Search ${type}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="w-48">
        {renderFilters()}
      </div>
      <Button variant="outline" onClick={resetFilters}>
        Reset
      </Button>
    </div>
  );
};