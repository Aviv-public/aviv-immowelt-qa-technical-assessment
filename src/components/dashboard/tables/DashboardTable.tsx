import React from 'react';
import { Property, User, Agent } from '../../../types';
import { PropertiesTable } from './PropertiesTable';
import { UsersTable } from './UsersTable';
import { AgentsTable } from './AgentsTable';
import { useDashboardSearch } from '../../../hooks/useDashboardSearch';

interface DashboardTableProps {
  type: 'properties' | 'users' | 'agents';
  data: (Property | User | Agent)[];
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
}

export const DashboardTable: React.FC<DashboardTableProps> = ({
  type,
  data,
  onEdit,
  onDelete,
}) => {
  const { searchTerm, filters } = useDashboardSearch();

  const filterData = () => {
    let filteredData = [...data];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter((item) => {
        switch (type) {
          case 'properties':
            const property = item as Property;
            return (
              property.title.toLowerCase().includes(term) ||
              property.location.address.toLowerCase().includes(term) ||
              property.location.city.toLowerCase().includes(term) ||
              property.location.state.toLowerCase().includes(term)
            );
          case 'users':
            const user = item as User;
            return (
              user.name.toLowerCase().includes(term) ||
              user.email.toLowerCase().includes(term)
            );
          case 'agents':
            const agent = item as Agent;
            return (
              agent.name.toLowerCase().includes(term) ||
              agent.email.toLowerCase().includes(term) ||
              agent.location.toLowerCase().includes(term)
            );
          default:
            return false;
        }
      });
    }

    // Apply specific filters
    if (filters) {
      filteredData = filteredData.filter((item) => {
        switch (type) {
          case 'properties':
            return !filters.status || (item as Property).status === filters.status;
          case 'users':
            return !filters.role || (item as User).role === filters.role;
          case 'agents':
            return !filters.specialization || (item as Agent).specialization === filters.specialization;
          default:
            return true;
        }
      });
    }

    return filteredData;
  };

  const filteredData = filterData();

  const renderTable = () => {
    switch (type) {
      case 'properties':
        return (
          <PropertiesTable
            properties={filteredData as Property[]}
            onDelete={onDelete}
          />
        );
      case 'users':
        return (
          <UsersTable
            users={filteredData as User[]}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      case 'agents':
        return (
          <AgentsTable
            agents={filteredData as Agent[]}
            onDelete={onDelete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {renderTable()}
      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No results found</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};