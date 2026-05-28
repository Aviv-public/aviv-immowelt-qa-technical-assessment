import React from 'react';
import { X } from 'lucide-react';
import { AddPropertyForm } from './AddPropertyForm';
import { Property } from '../../types';

interface AddPropertyModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<Property>) => Promise<void>;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Property</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <AddPropertyForm onSubmit={onSubmit} onCancel={onClose} />
      </div>
    </div>
  );
};