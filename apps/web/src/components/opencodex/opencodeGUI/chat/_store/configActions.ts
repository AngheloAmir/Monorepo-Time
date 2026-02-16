// ══════════════════════════════════════════════════════════════════════
// fetchConfig — Global config & project config fetching/updating
// ══════════════════════════════════════════════════════════════════════
import type { ChatStoreState, GlobalConfig } from './types';

type SetState = (partial: Partial<ChatStoreState> | ((s: ChatStoreState) => Partial<ChatStoreState>)) => void;
type GetState = () => ChatStoreState;

export function createConfigActions(set: SetState, get: GetState) {
    return {
        /**
         * Fetch the GLOBAL config (not project-scoped).
         * Endpoint: GET /global/config
         */
        fetchGlobalConfig: async (): Promise<GlobalConfig | null> => {
            const { apiBase } = get();
            try {
                const res = await fetch(`${apiBase}/global/config`);
                if (!res.ok) return null;
                const config: GlobalConfig = await res.json();
                set({ globalConfig: config });
                return config;
            } catch (err) {
                console.error('[opencode] Failed to fetch global config:', err);
                return null;
            }
        },

        /**
         * Update the GLOBAL config.
         * Endpoint: PATCH /global/config
         */
        updateGlobalConfig: async (patch: Partial<GlobalConfig>): Promise<GlobalConfig | null> => {
            const { apiBase } = get();
            try {
                const res = await fetch(`${apiBase}/global/config`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(patch),
                });
                if (!res.ok) return null;
                const config: GlobalConfig = await res.json();
                set({ globalConfig: config });
                return config;
            } catch (err) {
                console.error('[opencode] Failed to update global config:', err);
                return null;
            }
        },

        /**
         * Fetch the project-scoped config.
         * Endpoint: GET /config
         */
        fetchConfig: async (): Promise<GlobalConfig | null> => {
            const { apiBase } = get();
            try {
                const res = await fetch(`${apiBase}/config`);
                if (!res.ok) return null;
                const config: GlobalConfig = await res.json();

                // Apply defaults from the config only on first sync
                if (!get().configSynced) {
                    const updates: Partial<ChatStoreState> = { configSynced: true };

                    // Set selected model from config
                    if (config.model) {
                        updates.selectedModel = config.model;
                        const providerFromModel = config.model.includes('/')
                            ? config.model.split('/')[0]
                            : '';
                        if (providerFromModel) {
                            updates.selectedProvider = providerFromModel;
                        }
                    }

                    // Set default agent if configured
                    if (config.default_agent) {
                        updates.selectedAgent = config.default_agent;
                    }

                    // Check for agent-specific model override
                    const currentAgent = get().selectedAgent;
                    if (config.agent?.[currentAgent]?.model) {
                        updates.selectedModel = config.agent[currentAgent].model!;
                    }

                    set(updates);
                }

                return config;
            } catch (err) {
                console.error('[opencode] Failed to fetch config:', err);
                return null;
            }
        },

        /**
         * Update the project-scoped config.
         * Endpoint: PATCH /config
         */
        updateConfig: async (patch: Partial<GlobalConfig>): Promise<GlobalConfig | null> => {
            const { apiBase } = get();
            try {
                const res = await fetch(`${apiBase}/config`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(patch),
                });
                if (!res.ok) return null;
                const config: GlobalConfig = await res.json();
                return config;
            } catch (err) {
                console.error('[opencode] Failed to update config:', err);
                return null;
            }
        },
    };
}
