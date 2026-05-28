import bcrypt from 'bcryptjs';
import { config } from '../config.js';
import type { DbSchema, Property, StoredUser } from '../types/domain.js';
import { mockUsers, mockAgents, mockProperties } from '../../../src/lib/mockData.js';

export function buildSeed(): DbSchema {
  const passwordHash = bcrypt.hashSync(config.defaultSeedPassword, 10);

  const users: StoredUser[] = mockUsers.map((u) => ({
    ...u,
    passwordHash,
  }));

  // mockProperties is typed with `agent: Agent` (the full agent record); the API
  // shape uses a smaller PropertyAgentRef. Project it down here.
  const properties: Property[] = mockProperties.map((p) => ({
    ...p,
    agent: {
      id: p.agent.id,
      name: p.agent.name,
      phone: p.agent.phone,
      email: p.agent.email,
    },
  }));

  return {
    users,
    agents: mockAgents,
    properties,
    wishlists: [{ userId: 'u1', propertyIds: [] }],
    messages: [],
  };
}
