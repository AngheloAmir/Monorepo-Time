import { create } from 'zustand';
import { createSelectors } from './zustandSelector';

export interface ChatItem {
    id: number;
    who: "user" | "system";
    timestamp: number;
    message: string;
}

interface chatContext {
    chats: Array<ChatItem>;
    textinput: string;
    addChat: (chat: ChatItem) => void;
    setTextinput: (textinput: string) => void;
}

const chatstate = create<chatContext>()((set) => ({
    chats: [],
    textinput: "",
    addChat: (chat: ChatItem) => set((state) => ({
        chats: [...state.chats, chat]
    })),
    setTextinput: (textinput: string) => set(() => ({
        textinput: textinput
    }))

}));

const useChatState = createSelectors(chatstate);
export default useChatState;

