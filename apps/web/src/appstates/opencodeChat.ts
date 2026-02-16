import { create } from 'zustand';
import { createSelectors } from './zustandSelector';

// ── Types ────────────────────────────────────────────────────────────
export interface ChatMessage {
    id:        string;
    role:      'user' | 'assistant' | 'event' | 'error';
    content:   string;
    timestamp: number;
    parts?:    MessagePart[];
    metadata?: MessageMetadata;
}

export interface MessagePart {
    type:    'text' | 'tool' | 'step-start' | 'step-finish' | 'thinking';
    text?:   string;
    tool?:   string;
    id?:     string;
    state?:  ToolState;
}

export interface ToolState {
    status: 'pending' | 'running' | 'completed' | 'error';
    args?:   Record<string, unknown>;
    result?: string;
    error?:  string;
}

export interface MessageMetadata {
    modelID?:    string;
    providerID?: string;
    cost?:       number;
    tokens?: {
        input:     number;
        output:    number;
        reasoning: number;
    };
}

export interface Provider {
    id:         string;
    name:       string;
    connected:  boolean;
    models?:    Model[];
    env?:       string[];
}

export interface Model {
    id:        string;
    name:      string;
    provider?: string;
}

export interface Agent {
    id:           string;
    name:         string;
    description?: string;
}

// ── State Interface ──────────────────────────────────────────────────
interface OpencodeChatState {
    // Per-instance chat data: instanceId -> messages
    instanceMessages: Record<string, ChatMessage[]>;
    instanceSessions: Record<string, string | null>;

    // Global provider/model state (shared across chats)
    providers:       Provider[];
    models:          Model[];
    agents:          Agent[];
    selectedModel:   string;
    selectedAgent:   string;
    currentProvider: string;
    reasoningEffort: string;

    // Sync tracking — prevents overwriting user's manual selections
    configSynced:    boolean;

    // UI state
    isLoading:          boolean;
    showProviderModal:  boolean;
    selectedProviderForAuth: string;
    providerApiKey:     string;
    tokenUsage:         number;
    isStreaming:         boolean;
    streamingContent:   string;

    // ── Actions ──────────────────────────────────────────────────────
    // Messages
    addMessage:         (instanceId: string, message: ChatMessage) => void;
    updateLastAssistantMessage: (instanceId: string, content: string, parts?: MessagePart[], metadata?: MessageMetadata) => void;
    clearMessages:      (instanceId: string) => void;
    getMessages:        (instanceId: string) => ChatMessage[];

    // Session
    createSession:      (instanceId: string, apiBase: string) => Promise<void>;
    getSessionId:       (instanceId: string) => string | null;

    // Fetch data & sync
    fetchProviders:     (apiBase: string) => Promise<void>;
    fetchConfig:        (apiBase: string) => Promise<void>;
    fetchAgents:        (apiBase: string) => Promise<void>;
    syncWithInstance:   (apiBase: string) => Promise<void>;

    // Provider auth
    connectProvider:    (apiBase: string) => Promise<void>;
    setActiveProvider:  (providerId: string) => void;
    setShowProviderModal:   (show: boolean) => void;
    setSelectedProviderForAuth: (providerId: string) => void;
    setProviderApiKey:  (key: string) => void;

    // Model/Agent/Reasoning
    setSelectedModel:   (model: string) => void;
    setSelectedAgent:   (agent: string) => void;
    setCurrentProvider: (provider: string) => void;
    setReasoningEffort: (effort: string) => void;

    // Send message
    sendMessage:        (instanceId: string, apiBase: string, input: string) => Promise<void>;

    // Streaming
    setIsStreaming:      (streaming: boolean) => void;
    setStreamingContent: (content: string) => void;

    // Token usage
    setTokenUsage:      (usage: number) => void;
}

