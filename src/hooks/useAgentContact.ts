import { useState } from 'react';
import { Agent } from '../types';
import { agentApi } from '../services/api';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const useAgentContact = (agent: Agent) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const handleContact = async (data: ContactFormData) => {
    try {
      await agentApi.contact(agent.id, data);
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

  const handleCall = () => {
    window.location.href = `tel:${agent.phone}`;
  };

  return {
    isContactModalOpen,
    isMessageSent,
    openContactModal: () => setIsContactModalOpen(true),
    closeContactModal: () => setIsContactModalOpen(false),
    handleContact,
    handleCall,
  };
};
