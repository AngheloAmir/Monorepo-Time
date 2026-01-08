import { create } from 'zustand';
import { createSelectors } from '../_context/zustandSelector';

type ModalType   = 'alert'   | 'confirm' | 'prompt' | null;
type ModalBanner = 'success' | 'warning' | 'error' | null;

interface modalContext {
    modal: ModalType;
    title:  string;
    message: string;
    callback: (result: string | boolean | void) => void | null;
    banner: ModalBanner;
    showModal: (modal: ModalType, title: string, message: string, banner?: ModalBanner, callback?: (result: string | boolean | void) => void) => void   ;
    hideModal: () => void;
}

const modalstate = create<modalContext>()((set) => ({
    modal: null,
    title: "",
    message: "",
    banner: null,
    callback: () => {},
    showModal: (modal: ModalType, title: string, message: string, banner?: ModalBanner, callback?: (result: string | boolean | void) => void) => {
        set({ modal, title, message, banner, callback });
    },
    hideModal: () => {
        set({ modal: null, title: "", message: "", banner: null, callback: () => {} });
    }
}));

const useModal = createSelectors(modalstate);
export default useModal;
