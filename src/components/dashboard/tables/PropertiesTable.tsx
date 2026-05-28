import React from 'react';
import { Property } from '../../../types';
import { Button } from '../../ui/Button';
import { formatCurrency } from '../../../utils/format';

interface PropertiesTableProps {
  properties: Property[];
  onDelete?: (id: string) => void;
}

export const PropertiesTable: React.FC<PropertiesTableProps> = ({
  properties,
  onDelete,
}) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-3 px-4">Title</th>
          <th className="text-left py-3 px-4">Location</th>
          <th className="text-left py-3 px-4">Price</th>
          <th className="text-left py-3 px-4">Status</th>
          <th className="text-right py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {properties.map((property) => (
          <tr key={property.id} className="border-b">
            <td className="py-3 px-4">{property.title}</td>
            <td className="py-3 px-4">{property.location.address}</td>
            <td className="py-3 px-4">{formatCurrency(property.price)}</td>
            <td className="py-3 px-4 capitalize">{property.status}</td>
            <td className="py-3 px-4 text-right">
              <Button
                variant="outline"
                size="sm"
                className="text-red-600"
                onClick={() => onDelete?.(property.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};