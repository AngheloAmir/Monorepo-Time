import { create } from 'zustand';
import { createSelectors } from '../appstates/zustandSelector';

type ModalType   = 'alert'   | 'confirm' | 'prompt' | 'selection' | null;
type ModalBanner = 'success' | 'warning' | 'error' | null;

interface modalContext {
    modal: ModalType;
    title:  string;
    message: string;
    data: any;
    callback: (result: any) => void | null;
    banner: ModalBanner;
    showModal: (modal: ModalType, title: string, message: string, banner?: ModalBanner, callback?: (result: any) => void, data?: any) => void   ;
    hideModal: () => void;
}

const modalstate = create<modalContext>()((set) => ({
    modal: null,
    title: "",
    message: "",
    banner: null,
    data: null,
    callback: () => {},
    showModal: (modal: ModalType, title: string, message: string, banner?: ModalBanner, callback?: (result: any) => void, data?: any) => {
        set({ modal, title, message, banner, callback, data });
    },
    hideModal: () => {
        set({ modal: null, title: "", message: "", banner: null, callback: () => {}, data: null });
    }
}));

const useModal = createSelectors(modalstate);
export default useModal;
