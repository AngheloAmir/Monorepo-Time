import { create } from 'zustand';
import { createSelectors } from './zustandSelector';

interface navigationContext {
    currentPage: string;

    action: {
        setCurrentPage: (page: string) => void;
    }
}

const navstate = create<navigationContext>()((set) => ({
    currentPage: "dashboard",

    action: {
        setCurrentPage: (page: string) => set({ currentPage: page })
    }
}));

const useNavState = createSelectors(navstate);
export default useNavState;

