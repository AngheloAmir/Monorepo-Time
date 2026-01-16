import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { ChildProcessInfo } from 'types';
import apiRoute from 'apiroute';
import { ServerPath } from './_relative';
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
        try {
            const res  = await fetch(`${ServerPath}${apiRoute.processTree}`);
            const data = await res.json();
            
            // data.processes contains the array.
            // Map to ChildProcessInfo structure: { name, pid, mem }
            // Convert mem (bytes) -> MB
            const childprocessInfo: ChildProcessInfo[] = data.processes.map((p: any) => {
                let name = p.name;
                // Remove "Terminal ( ... )" wrapper
                if (name.startsWith("Terminal (") && name.endsWith(")")) {
                    // Extract inner name: "Terminal ( myapp )" -> "myapp"
                    // Or "Terminal (myapp)" -> "myapp"
                    const match = name.match(/Terminal \(\s*(.*?)\s*\)/);
                    if (match && match[1]) {
                        name = match[1];
                    }
                }

                return {
                    name: name,
                    pid: p.pid,
                    mem: Math.round(p.memory / 1024 / 1024) // Bytes to MB
                };
            });

            const totalRam = childprocessInfo.reduce((acc, p) => acc + p.mem, 0);
            
            set(state => {
                const newPeak = totalRam > state.peakRam ? totalRam : state.peakRam;
                return {
                    childprocessInfo,
                    totalRam,
                    peakRam: newPeak
                };
            });
        } catch (error) {
            console.error("Failed to load process info", error);
        }
    }
}));

const useChildProcessInfoState = createSelectors(childprocessInfoState);
export default useChildProcessInfoState;
