import React from 'react';
import { X } from 'lucide-react';
import { AgentContactForm } from './AgentContactForm';

interface AgentContactModalProps {
  agentName: string;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isMessageSent: boolean;
}

export const AgentContactModal: React.FC<AgentContactModalProps> = ({
  agentName,
  onClose,
  onSubmit,
  isMessageSent,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Contact {agentName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <AgentContactForm
          agentName={agentName}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </div>
    </div>
  );
};