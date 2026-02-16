// ══════════════════════════════════════════════════════════════════════
// agentActions — Fetch available agents
// ══════════════════════════════════════════════════════════════════════
import type { ChatStoreState, Agent } from './types';

type SetState = (partial: Partial<ChatStoreState> | ((s: ChatStoreState) => Partial<ChatStoreState>)) => void;
type GetState = () => ChatStoreState;

export function createAgentActions(set: SetState, get: GetState) {
    return {
        /**
         * Fetch all available agents.
         * Endpoint: GET /agent
         */
        fetchAgents: async (): Promise<void> => {
            const { apiBase } = get();
            try {
                const res = await fetch(`${apiBase}/agent`);
                if (!res.ok) return;
                const agents: Agent[] = await res.json();
                set({ agents });
            } catch (err) {
                console.error('[opencode] Failed to fetch agents:', err);
            }
        },
    };
}
