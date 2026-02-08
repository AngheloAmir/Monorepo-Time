import { useEffect } from "react";
import useAppState from "../../appstates/app";
import ModalBody from "../ui/ModalBody";
import ModalHeader from "../ui/ModalHeader";
import Button3 from "../ui/Button3";

interface HomeSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HomeSettingsModal({ isOpen, onClose }: HomeSettingsModalProps) {
    const terminalFontSize = useAppState.use.terminalFontSize();
    const setTerminalFontSize = useAppState.use.setTerminalFontSize();

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;


    return (
        <ModalBody width="420px">
            <ModalHeader
                close={onClose}
                title="Settings"
                description="Manage your preferences"
                icon="fa-solid fa-cog"
            />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <i className="fa-solid fa-text-height"></i>
                        </div>
                        <div>
                            <p className="font-medium text-white text-sm">Terminal Font Size</p>
                            <p className="text-xs text-gray-500">Adjust text readability</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 bg-black/20 rounded-lg p-1 border border-white/5">
                        <button
                            onClick={() => setTerminalFontSize(Math.max(10, terminalFontSize - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-95"
                        >
                            <i className="fa-solid fa-minus text-xs"></i>
                        </button>

                        <span className="w-10 text-center font-mono text-sm font-bold text-blue-400">
                            {terminalFontSize}
                        </span>

                        <button
                            onClick={() => setTerminalFontSize(Math.min(32, terminalFontSize + 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-95"
                        >
                            <i className="fa-solid fa-plus text-xs"></i>
                        </button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button3
                        onClick={onClose}
                        icon=""
                        text="Ok"
                    />
                </div>
            </div>
        </ModalBody>
    )
}
