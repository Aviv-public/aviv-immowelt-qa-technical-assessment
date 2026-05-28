import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { Button } from '../ui/Button';
import { Property } from '../../types';
import { AgentContactForm } from '../agent/AgentContactForm';

interface PropertyContactProps {
  agent: Property['agent'] & { avatar?: string };
  propertyTitle: string;
}

export const PropertyContact: React.FC<PropertyContactProps> = ({ 
  agent, 
  propertyTitle,
}) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const handleContact = async (data: any) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsMessageSent(true);
      setTimeout(() => {
        setIsContactModalOpen(false);
        setIsMessageSent(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <img
          src={agent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=random`}
          alt={agent.name}
          className="w-16 h-16 rounded-full mr-4 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=random`;
          }}
        />
        <div>
          <h3 className="text-lg font-semibold">{agent.name}</h3>
          <p className="text-gray-500">Licensed Real Estate Agent</p>
        </div>
      </div>

      <div className="space-y-4">
        <Button 
          className="w-full"
          onClick={() => window.location.href = `tel:${agent.phone}`}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call Agent
        </Button>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => setIsContactModalOpen(true)}
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Message
        </Button>
      </div>

      {isContactModalOpen && (
        <AgentContactForm
          agentName={agent.name}
          onSubmit={handleContact}
          onClose={() => setIsContactModalOpen(false)}
        />
      )}
    </div>
  );
};