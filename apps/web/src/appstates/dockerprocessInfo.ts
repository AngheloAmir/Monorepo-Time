import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { DockerProcessInfo } from 'types';
import apiRoute from 'apiroute';
import { ServerPath } from './_relative';
interface DockerProcessInfoContext {
    dockerprocessInfo: DockerProcessInfo[];
    loadDockerProcessInfo: () => Promise<void>;
    stopDockerContainer: (id: string) => Promise<void>;
    stopAllDockerContainers: () => Promise<void>;
}

const dockerprocessInfoState = create<DockerProcessInfoContext>()((set, get) => ({
    dockerprocessInfo: [],
    loadDockerProcessInfo: async () => {
        try {
            const res = await fetch(`${ServerPath}${apiRoute.docker}`); // Correct URL based on API mount
            const data = await res.json();
            // data is { containers: [], totalMem: number }
            set({ dockerprocessInfo: data.containers });
        } catch (error) {
            console.error("Failed to load docker info", error);
        }
    },
    stopDockerContainer: async (id: string) => {
        try {
            await fetch(`${ServerPath}${apiRoute.docker}/stop`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            // Reload info after stopping
            await get().loadDockerProcessInfo();
        } catch (error) {
            console.error("Failed to stop container", error);
        }
    },
    stopAllDockerContainers: async () => {
        try {
            await fetch(`${ServerPath}${apiRoute.docker}/stop-all`, {
                method: 'POST'
            });
            // Reload info after stopping
            await get().loadDockerProcessInfo();
        } catch (error) {
           console.error("Failed to stop all containers", error);
        }
    }
}));

const useDockerProcessInfoState = createSelectors(dockerprocessInfoState);
export default useDockerProcessInfoState;
