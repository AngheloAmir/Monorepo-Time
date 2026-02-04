import { create } from 'zustand';
import { createSelectors } from '../appstates/zustandSelector';

type ModalType   = 'alert'   | 'confirm' | 'prompt' | 'selection' | null;
type ModalBanner = 'success' | 'warning' | 'error' | null;

interface modalContext {
    text: string;
    setText: (text: string) => void;

    modal: ModalType;
    title:  string;
    message: string;
    data: any;
    placeholder: string;
    callback: (result: any) => void | null;
    banner: ModalBanner;
    showModal: (modal: ModalType, title: string, message: string, banner?: ModalBanner, callback?: (result: any) => void, data?: any, placeholder?: string) => void   ;
    hideModal: () => void;
}

const modalstate = create<modalContext>()((set) => ({
    text: "",
    setText: (text: string) => {
        set({ text });
    },

    modal: null,
    title: "",
    message: "",
    banner: null,
    data: null,
    placeholder: "",
    callback: () => {},
    showModal: (modal: ModalType, title: string, message: string, banner?: ModalBanner, callback?: (result: any) => void, data?: any, placeholder?: string) => {
        set({ 
            modal, 
            title, 
            message, 
            banner, 
            callback, 
            data, 
            text: "", 
            placeholder: placeholder || "" 
        });
    },
    hideModal: () => {
        set({ 
            modal: null, 
            title: "", 
            message: "", 
            banner: null, 
            callback: () => {}, 
            data: null, 
            text: "", 
            placeholder: "" 
        });
    }
}));

const useModal = createSelectors(modalstate);
export default useModal;
