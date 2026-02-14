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

export let   opencodeInstances = new Map<string, OpencodeInstance>();

