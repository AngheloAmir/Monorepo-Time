// ══════════════════════════════════════════════════════════════════════
// providerActions — Fetch providers, models, auth methods
// ══════════════════════════════════════════════════════════════════════
import type {
    ChatStoreState,
    //Provider,
    ProviderListResponse,
    ProviderAuthMethod,
    FlatModel,
    Auth,
} from './types';

type SetState = (partial: Partial<ChatStoreState> | ((s: ChatStoreState) => Partial<ChatStoreState>)) => void;
type GetState = () => ChatStoreState;

export function createProviderActions(set: SetState, get: GetState) {
    return {
        /**
         * Fetch all providers + connected list + models.
         * Endpoint: GET /provider
         * This single call gives us everything: providers, their models, connected list, and defaults.
         */
        fetchProviders: async (): Promise<void> => {
            const { apiBase } = get();
            try {
                const res = await fetch(`${apiBase}/provider`);
                if (!res.ok) return;
                const data: ProviderListResponse = await res.json();

                // Sort providers (opencode first, then alphabetical)
                const sorted = [...(data.all || [])].sort((a, b) => {
                    if (a.id === 'opencode') return -1;
                    if (b.id === 'opencode') return  1;
                    return a.name.localeCompare(b.name);
                });

                // Flatten models into a simple list for selectors
                const flatModels: FlatModel[] = [];
                for (const provider of sorted) {
                    if (provider.models && typeof provider.models === 'object') {
                        for (const model of Object.values(provider.models)) {
                            flatModels.push({
                                id:        `${provider.id}/${model.id}`,
                                name:      model.name || model.id,
                                provider:  provider.id,
                                reasoning: model.reasoning ?? false,
                            });
                        }
                    }
                }

                set({
                    providers:          sorted,
                    connectedProviders: data.connected || [],
                    providerDefaults:   data.default || {},
                    flatModels,
                });

                // Auto-select provider if not yet set
                if (!get().configSynced && !get().selectedProvider) {
                    const connected = sorted.filter(p =>
                        (data.connected || []).includes(p.id)
                    );
                    if (connected.length > 0) {
                        const nonZen = connected.find(p => p.id !== 'opencode');
                        set({ selectedProvider: (nonZen || connected[0]).id });
                    }
                }
            } catch (err) {
                console.error('[opencode] Failed to fetch providers:', err);
            }
        },

        /**
         * Fetch available auth methods for a provider.
         * Endpoint: GET /provider/auth
         */
        fetchAuthMethods: async (providerId: string): Promise<ProviderAuthMethod[]> => {
            const { apiBase } = get();
            try {
                const res = await fetch(`${apiBase}/provider/auth`);
                if (!res.ok) return [];
                const data: Record<string, ProviderAuthMethod[]> = await res.json();
                return data[providerId] || [];
            } catch (err) {
                console.error('[opencode] Failed to fetch auth methods:', err);
                return [];
            }
        },

        // ── Auth Credential Management ───────────────────────────────
        /**
         * Set auth credentials for a provider.
         * Endpoint: PUT /auth/{providerID}
         */
        setAuthCredentials: async (providerId: string, auth: Auth): Promise<boolean> => {
            const { apiBase } = get();
            try {
                const res = await fetch(`${apiBase}/auth/${providerId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(auth),
                });
                if (!res.ok) return false;
                // Refresh providers to reflect new connected status
                await get().fetchProviders();
                return true;
            } catch (err) {
                console.error('[opencode] Failed to set auth:', err);
                return false;
            }
        },

        /**
         * Remove auth credentials for a provider.
         * Endpoint: DELETE /auth/{providerID}
         */
        removeAuthCredentials: async (providerId: string): Promise<boolean> => {
            const { apiBase } = get();
            try {
                const res = await fetch(`${apiBase}/auth/${providerId}`, {
                    method: 'DELETE',
                });
                if (!res.ok) return false;
                await get().fetchProviders();
                return true;
            } catch (err) {
                console.error('[opencode] Failed to remove auth:', err);
                return false;
            }
        },

        // ── Auth UI helpers ──────────────────────────────────────────
        setShowAuthModal:   (show: boolean) => set({ showAuthModal: show }),
        setAuthProviderId:  (id: string)    => set({ authProviderId: id }),
        setAuthApiKey:      (key: string)   => set({ authApiKey: key }),

        /**
         * Convenience: connect a provider using the current auth modal state.
         */
        connectProviderWithKey: async (): Promise<void> => {
            const { authProviderId, authApiKey } = get();
            if (!authProviderId || !authApiKey) return;
            const success = await get().setAuthCredentials(authProviderId, {
                type:   'key',
                apiKey: authApiKey,
            });
            if (success) {
                set({
                    showAuthModal:   false,
                    authApiKey:      '',
                    authProviderId:  '',
                });
            }
        },
    };
}
