import { create } from 'zustand';
import { createSelectors } from './zustandSelector';

export const NavigationalPages = [
    { name: 'dashboard', label: 'Dashboard', icon: 'fa fa-solid fa-house' },
    { name: 'workspace', label: 'Workspace', icon: 'fa fa-cube'},
    { name: 'turborepo', label: 'Turborepo', icon: 'fa fa-solid fa-truck-fast'},
    //{ name: 'cicd', label: 'Turbp CI/CD', icon: 'fa fa-server'},
    { name: 'crud', label: 'CRUD Tester', icon: 'fa fa-microscope'}
]

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

