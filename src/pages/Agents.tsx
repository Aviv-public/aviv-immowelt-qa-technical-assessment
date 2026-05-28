import { AgentCard } from '../components/agent/AgentCard';
import { AgentSearch } from '../components/agent/AgentSearch';
import {
  useAgentSearch,
  useAgentSearchBootstrap,
} from '../hooks/useAgentSearch';

export const Agents = () => {
  useAgentSearchBootstrap();
  const { filteredAgents, isLoading } = useAgentSearch();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Real Estate Agents</h1>

      <AgentSearch />

      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Available Agents</h2>
          <span className="text-gray-600">
            {isLoading ? 'Loading…' : `${filteredAgents.length} agents found`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {!isLoading && filteredAgents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No agents found matching your search criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};
