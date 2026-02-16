// ══════════════════════════════════════════════════════════════════════
// OpenCode Chat Store — Types
// Derived from the OpenCode OpenAPI spec (localhost:4096/doc)
// ══════════════════════════════════════════════════════════════════════

// ── Provider & Model ─────────────────────────────────────────────────
export interface ProviderModel {
    id:           string;
    name:         string;
    family?:      string;
    release_date: string;
    attachment:   boolean;
    reasoning:    boolean;
    temperature:  boolean;
    tool_call:    boolean;
    cost?: {
        input:  number;
        output: number;
        cache_read?:  number;
        cache_write?: number;
    };
    limit: {
        context: number;
        input?:  number;
        output:  number;
    };
}

export interface Provider {
    id:     string;
    name:   string;
    env:    string[];
    npm?:   string;
    api?:   string;
    models: Record<string, ProviderModel>;
}

export interface ProviderListResponse {
    all:       Provider[];
    default:   Record<string, string>;
    connected: string[];
}

export interface FlatModel {
    id:         string;  // "providerID/modelID"
    name:       string;
    provider:   string;
    reasoning:  boolean;
}

// ── Agent ────────────────────────────────────────────────────────────
export interface Agent {
    id?:          string;
    name:         string;
    description?: string;
    options?:     Record<string, any>;
    permission?:  AgentPermission[];
    mode?:        string;
    native?:      boolean;
    hidden?:      boolean;
    prompt?:      string;
}

export interface AgentPermission {
    permission: string;
    action:     'allow' | 'deny' | 'ask';
    pattern:    string;
}

// ── Auth ─────────────────────────────────────────────────────────────
export interface Auth {
    type:    'key' | 'oauth';
    apiKey?: string;
    refresh?: string;
    access?:  string;
    expires?: string;
}

export interface ProviderAuthMethod {
    type:        string;
    name:        string;
    description: string;
}

// ── Config ───────────────────────────────────────────────────────────
export interface GlobalConfig {
    model?:          string;   // "provider/model"
    small_model?:    string;
    default_agent?:  string;
    theme?:          string;
    provider?:       Record<string, any>;
    agent?:          Record<string, AgentConfig>;
    mcp?:            Record<string, any>;
    [key: string]:   any;
}

export interface AgentConfig {
    model?:       string;
    prompt?:      string;
    temperature?: number;
    description?: string;
    disable?:     boolean;
}

// ── Session ──────────────────────────────────────────────────────────
export interface Session {
    id:         string;
    slug:       string;
    projectID:  string;
    directory:  string;
    parentID?:  string;
    title:      string;
    version:    string;
    time: {
        created:    number;
        updated:    number;
        compacting?: number;
        archived?:   number;
    };
}

// ── Messages & Parts ─────────────────────────────────────────────────
export interface UserMessage {
    id:        string;
    sessionID: string;
    role:      'user';
    time:      { created: number };
    agent:     string;
    model:     { providerID: string; modelID: string };
}

export interface AssistantMessage {
    id:         string;
    sessionID:  string;
    role:       'assistant';
    time:       { created: number; completed?: number };
    parentID:   string;
    modelID:    string;
    providerID: string;
    mode:       string;
    agent:      string;
    path:       { cwd: string; root: string };
    cost:       number;
    tokens: {
        input:     number;
        output:    number;
        reasoning: number;
        cache:     { read: number; write: number };
    };
    error?: MessageError;
    finish?: string;
}

export type Message = UserMessage | AssistantMessage;

export interface MessageError {
    name: string;
    data: Record<string, any>;
}

// ── Parts (SSE events deliver these) ─────────────────────────────────
export interface TextPart {
    id:        string;
    sessionID: string;
    messageID: string;
    type:      'text';
    text:      string;
    time?:     { start: number; end?: number };
}

export interface ReasoningPart {
    id:        string;
    sessionID: string;
    messageID: string;
    type:      'reasoning';
    text:      string;
    time:      { start: number; end?: number };
}

export interface ToolPart {
    id:        string;
    sessionID: string;
    messageID: string;
    type:      'tool';
    callID:    string;
    tool:      string;
    state:     ToolState;
}

export interface ToolState {
    status:   'pending' | 'running' | 'completed' | 'error';
    input:    Record<string, any>;
    raw?:     string;
    output?:  string;
    error?:   string;
    title?:   string;
    metadata?: Record<string, any>;
    time?:    { start: number; end?: number };
}

export interface StepStartPart {
    id:        string;
    sessionID: string;
    messageID: string;
    type:      'step-start';
    snapshot?: string;
}

export interface StepFinishPart {
    id:        string;
    sessionID: string;
    messageID: string;
    type:      'step-finish';
    reason:    string;
    cost:      number;
    tokens: {
        input:     number;
        output:    number;
        reasoning: number;
        cache:     { read: number; write: number };
    };
}

export interface SubtaskPart {
    id:          string;
    sessionID:   string;
    messageID:   string;
    type:        'subtask';
    prompt:      string;
    description: string;
    agent:       string;
}

export interface FilePart {
    id:        string;
    sessionID: string;
    messageID: string;
    type:      'file';
    mime:      string;
    url:       string;
    filename?: string;
}

export interface PatchPart {
    id:        string;
    sessionID: string;
    messageID: string;
    type:      'patch';
    hash:      string;
    files:     string[];
}

export type Part =
    | TextPart
    | ReasoningPart
    | ToolPart
    | StepStartPart
    | StepFinishPart
    | SubtaskPart
    | FilePart
    | PatchPart;

