import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { ChildProcessInfo } from 'types';

interface childprocessInfoContext {
    childprocessInfo: ChildProcessInfo[];
    totalRam: number;
    peakRam: number;
    loadChildProcessInfo: () => Promise<void>;
}

const childprocessInfoState = create<childprocessInfoContext>()((set) => ({
    childprocessInfo: [],
    totalRam: 0,
    peakRam: 0,

    loadChildProcessInfo: async () => {
        // const childprocessInfo = await fetch('/api/childprocessInfo').then(res => res.json());
        // set({ childprocessInfo });
        const childprocessInfo = [
            {
                name: "Process 1",
                pid: 666,
                mem: Math.floor(Math.random() * 100)
            },
            {
                name: "Process 2",
                pid: 555,
                mem: Math.floor(Math.random() * 100)
            },
            {
                name: "Process 3",
                pid: 333,
                mem: Math.floor(Math.random() * 100)
            },
            {
                name: "Process 4",
                pid: 111,
                mem: Math.floor(Math.random() * 100)
            },
            {
                name: "Process 5",
                pid: 222,
                mem: Math.floor(Math.random() * 100)
            },
        ]
        const totalRam = childprocessInfo.reduce((acc, p) => acc + p.mem, 0);
        set( state => {
            if(totalRam > state.peakRam) {
                set({ peakRam: totalRam });
            }
            return {
                childprocessInfo,
                totalRam
            }
        });
    }
}));

const useChildProcessInfoState = createSelectors(childprocessInfoState);
export default useChildProcessInfoState;