// ── Store ────────────────────────────────────────────────────────────
const useOpencodeChatBase = create<OpencodeChatState>((set, get) => ({
    instanceMessages: {},
    instanceSessions: {},

    providers:       [],
    models:          [],
    agents:          [],
    selectedModel:   '',
    selectedAgent:   'build',
    currentProvider: '',
    reasoningEffort: 'medium',

    configSynced:       false,

    isLoading:          false,
    showProviderModal:  false,
    selectedProviderForAuth: '',
    providerApiKey:     '',
    tokenUsage:         0,
    isStreaming:         false,
    streamingContent:   '',

    // ── Message Actions ──────────────────────────────────────────────
    addMessage: (instanceId: string, message: ChatMessage) => {
        set((state) => ({
            instanceMessages: {
                ...state.instanceMessages,
                [instanceId]: [
                    ...(state.instanceMessages[instanceId] || []),
                    message,
                ],
            },
        }));
    },

    updateLastAssistantMessage: (instanceId: string, content: string, parts?: MessagePart[], metadata?: MessageMetadata) => {
        set((state) => {
            const msgs = state.instanceMessages[instanceId] || [];
            if (msgs.length === 0) return state;

            const lastMsg = msgs[msgs.length - 1];
            if (lastMsg.role !== 'assistant') return state;

            const updatedMsgs = [...msgs];
            updatedMsgs[updatedMsgs.length - 1] = {
                ...lastMsg,
                content,
                timestamp: Date.now(),
                ...(parts && { parts }),
                ...(metadata && { metadata }),
            };

            return {
                instanceMessages: {
                    ...state.instanceMessages,
                    [instanceId]: updatedMsgs,
                },
            };
        });
    },

    clearMessages: (instanceId: string) => {
        set((state) => ({
            instanceMessages: {
                ...state.instanceMessages,
                [instanceId]: [],
            },
        }));
    },

    getMessages: (instanceId: string) => {
        return get().instanceMessages[instanceId] || [];
    },

    // ── Session Actions ──────────────────────────────────────────────
    createSession: async (instanceId: string, apiBase: string) => {
        try {
            const res = await fetch(`${apiBase}/session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });
            const data = await res.json();
            set((state) => ({
                instanceSessions: {
                    ...state.instanceSessions,
                    [instanceId]: data.id,
                },
            }));
        } catch (err) {
            console.error('Failed to create session:', err);
        }
    },

    getSessionId: (instanceId: string) => {
        return get().instanceSessions[instanceId] || null;
    },

    // ── Fetch Data ───────────────────────────────────────────────────
    fetchProviders: async (apiBase: string) => {
        try {
            const res = await fetch(`${apiBase}/provider`);
            const data = await res.json();
            const sortedProviders = (data.all || []).sort((a: Provider, b: Provider) => {
                if (a.id === 'opencode') return -1;
                if (b.id === 'opencode') return 1;
                return a.name.localeCompare(b.name);
            });
            set({ providers: sortedProviders });

            // Auto-select active provider from connected providers
            // (only on first load, before user manually changes)
            if (!get().configSynced && !get().currentProvider) {
                const connected = sortedProviders.filter((p: Provider) => p.connected);
                if (connected.length > 0) {
                    // Prefer the first connected non-opencode provider, otherwise opencode
                    const nonZen = connected.find((p: Provider) => p.id !== 'opencode');
                    const active = nonZen || connected[0];
                    set({ currentProvider: active.id });
                }
            }
        } catch (err) {
            console.error('Failed to fetch providers:', err);
        }
    },

    fetchConfig: async (apiBase: string) => {
        try {
            const res = await fetch(`${apiBase}/config?directory=$PWD`);
            const data = await res.json();

            // Only apply instance config on initial sync (not after user manually changes)
            const isInitialSync = !get().configSynced;

            if (isInitialSync) {
                // Sync selected model from the instance's global config
                if (data.model) {
                    set({ selectedModel: data.model });
                    // Extract provider from model ID (e.g. "copilot/claude-3.5-sonnet" → "copilot")
                    const providerFromModel = data.model.includes('/') ? data.model.split('/')[0] : '';
                    if (providerFromModel) {
                        set({ currentProvider: providerFromModel });
                    }
                }
                // Agent-specific model overrides
                const currentAgent = get().selectedAgent;
                if (data.agent?.[currentAgent]?.model) {
                    set({ selectedModel: data.agent[currentAgent].model });
                } else if (data.agent?.build?.model) {
                    set({ selectedModel: data.agent.build.model });
                }

                // Sync reasoning effort if available
                if (data.reasoningEffort) {
                    set({ reasoningEffort: data.reasoningEffort });
                }
            }

            // Always fetch provider models (these are static data, not selections)
            const providersRes = await fetch(`${apiBase}/config/providers?directory=$PWD`);
            const providersData = await providersRes.json();
            if (providersData.providers) {
                const allModels: Model[] = [];
                const providerModelsMap: Record<string, Model[]> = {};

                providersData.providers.forEach((p: any) => {
                    const providerModels: Model[] = [];
                    if (p.models && typeof p.models === 'object') {
                        Object.values(p.models).forEach((m: any) => {
                            const model: Model = {
                                id:       `${p.id}/${m.id}`,
                                name:     m.name || m.id,
                                provider: p.id,
                            };
                            allModels.push(model);
                            providerModels.push(model);
                        });
                    }
                    providerModelsMap[p.id] = providerModels;
                });

                set({ models: allModels });
                set((state) => ({
                    providers: state.providers.map((provider) => ({
                        ...provider,
                        models: providerModelsMap[provider.id] || [],
                    })).sort((a, b) => {
                        if (a.id === 'opencode') return -1;
                        if (b.id === 'opencode') return 1;
                        return a.name.localeCompare(b.name);
                    }),
                }));
            }

            // Mark as synced after initial load
            if (isInitialSync) {
                set({ configSynced: true });
            }
        } catch (err) {
            console.error('Failed to fetch config:', err);
        }
    },

    fetchAgents: async (apiBase: string) => {
        try {
            const res = await fetch(`${apiBase}/agent`);
            const data = await res.json();
            set({ agents: data });
        } catch (err) {
            console.error('Failed to fetch agents:', err);
        }
    },

    // Full sync: fetch everything from the instance and apply as defaults
    syncWithInstance: async (apiBase: string) => {
        // Reset sync flag so fetchConfig applies instance values
        set({ configSynced: false });
        await get().fetchProviders(apiBase);
        await get().fetchConfig(apiBase);
        await get().fetchAgents(apiBase);
    },

    // ── Provider Auth ────────────────────────────────────────────────
    connectProvider: async (apiBase: string) => {
        const { selectedProviderForAuth, providerApiKey } = get();
        if (!selectedProviderForAuth || !providerApiKey) return;
        try {
            await fetch(`${apiBase}/auth/${selectedProviderForAuth}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: providerApiKey }),
            });
            set({
                showProviderModal:       false,
                providerApiKey:          '',
                selectedProviderForAuth: '',
            });
            get().fetchProviders(apiBase);
        } catch (err) {
            console.error('Failed to connect provider:', err);
        }
    },

    setActiveProvider: (providerId: string) => {
        set({
            currentProvider:  providerId,
            selectedModel:    '',
            showProviderModal: false,
        });
    },

    setShowProviderModal:   (show: boolean) => set({ showProviderModal: show }),
    setSelectedProviderForAuth: (providerId: string) => set({ selectedProviderForAuth: providerId }),
    setProviderApiKey:      (key: string) => set({ providerApiKey: key }),

    // ── Model/Agent/Reasoning ────────────────────────────────────────
    setSelectedModel:    (model: string) => set({ selectedModel: model }),
    setSelectedAgent:    (agent: string) => set({ selectedAgent: agent }),
    setCurrentProvider:  (provider: string) => set({ currentProvider: provider, selectedModel: '' }),
    setReasoningEffort:  (effort: string) => set({ reasoningEffort: effort }),

    // ── Send Message ─────────────────────────────────────────────────
    sendMessage: async (instanceId: string, apiBase: string, input: string) => {
        const sessionId = get().instanceSessions[instanceId];
        if (!input.trim() || !sessionId) return;

        const { selectedAgent, selectedModel, reasoningEffort } = get();

        // Add user message
        const userMessage: ChatMessage = {
            id:        `user-${Date.now()}`,
            role:      'user',
            content:   input,
            timestamp: Date.now(),
        };
        get().addMessage(instanceId, userMessage);
        set({ isLoading: true });

        try {
            const requestBody: any = {
                parts: [{ type: 'text', text: input }],
                agent: selectedAgent,
            };
            if (selectedModel) requestBody.model = selectedModel;
            if (reasoningEffort) requestBody.reasoningEffort = reasoningEffort;

            const res = await fetch(`${apiBase}/session/${sessionId}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await res.json();

            // Parse parts for thinking, tools, text
            const parts: MessagePart[] = [];
            let fullContent = '';

            if (data.parts && Array.isArray(data.parts)) {
                data.parts.forEach((p: any) => {
                    parts.push({
                        type: p.type || 'text',
                        text: p.text || '',
                        tool: p.tool,
                        id:   p.id,
                        state: p.state,
                    });
                    if (p.type === 'text' || !p.type) {
                        fullContent += p.text || '';
                    }
                });
            }

            const assistantMessage: ChatMessage = {
                id:        `assistant-${Date.now()}`,
                role:      'assistant',
                content:   fullContent || data.content || '',
                timestamp: Date.now(),
                parts:     parts.length > 0 ? parts : undefined,
                metadata:  data.metadata ? {
                    modelID:    data.metadata?.assistant?.modelID,
                    providerID: data.metadata?.assistant?.providerID,
                    cost:       data.metadata?.assistant?.cost,
                    tokens:     data.metadata?.assistant?.tokens ? {
                        input:     data.metadata.assistant.tokens.input,
                        output:    data.metadata.assistant.tokens.output,
                        reasoning: data.metadata.assistant.tokens.reasoning,
                    } : undefined,
                } : undefined,
            };
            get().addMessage(instanceId, assistantMessage);

            // Update token usage
            if (data.metadata?.assistant?.tokens) {
                const tokens = data.metadata.assistant.tokens;
                const totalTokens = tokens.input + tokens.output + (tokens.reasoning || 0);
                set({ tokenUsage: Math.min(100, Math.floor((totalTokens / 100000) * 100)) });
            }
        } catch (err) {
            console.error('Failed to send message:', err);
            const errorMessage: ChatMessage = {
                id:        `error-${Date.now()}`,
                role:      'error',
                content:   'Failed to connect to OpenCode server. Make sure the instance is running.',
                timestamp: Date.now(),
            };
            get().addMessage(instanceId, errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    // ── Streaming ────────────────────────────────────────────────────
    setIsStreaming:      (streaming: boolean) => set({ isStreaming: streaming }),
    setStreamingContent: (content: string) => set({ streamingContent: content }),

    // ── Token Usage ──────────────────────────────────────────────────
    setTokenUsage: (usage: number) => set({ tokenUsage: usage }),
}));

const useOpencodeChat = createSelectors(useOpencodeChatBase);
export default useOpencodeChat;
