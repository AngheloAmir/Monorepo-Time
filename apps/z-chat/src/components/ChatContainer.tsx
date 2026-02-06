import useChatState from '../app/chat';
import TextInput from './TextInput';
import ChatContents from './ChatContents';

export default function ChatContainer() {
    const chats = useChatState.use.chats();

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] w-full max-w-[900px] mx-auto relative font-sans">
            {chats.length > 0 ? (
                <>
                    <ChatContents />
                    <TextInput />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full w-full p-4">
                    <div className="flex  gap-4 items-center justify-center">
                         <div className="w-10 h-10 mb-8">
                            <img src="/logo.svg" alt="MonoChat Logo" className="w-full h-full object-contain" />
                        </div>
                         <h2 className="text-xl font-bold text-white mb-8">How can I help you today?</h2>
                    </div>
                    <TextInput />
                </div>
            )}
        </div>
    );
}

