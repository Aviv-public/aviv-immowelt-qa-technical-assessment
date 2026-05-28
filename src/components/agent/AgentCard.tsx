import React from 'react';
import { Phone, Mail, Star, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Agent } from '../../types';
import { AgentContactModal } from './AgentContactModal';
import { useAgentContact } from '../../hooks/useAgentContact';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const {
    isContactModalOpen,
    isMessageSent,
    openContactModal,
    closeContactModal,
    handleContact,
    handleCall,
  } = useAgentContact(agent);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-xl font-semibold text-white">{agent.name}</h3>
            <p className="text-white/80 text-sm">{agent.specialization}</p>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{agent.rating}</span>
            </div>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-600">{agent.experience} years experience</span>
          </div>

          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            {agent.location}
          </div>

          <p className="text-gray-600 mb-4">{agent.bio}</p>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleCall}>
              <Phone className="w-4 h-4 mr-2" />
              Call Agent
            </Button>
            <Button className="w-full" onClick={openContactModal}>
              <Mail className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </div>

      {isContactModalOpen && (
        <AgentContactModal
          agentName={agent.name}
          onClose={closeContactModal}
          onSubmit={handleContact}
          isMessageSent={isMessageSent}
        />
      )}
    </>
  );
};