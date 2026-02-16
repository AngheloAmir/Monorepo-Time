// ══════════════════════════════════════════════════════════════════════
// OpenCode Chat — Zustand Store
//
// Manages the full interaction with an OpenCode instance:
//   • Agents, providers, models (fetched from /provider, /agent)
//   • Global config & project config (GET/PATCH /global/config, /config)
//   • Auth credential management (PUT/DELETE /auth/{providerID})
//   • Session lifecycle (create, list, delete, abort)
//   • Chat with SSE streaming — the main feature!
//
// Usage in components:
//   const agents   = useChatStore.use.agents();
//   const chat     = useChatStore.use.chat();
//   const provider = useChatStore.use.selectedProvider();
//
// Chat usage:
//   const chat = useChatStore.getState().chat;
//   await chat(
//     "Fix the bug in server.ts",
//     (event) => {                          // onEvent
//       if (event.kind === 'text')         → AI text output
//       if (event.kind === 'reasoning')    → AI thinking
//       if (event.kind === 'tool')         → Tool call (bash, file edit, etc.)
//       if (event.kind === 'step-start')   → New agentic step begins
//       if (event.kind === 'step-finish')  → Agentic step complete
//       if (event.kind === 'subtask')      → Subtask spawned
//       if (event.kind === 'status')       → Session status change
//       if (event.kind === 'error')        → Error occurred
//     },
//     (message) => console.log('Done!'),   // onEnd
//   );
// ══════════════════════════════════════════════════════════════════════
import { create } from 'zustand';
import { createSelectors } from '../../../../appstates/zustandSelector';
import type { ChatStoreState } from './_opencode/types';
import {
    createConfigActions,
    createProviderActions,
    createSessionActions,
    createChatActions,
    createAgentActions,
} from './_opencode/index';

// ── Create the store ─────────────────────────────────────────────────
const useChatStoreBase = create<ChatStoreState>((set, get) => ({
    // ── Connection ───────────────────────────────────────────────────
    apiBase:        '',
    connected:      false,
    serverVersion:  '',

    // ── Config ───────────────────────────────────────────────────────
    globalConfig:   null,
    configSynced:   false,

    // ── Providers & Models ───────────────────────────────────────────
    providers:          [],
    connectedProviders: [],
    providerDefaults:   {},
    flatModels:         [],

    // ── Selection ────────────────────────────────────────────────────
    selectedProvider: '',
    selectedModel:    '',
    selectedAgent:    'build',

    // ── Agents ───────────────────────────────────────────────────────
    agents: [],

    // ── Session ──────────────────────────────────────────────────────
    sessionId:  null,
    session:    null,
    sessions:   [],

    // ── Chat ─────────────────────────────────────────────────────────
    messages:       [],
    isStreaming:     false,
    streamingParts: {},

    // ── SSE ──────────────────────────────────────────────────────────
    eventSource: null,

    // ── Auth UI ──────────────────────────────────────────────────────
    showAuthModal:  false,
    authProviderId: '',
    authApiKey:     '',

    // ── Selection Setters ────────────────────────────────────────────
    setSelectedProvider: (provider: string) => set({ selectedProvider: provider, selectedModel: '' }),
    setSelectedModel:    (model: string)    => set({ selectedModel: model }),
    setSelectedAgent:    (agent: string)    => set({ selectedAgent: agent }),

    // ── Init ─────────────────────────────────────────────────────────
    /**
     * Initialize the store with an OpenCode instance's API base URL.
     * Checks health, then syncs everything (config, providers, agents).
     */
    init: async (apiBase: string): Promise<void> => {
        set({ apiBase });
        const healthy = await get().checkHealth();
        if (healthy) {
            await get().syncAll();
        }
    },

    /**
     * Check if the OpenCode server is healthy.
     * Endpoint: GET /global/health
     */
    checkHealth: async (): Promise<boolean> => {
        const { apiBase } = get();
        try {
            const res = await fetch(`${apiBase}/global/health`);
            if (!res.ok) return false;
            const data = await res.json();
            set({ connected: data.healthy === true, serverVersion: data.version || '' });
            return data.healthy === true;
        } catch {
            set({ connected: false });
            return false;
        }
    },

    /**
     * Clean up: close SSE, reset state.
     */
    dispose: (): void => {
        get().disconnectSSE();
        set({
            connected:      false,
            sessionId:      null,
            session:        null,
            messages:       [],
            isStreaming:     false,
            streamingParts: {},
            configSynced:   false,
        });
    },

    /**
     * Full sync: fetch config, providers, and agents from the instance.
     * Resets configSynced so the config values are applied as defaults.
     */
    syncAll: async (): Promise<void> => {
        set({ configSynced: false });
        await get().fetchProviders();
        await get().fetchConfig();
        await get().fetchAgents();
    },

    // ── Spread in all action modules ─────────────────────────────────
    ...createConfigActions(set, get),
    ...createProviderActions(set, get),
    ...createSessionActions(set, get),
    ...createChatActions(set, get),
    ...createAgentActions(set, get),
}));

// ── Export with auto-selectors ───────────────────────────────────────
const useChatStore = createSelectors(useChatStoreBase);
export default useChatStore;
