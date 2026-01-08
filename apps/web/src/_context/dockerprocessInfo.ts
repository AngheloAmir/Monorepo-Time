import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { DockerProcessInfo } from 'types';

interface DockerProcessInfoContext {
    dockerprocessInfo: DockerProcessInfo[];
    loadDockerProcessInfo: () => Promise<void>;
}

const dockerprocessInfoState = create<DockerProcessInfoContext>()((set) => ({
    dockerprocessInfo: [],
    loadDockerProcessInfo: async () => {
        // const response = await fetch('/api/dockerprocessInfo');
        // const data = await response.json();
        // set({ dockerprocessInfo: data });
        //fake process
        const data = [
            {
                id: '1',
                image: 'image1',
                status: 'running',
                name: 'container1',
                memoryStr: '128MB',
                memoryBytes: 128 * 1024 * 1024,
            },
            {
                id: '2',
                image: 'image2',
                status: 'stopped',
                name: 'container2',
                memoryStr: '256MB',
                memoryBytes: 256 * 1024 * 1024,
            },
        ];
        set({ dockerprocessInfo: data });
    },
}));

const useDockerProcessInfoState = createSelectors(dockerprocessInfoState);
export default useDockerProcessInfoState;
