import { create } from 'zustand';
import { createSelectors } from './zustandSelector';

interface OrchestratorState {
    showOrchestrator: boolean;
    setShowOrchestrator: (showOrchestrator: boolean) => void;
}

const useOrchestratorBase = create<OrchestratorState>((set) => ({
    showOrchestrator: false,
    setShowOrchestrator: (showOrchestrator: boolean) => set({ showOrchestrator }),
}));

const useOrchestrator = createSelectors(useOrchestratorBase);
export default useOrchestrator;
