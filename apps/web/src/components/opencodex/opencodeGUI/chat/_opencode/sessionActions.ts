// ══════════════════════════════════════════════════════════════════════
// sessionActions — Session CRUD + fetch messages
// ══════════════════════════════════════════════════════════════════════
import type { ChatStoreState, Session, Message, Part } from './types';

type SetState = (partial: Partial<ChatStoreState> | ((s: ChatStoreState) => Partial<ChatStoreState>)) => void;
type GetState = () => ChatStoreState;

export function createSessionActions(set: SetState, get: GetState) {
    return {
        /**
         * Create a new session.
         * Endpoint: POST /session
         */
        createSession: async (title?: string): Promise<Session | null> => {
            const { apiBase } = get();
            try {
                const body: Record<string, any> = {};
                if (title) body.title = title;

                const res = await fetch(`${apiBase}/session`, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(body),
                });
                if (!res.ok) return null;
                const session: Session = await res.json();
                set({ sessionId: session.id, session });
                return session;
            } catch (err) {
                console.error('[opencode] Failed to create session:', err);
                return null;
            }
        },

        /**
         * List all sessions (recent first).
         * Endpoint: GET /session
         */
        listSessions: async (): Promise<Session[]> => {
            const { apiBase } = get();
            try {
                const res = await fetch(`${apiBase}/session`);
                if (!res.ok) return [];
                const sessions: Session[] = await res.json();
                set({ sessions });
                return sessions;
            } catch (err) {
                console.error('[opencode] Failed to list sessions:', err);
                return [];
            }
        },

        /**
         * Delete a session.
         * Endpoint: DELETE /session/{sessionID}
         */
        deleteSession: async (sessionId: string): Promise<boolean> => {
            const { apiBase } = get();
            try {
                const res = await fetch(`${apiBase}/session/${sessionId}`, {
                    method: 'DELETE',
                });
                if (!res.ok) return false;

                // Clear local state if this was the active session
                if (get().sessionId === sessionId) {
                    set({ sessionId: null, session: null, messages: [] });
                }
                // Remove from list
                set(s => ({
                    sessions: s.sessions.filter(session => session.id !== sessionId),
                }));
                return true;
            } catch (err) {
                console.error('[opencode] Failed to delete session:', err);
                return false;
            }
        },

        /**
         * Abort an active session.
         * Endpoint: POST /session/{sessionID}/abort
         */
        abortSession: async (sessionId: string): Promise<boolean> => {
            const { apiBase } = get();
            try {
                const res = await fetch(`${apiBase}/session/${sessionId}/abort`, {
                    method: 'POST',
                });
                if (!res.ok) return false;
                set({ isStreaming: false });
                return true;
            } catch (err) {
                console.error('[opencode] Failed to abort session:', err);
                return false;
            }
        },

        /**
         * Fetch all messages for a session.
         * Endpoint: GET /session/{sessionID}/message
         */
        fetchMessages: async (sessionId: string): Promise<void> => {
            const { apiBase } = get();
            try {
                const res = await fetch(`${apiBase}/session/${sessionId}/message`);
                if (!res.ok) return;
                const data: Array<{ info: Message; parts: Part[] }> = await res.json();
                set({ messages: data });
            } catch (err) {
                console.error('[opencode] Failed to fetch messages:', err);
            }
        },
    };
}
