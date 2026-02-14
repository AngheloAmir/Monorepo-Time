export interface OpencodeInstance {
    server?: { close: () => void; url: string };
    url: string;
    port: number;
    id: string;
    name: string;
    pid?: number;
    createdAt: number;
    lastSessionId?: string;
}

/**
 * @example
 * ```typescript
 * export interface OpencodeClientInstance {
 *     instanceId: string; //OpencodeInstance ID
 *     clientId:   string; //the frontend predefined sessionId for reference
 *     sessionId:  string; //the actual sessionId from opencode
 *     client:     any;    //unknown data type from opencode
 *     clientName: string;
}
 */
export interface OpencodeClientInstance {
    instanceId: string; //OpencodeInstance ID
    clientId:   string; //the frontend predefined sessionId for reference
    sessionId:  string; //the actual sessionId from opencode
    client:     any;    //unknown data type from opencode
    clientName: string;
}

export let   opencodeInstances = new Map<string, OpencodeInstance>();
export const clientInstance    = new Map<string, OpencodeClientInstance>();
