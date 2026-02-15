import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { OpencodeInstance } from 'types';
import apiRoute from 'apiroute';
import config from 'config';

export interface OpencodeGUIInstance {
    instance: OpencodeInstance;
    isActive: boolean;
}

interface OpencodeState {
    sidebarWidth: number;
    isResizing: boolean;
    setSidebarWidth: (width: number) => void;
    setIsResizing: (isResizing: boolean) => void;

    //Opencode GUIS
    isCreatingInstance: boolean;
    opencodeInstances: OpencodeGUIInstance[];
    setInstanceActive: (instanceId: string) => void;  //make this active and close others
    createInstance: (name :string) => Promise<string>;
    closeInstance:  (instanceId: string) => Promise<void>;

    loadInstances: () => Promise<void>;

}

const useOpencodeBase = create<OpencodeState>((set, get) => ({
    sidebarWidth: 285,
    isResizing: false,
    setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
    setIsResizing: (isResizing: boolean) => set({ isResizing: isResizing }),

    //Opencode GUIS
    isCreatingInstance: false,
    opencodeInstances: [],

    setInstanceActive: (instanceId: string) => {
        const currentInstance = get().opencodeInstances.find((instance) => instance.instance.id === instanceId);
        if (!currentInstance)         return;
        if (currentInstance.isActive) return;
        if (get().isCreatingInstance) return;

        set((state) => ({
            opencodeInstances: state.opencodeInstances.map((instance) => {
                if (instance.instance.id === instanceId) {
                    return { ...instance, isActive: true };
                }
                return { ...instance, isActive: false };
            }),
        }));
    },

    closeInstance: async (instanceId: string) => {
        set((state) => ({
            opencodeInstances: state.opencodeInstances.filter((instance) => instance.instance.id !== instanceId),
        }))
    },

    createInstance: async ( name :string) => {
        set({ isCreatingInstance: true });
        const id = Math.random().toString(36).substring(6);

        set((state) => ({
            opencodeInstances: [...state.opencodeInstances, {
                instance: {
                    id:            id,
                    name:          name,
                    url:           `http://localhost:${3000 + state.opencodeInstances.length}`,
                    port:          3000 + state.opencodeInstances.length,
                    createdAt:     Date.now(),
                    lastSessionId: id,
                },
                isActive: false,
            }],
        }));

        set({ isCreatingInstance: false });
        return id;
    },

    loadInstances: async () => {
        try {
            const response = await fetch(`${config.serverPath}${apiRoute.opencodeListInstances}`);
            if (!response.ok) return;
            const data     = await response.json();
            const opencodeInstances = data.instances.map((instance: OpencodeInstance) => {
                return {
                    instance: {
                        server:        null,
                        url:           instance.url,
                        port:          instance.port,
                        id:            instance.id,
                        name:          instance.name,
                        createdAt:     instance.createdAt,
                        pid:           instance.pid,
                    },
                    isActive: false,
                }
            });
            set({ opencodeInstances: opencodeInstances });
        } catch (e) {
            console.error(e);
        }
    }
}))

const useOpencode = createSelectors(useOpencodeBase);
export default useOpencode;
