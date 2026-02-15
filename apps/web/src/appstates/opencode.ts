import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { OpencodeInstance } from 'types';
import apiRoute from 'apiroute';
import config from 'config';

export interface OpencodeGUIInstance {
    instance:     OpencodeInstance;
    isActive:     boolean;
    conversation: any[];
}

interface OpencodeState {
    sidebarWidth: number;
    isResizing: boolean;
    setSidebarWidth: (width: number) => void;
    setIsResizing: (isResizing: boolean) => void;

    isOpencodeInstalled: boolean;
    checkOpencodeInstalled: () => Promise<void>;

    //Opencode GUIS
    isCreatingInstance: boolean;
    opencodeInstances: OpencodeGUIInstance[];
    setInstanceActive: (instanceId: string) => void;  //make this active and close others
    createInstance: (name: string)      => Promise<void>;
    closeInstance: (instanceId: string) => Promise<void>;
    loadInstances: () => Promise<void>;

}

const useOpencodeBase = create<OpencodeState>((set, get) => ({
    sidebarWidth: 285,
    isResizing: false,
    setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
    setIsResizing: (isResizing: boolean) => set({ isResizing: isResizing }),

    isOpencodeInstalled:    true,
    checkOpencodeInstalled: async () => {
        try {
            const response = await fetch(`${config.serverPath}${apiRoute.opencode}/check`);
            if (!response.ok) return;
            const data = await response.json() as {
                installed: boolean;
                isInPath: boolean;
                isNpmGlobal: boolean;
            };
            
            if(data.installed && data.isInPath && data.isNpmGlobal) {
                set({ isOpencodeInstalled: true });
            } else {
                set({ isOpencodeInstalled: false });
            }
        } catch (e) {
            console.error(e);
        }
    },

    //Opencode GUIS
    isCreatingInstance: false,
    opencodeInstances: [],

    setInstanceActive: (instanceId: string) => {
        const currentInstance = get().opencodeInstances.find((instance) => instance.instance.id === instanceId);
        if (!currentInstance) return;
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
        const instanceRes = await fetch(`${config.serverPath}${apiRoute.opencode}/stop`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: instanceId,
            })
        });
        if (!instanceRes.ok) {
            alert("Failed to close opencode terminal");
            return;
        }

        set((state) => ({
            opencodeInstances: state.opencodeInstances.filter((instance) => instance.instance.id !== instanceId),
        }))
    },

    createInstance: async (name: string) => {
        set({ isCreatingInstance: true });

        //make sure the ID is uquine
        let availableID = "";
        while (true) {
            const tempID = Math.random().toString(36).substring(6);
            const instance = get().opencodeInstances.find((instance) => instance.instance.id === tempID);
            if (!instance) {
                availableID = tempID;
                break;
            }
        }

        //do the fetch to create an intance
        const instanceRes = await fetch(`${config.serverPath}${apiRoute.opencodeCreateInstance}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                id: availableID,
            })
        });
        if (!instanceRes.ok) {
            alert("Failed to create new opencode terminal");
            set({ isCreatingInstance: false });
            return;
        }
        const instanceData     = await instanceRes.json() as OpencodeInstance;
        const opencodeInstance = [{
            instance: {
                id:             instanceData.id,
                name:           instanceData.name,
                url:            instanceData.url,
                port:           instanceData.port,
                createdAt:      instanceData.createdAt,
                lastSessionId:  instanceData.id,
            },
            isActive: true,
            conversation: [],
        }];

        //close all other instances and make the new one active
        const allInstanceTemp = get().opencodeInstances.map((instance) => {
            return {
                ...instance,
                isActive: false,
            }
        });
        set({
            opencodeInstances: [
                ...allInstanceTemp,
                ...opencodeInstance
            ]
        });

        set({ isCreatingInstance: false });
    },

    loadInstances: async () => {
        try {
            const response = await fetch(`${config.serverPath}${apiRoute.opencodeListInstances}`);
            if (!response.ok) return;
            const data              = await response.json();
            const tempInstance      = data.instances.map((dataInstance: OpencodeInstance) => {
                const instanceState = get().opencodeInstances.find((stateInstance) => stateInstance.instance.id === dataInstance.id);
                if (instanceState) {
                    return instanceState;
                }
                return {
                    instance: {
                        server:    null,
                        url:       dataInstance.url,
                        port:      dataInstance.port,
                        id:        dataInstance.id,
                        name:      dataInstance.name,
                        createdAt: dataInstance.createdAt,
                        pid:       dataInstance.pid,
                    },
                    isActive:     false,
                    conversation: [],
                }
            });
            set({ opencodeInstances: tempInstance });
        } catch (e) {
            console.error(e);
        }
    }
}))

const useOpencode = createSelectors(useOpencodeBase);
export default useOpencode;
