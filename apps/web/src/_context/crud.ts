import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { CrudCategory } from 'types';
import INITIAL_CRUD_DATA from './fake/defaultCurd';

interface CrudContext {
    crudData: CrudCategory[];
    useDevURL: boolean;
    devURL:  string;
    prodURL: string;
    params: string;
    method: string;

    currentCategoryIndex: number;
    setCurrentCategoryIndex: (index: number) => void;
    currentCrudIndex: number;
    setCurrentCrudIndex: (index: number) => void;

    loadCrudData: () => Promise<void>;
    setUseDevURL: (useDevURL: boolean) => void;
    setURL: (devURL: string, prodURL: string) => void;
    setParams: (params: string) => void;
    setMethod: (method: string) => void;

}

const crudState = create<CrudContext>()((set) => ({
    crudData: INITIAL_CRUD_DATA,
    currentCategoryIndex: 0,
    currentCrudIndex: 0,
    useDevURL: false,
    devURL: "http://localhost:3000",
    prodURL: "https://localhost:3000",
    params: "",
    method: "GET",

    loadCrudData: async () => set({ crudData: INITIAL_CRUD_DATA }),
    setUseDevURL: (useDevURL: boolean) => set({ useDevURL }),
    setURL: (devURL: string, prodURL: string) => set({ devURL, prodURL }),
    setParams: (params: string) => set({ params }),
    setMethod: (method: string) => set({ method }),

    setCurrentCategoryIndex: (index: number) => set({ currentCategoryIndex: index }),
    setCurrentCrudIndex: (index: number) => set({ currentCrudIndex: index }),

}));

const useCrudState = createSelectors(crudState);
export default useCrudState;
