// ══════════════════════════════════════════════════════════════════════
// chatActions — The main Chat() function with SSE streaming
//
// Chat flow:
//   1. POST to /session/{sessionID}/message  →  fires off the AI
//   2. Subscribe to /event SSE endpoint      →  receive real-time events:
//      - message.part.updated  (text, reasoning, tool calls, steps)
//      - message.updated       (message metadata, completion)
//      - session.status        (idle/busy)
//      - session.error         (errors)
//   3. Call onEvent() for each SSE event
//   4. Call onEnd()   when the assistant message is complete
// ══════════════════════════════════════════════════════════════════════
import type {
    ChatStoreState,
    AssistantMessage,
    Part,
    OnChatEvent,
    OnChatEnd,
    ChatEvent,
    SSEEvent,
} from './types';

type SetState = (partial: Partial<ChatStoreState> | ((s: ChatStoreState) => Partial<ChatStoreState>)) => void;
type GetState = () => ChatStoreState;

export function createChatActions(set: SetState, get: GetState) {
    return {
        /**
         * Send a chat message to the current session and stream the response via SSE.
         *
         * @param text     - The user's message text
         * @param onEvent  - Callback invoked for each AI event (text delta, tool call, thinking, etc)
         * @param onEnd    - Callback invoked once the assistant finishes responding
         *
         * Usage:
         * ```ts
         * await store.getState().chat(
         *   "Fix the TypeScript errors",
         *   (event) => {
         *     if (event.kind === 'text')      console.log('AI says:', event.text);
         *     if (event.kind === 'reasoning')  console.log('AI thinks:', event.text);
         *     if (event.kind === 'tool')       console.log('Tool:', event.tool, event.state.status);
         *   },
         *   (message) => {
         *     console.log('AI done!', message.cost, message.tokens);
         *   }
         * );
         * ```
         */
        chat: async (
            text:    string,
            onEvent: OnChatEvent,
            onEnd:   OnChatEnd,
        ): Promise<void> => {
            const { apiBase, sessionId, selectedAgent, selectedModel } = get();
            if (!text.trim() || !sessionId) {
                console.warn('[opencode] chat() called without text or session');
                return;
            }

            set({ isStreaming: true });

            // ── 1. Build the prompt body ─────────────────────────────
            const requestBody: Record<string, any> = {
                parts: [{ type: 'text', text }],
            };
            if (selectedAgent) requestBody.agent = selectedAgent;
            if (selectedModel) {
                const [providerID, modelID] = selectedModel.includes('/')
                    ? [selectedModel.split('/')[0], selectedModel.split('/').slice(1).join('/')]
                    : ['', selectedModel];
                if (providerID && modelID) {
                    requestBody.model = { providerID, modelID };
                }
            }

            // ── 2. Open SSE connection BEFORE sending the message ────
            // This ensures we don't miss any events
            const sseCleanup: { current: (() => void) | null } = { current: null };
            let resolved = false;

            const ssePromise = new Promise<void>((resolve) => {
                const eventSource = new EventSource(`${apiBase}/event`);
                set({ eventSource });

                const handleEvent = (e: MessageEvent) => {
                    try {
                        const sseEvent: SSEEvent = JSON.parse(e.data);
                        const chatEvent = mapSSEtoChatEvent(sseEvent, sessionId);
                        if (!chatEvent) return;

                        // Update streaming parts map for live UI updates
                        if (sseEvent.type === 'message.part.updated' && sseEvent.properties?.part) {
                            const part = sseEvent.properties.part as Part;
                            set(s => ({
                                streamingParts: { ...s.streamingParts, [part.id]: part },
                            }));
                        }

                        // Fire the user's callback
                        onEvent(chatEvent);

                        // Check if the message is done
                        if (sseEvent.type === 'message.updated') {
                            const info = sseEvent.properties?.info;
                            if (
                                info?.role === 'assistant' &&
                                info?.sessionID === sessionId &&
                                (info?.time?.completed || info?.finish)
                            ) {
                                onEnd(info as AssistantMessage);
                                resolved = true;
                                cleanup();
                                resolve();
                            }
                        }

                        // Also treat session.idle as completion fallback
                        if (sseEvent.type === 'session.idle') {
                            if (sseEvent.properties?.sessionID === sessionId && !resolved) {
                                // Fetch the final message to pass to onEnd
                                fetchFinalMessage(apiBase, sessionId).then((msg) => {
                                    if (msg) onEnd(msg);
                                    resolved = true;
                                    cleanup();
                                    resolve();
                                });
                            }
                        }

                        // Session error
                        if (sseEvent.type === 'session.error') {
                            if (sseEvent.properties?.sessionID === sessionId) {
                                resolved = true;
                                cleanup();
                                resolve();
                            }
                        }
                    } catch (err) {
                        console.error('[opencode] SSE parse error:', err);
                    }
                };

                eventSource.onmessage = handleEvent;
                eventSource.onerror = () => {
                    console.warn('[opencode] SSE connection error');
                    if (!resolved) {
                        resolved = true;
                        cleanup();
                        resolve();
                    }
                };

                const cleanup = () => {
                    eventSource.close();
                    set({ eventSource: null, isStreaming: false, streamingParts: {} });
                };

                sseCleanup.current = cleanup;
            });

            // ── 3. POST the message ──────────────────────────────────
            try {
                const res = await fetch(`${apiBase}/session/${sessionId}/message`, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(requestBody),
                });

                if (!res.ok) {
                    const errText = await res.text();
                    console.error('[opencode] Failed to send message:', errText);
                    onEvent({
                        kind:      'error',
                        sessionID: sessionId,
                        error:     { name: 'APIError', data: { message: errText } },
                    });
                    sseCleanup.current?.();
                    set({ isStreaming: false });
                    return;
                }
            } catch (err) {
                console.error('[opencode] Network error sending message:', err);
                onEvent({
                    kind:      'error',
                    sessionID: sessionId,
                    error:     { name: 'NetworkError', data: { message: String(err) } },
                });
                sseCleanup.current?.();
                set({ isStreaming: false });
                return;
            }
            await Promise.race([ssePromise]);
            if (sessionId) {
                await get().fetchMessages(sessionId);
            }
        },

        // ── SSE Management ───────────────────────────────────────────
        /**
         * Connect to the global SSE event stream for a session.
         * This is a persistent connection for receiving all events.
         */
        connectSSE: (sessionId: string): void => {
            // Close existing connection
            get().disconnectSSE();

            const { apiBase } = get();
            const eventSource = new EventSource(`${apiBase}/event`);
            set({ eventSource });

            eventSource.onmessage = (e: MessageEvent) => {
                try {
                    const sseEvent: SSEEvent = JSON.parse(e.data);

                    // Handle session status changes
                    if (sseEvent.type === 'session.status' && sseEvent.properties?.sessionID === sessionId) {
                        const status = sseEvent.properties.status;
                        set({ isStreaming: status?.type === 'busy' });
                    }

                    // Handle message updates (for live UI without chat())
                    if (sseEvent.type === 'message.part.updated') {
                        const part = sseEvent.properties?.part as Part;
                        if (part?.sessionID === sessionId) {
                            set(s => ({
                                streamingParts: { ...s.streamingParts, [part.id]: part },
                            }));
                        }
                    }

                    // Handle session idle - refresh messages
                    if (sseEvent.type === 'session.idle' && sseEvent.properties?.sessionID === sessionId) {
                        get().fetchMessages(sessionId);
                        set({ isStreaming: false, streamingParts: {} });
                    }
                } catch {
                    // Silently ignore parse errors on persistent SSE
                }
            };

            eventSource.onerror = () => {
                console.warn('[opencode] Persistent SSE connection lost, reconnecting in 3s...');
                setTimeout(() => {
                    if (get().sessionId === sessionId) {
                        get().connectSSE(sessionId);
                    }
                }, 3000);
            };
        },

        /**
         * Disconnect from the SSE event stream.
         */
        disconnectSSE: (): void => {
            const { eventSource } = get();
            if (eventSource) {
                eventSource.close();
                set({ eventSource: null });
            }
        },
    };
}


// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Map an SSE event to a ChatEvent that the user callback understands.
 * Returns null if the event is not relevant to the current session.
 */
function mapSSEtoChatEvent(sseEvent: SSEEvent, sessionId: string): ChatEvent | null {
    const props = sseEvent.properties;

    switch (sseEvent.type) {
        case 'message.part.updated': {
            const part = props?.part;
            if (!part || part.sessionID !== sessionId) return null;

            switch (part.type) {
                case 'text':
                    return {
                        kind:      'text',
                        partID:    part.id,
                        messageID: part.messageID,
                        text:      part.text || '',
                        delta:     props?.delta,
                    };
                case 'reasoning':
                    return {
                        kind:      'reasoning',
                        partID:    part.id,
                        messageID: part.messageID,
                        text:      part.text || '',
                    };
                case 'tool':
                    return {
                        kind:      'tool',
                        partID:    part.id,
                        messageID: part.messageID,
                        tool:      part.tool,
                        callID:    part.callID,
                        state:     part.state,
                    };
                case 'step-start':
                    return {
                        kind:      'step-start',
                        partID:    part.id,
                        messageID: part.messageID,
                    };
                case 'step-finish':
                    return {
                        kind:      'step-finish',
                        partID:    part.id,
                        messageID: part.messageID,
                        reason:    part.reason,
                        cost:      part.cost,
                        tokens: {
                            input:     part.tokens?.input     || 0,
                            output:    part.tokens?.output    || 0,
                            reasoning: part.tokens?.reasoning || 0,
                        },
                    };
                case 'subtask':
                    return {
                        kind:        'subtask',
                        partID:      part.id,
                        messageID:   part.messageID,
                        prompt:      part.prompt,
                        description: part.description,
                        agent:       part.agent,
                    };
                default:
                    return null;
            }
        }

        case 'session.status': {
            if (props?.sessionID !== sessionId) return null;
            return {
                kind:      'status',
                sessionID: props.sessionID,
                status:    props.status?.type || 'idle',
            };
        }

        case 'session.error': {
            if (props?.sessionID !== sessionId) return null;
            return {
                kind:      'error',
                sessionID: props.sessionID,
                error:     props.error || { name: 'UnknownError', data: { message: 'Unknown error' } },
            };
        }

        default:
            return null;
    }
}

/**
 * Fetch the latest assistant message for `onEnd` fallback (when session.idle fires).
 */
async function fetchFinalMessage(apiBase: string, sessionId: string): Promise<AssistantMessage | null> {
    try {
        const res = await fetch(`${apiBase}/session/${sessionId}/message`);
        if (!res.ok) return null;
        const data: Array<{ info: any; parts: any[] }> = await res.json();
        // Find the last assistant message
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].info.role === 'assistant') {
                return data[i].info as AssistantMessage;
            }
        }
        return null;
    } catch {
        return null;
    }
}
