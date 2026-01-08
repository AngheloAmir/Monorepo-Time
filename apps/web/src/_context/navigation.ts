import { create } from 'zustand';
import { createSelectors } from './zustandSelector';

export const NavigationalPages = [
    { name: 'home', label: 'Home', icon: 'fa fa-home' },
    { name: 'workspace', label: 'Workspace', icon: 'fa fa-cube'},
    { name: 'turborepo', label: 'Turbo Repo', icon: 'fa fa-solid fa-truck-fast'},
    { name: 'cicd', label: 'Turbp CI/CD', icon: 'fa fa-server'},
    { name: 'crud', label: 'CRUD Tester', icon: 'fa fa-microscope'}
]

interface navigationContext {
    currentPage: string;

    action: {
        setCurrentPage: (page: string) => void;
    }
}

const navstate = create<navigationContext>()((set) => ({
    currentPage: "home",

    action: {
        setCurrentPage: (page: string) => set({ currentPage: page })
    }
}));

const useNavState = createSelectors(navstate);
export default useNavState;

