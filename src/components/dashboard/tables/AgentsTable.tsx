import React from 'react';
import { Agent } from '../../../types';
import { Button } from '../../ui/Button';

interface AgentsTableProps {
  agents: Agent[];
  onDelete?: (id: string) => void;
}

export const AgentsTable: React.FC<AgentsTableProps> = ({
  agents,
  onDelete,
}) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-3 px-4">Name</th>
          <th className="text-left py-3 px-4">Email</th>
          <th className="text-left py-3 px-4">Phone</th>
          <th className="text-left py-3 px-4">Location</th>
          <th className="text-right py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {agents.map((agent) => (
          <tr key={agent.id} className="border-b">
            <td className="py-3 px-4">{agent.name}</td>
            <td className="py-3 px-4">{agent.email}</td>
            <td className="py-3 px-4">{agent.phone}</td>
            <td className="py-3 px-4">{agent.location}</td>
            <td className="py-3 px-4 text-right">
              <Button
                variant="outline"
                size="sm"
                className="text-red-600"
                onClick={() => onDelete?.(agent.id)}
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