// ── SSE Event Types ──────────────────────────────────────────────────
export type SSEEventType =
    | 'message.updated'
    | 'message.removed'
    | 'message.part.updated'
    | 'message.part.removed'
    | 'session.status'
    | 'session.idle'
    | 'session.error'
    | 'session.created'
    | 'session.updated'
    | 'session.deleted'
    | 'permission.asked'
    | 'permission.replied'
    | 'question.asked'
    | 'todo.updated'
    | 'server.connected'
    | 'global.disposed';

export interface SSEEvent {
    type:       SSEEventType;
    properties: any;
}

// ── Chat Event Callbacks ─────────────────────────────────────────────
// These are the callback shapes for the Chat() function

export interface ChatEventText {
    kind:      'text';
    partID:    string;
    messageID: string;
    text:      string;
    delta?:    string;  // incremental text delta from SSE
}

export interface ChatEventReasoning {
    kind:      'reasoning';
    partID:    string;
    messageID: string;
    text:      string;
}

export interface ChatEventToolCall {
    kind:      'tool';
    partID:    string;
    messageID: string;
    tool:      string;
    callID:    string;
    state:     ToolState;
}

export interface ChatEventStepStart {
    kind:      'step-start';
    partID:    string;
    messageID: string;
}

export interface ChatEventStepFinish {
    kind:      'step-finish';
    partID:    string;
    messageID: string;
    reason:    string;
    cost:      number;
    tokens:    { input: number; output: number; reasoning: number };
}

export interface ChatEventSubtask {
    kind:        'subtask';
    partID:      string;
    messageID:   string;
    prompt:      string;
    description: string;
    agent:       string;
}

export interface ChatEventStatus {
    kind:      'status';
    sessionID: string;
    status:    'idle' | 'busy' | 'retry';
}

export interface ChatEventError {
    kind:      'error';
    sessionID: string;
    error:     MessageError;
}

export type ChatEvent =
    | ChatEventText
    | ChatEventReasoning
    | ChatEventToolCall
    | ChatEventStepStart
    | ChatEventStepFinish
    | ChatEventSubtask
    | ChatEventStatus
    | ChatEventError;

export type OnChatEvent = (event: ChatEvent) => void;
export type OnChatEnd   = (message: AssistantMessage) => void;

// ── Store Shape ──────────────────────────────────────────────────────
export interface ChatStoreState {
    // ── Connection ───────────────────────────────────────────────────
    apiBase:     string;     // e.g. "http://localhost:4096"
    connected:   boolean;
    serverVersion: string;

    // ── Config ───────────────────────────────────────────────────────
    globalConfig:     GlobalConfig | null;
    configSynced:     boolean;

    // ── Providers & Models ───────────────────────────────────────────
    providers:        Provider[];
    connectedProviders: string[];
    providerDefaults: Record<string, string>;  // providerID -> default modelID
    flatModels:       FlatModel[];

    // ── Selection (user preferences persisted via global config) ──
    selectedProvider: string;
    selectedModel:    string;   // "provider/model"
    selectedAgent:    string;

    // ── Agents ───────────────────────────────────────────────────────
    agents: Agent[];

    // ── Session ──────────────────────────────────────────────────────
    sessionId:       string | null;
    session:         Session | null;
    sessions:        Session[];

    // ── Chat ─────────────────────────────────────────────────────────
    messages:        Array<{ info: Message; parts: Part[] }>;
    isStreaming:      boolean;
    streamingParts:  Record<string, Part>;  // partID -> latest part state

    // ── SSE ──────────────────────────────────────────────────────────
    eventSource:     EventSource | null;

    // ── Auth UI ──────────────────────────────────────────────────────
    showAuthModal:   boolean;
    authProviderId:  string;
    authApiKey:      string;

    // ── Actions ──────────────────────────────────────────────────────
    // Init & Connection
    init:             (apiBase: string) => Promise<void>;
    checkHealth:      () => Promise<boolean>;
    dispose:          () => void;

    // Config
    fetchGlobalConfig:  () => Promise<GlobalConfig | null>;
    updateGlobalConfig: (patch: Partial<GlobalConfig>) => Promise<GlobalConfig | null>;
    fetchConfig:        () => Promise<GlobalConfig | null>;
    updateConfig:       (patch: Partial<GlobalConfig>) => Promise<GlobalConfig | null>;

    // Providers & Models
    fetchProviders:   () => Promise<void>;
    fetchAuthMethods: (providerId: string) => Promise<ProviderAuthMethod[]>;

    // Auth
    setAuthCredentials:    (providerId: string, auth: Auth) => Promise<boolean>;
    removeAuthCredentials: (providerId: string) => Promise<boolean>;
    setShowAuthModal:      (show: boolean) => void;
    setAuthProviderId:     (id: string) => void;
    setAuthApiKey:         (key: string) => void;
    connectProviderWithKey: () => Promise<void>;

    // Agents
    fetchAgents:     () => Promise<void>;

    // Sessions
    createSession:   (title?: string) => Promise<Session | null>;
    listSessions:    () => Promise<Session[]>;
    deleteSession:   (sessionId: string) => Promise<boolean>;
    abortSession:    (sessionId: string) => Promise<boolean>;
    fetchMessages:   (sessionId: string) => Promise<void>;

    // Selection
    setSelectedProvider: (provider: string) => void;
    setSelectedModel:    (model: string) => void;
    setSelectedAgent:    (agent: string) => void;

    // Chat (the main function!)
    chat: (
        text:      string,
        onEvent:   OnChatEvent,
        onEnd:     OnChatEnd,
    ) => Promise<void>;

    // SSE
    connectSSE:     (sessionId: string) => void;
    disconnectSSE:  () => void;

    // Sync: pull config + providers + agents and apply defaults
    syncAll:        () => Promise<void>;
}
