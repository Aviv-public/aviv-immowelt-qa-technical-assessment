import React from 'react';
import { Property } from '../../types';
import { clsx } from 'clsx';

interface PropertyStatusProps {
  type: Property['type'];
  status: Property['status'];
}

export const PropertyStatus: React.FC<PropertyStatusProps> = ({ type, status }) => {
  const statusColors = {
    available: 'bg-green-600',
    sold: 'bg-red-600',
    'under-contract': 'bg-yellow-600',
  };

  return (
    <div className="absolute bottom-4 left-4 flex gap-2">
      <span className="px-2 py-1 bg-blue-600 text-white text-sm rounded-md">
        {type.toUpperCase()}
      </span>
      <span className={clsx(
        'px-2 py-1 text-white text-sm rounded-md',
        statusColors[status]
      )}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    </div>
  );
};