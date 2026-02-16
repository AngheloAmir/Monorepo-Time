import { useEffect }    from 'react';
import useOpencodeChat  from '../../../../appstates/opencodeChat';
import ChatHeader       from './ChatHeader';
import ChatMessages     from './ChatMessages';
import ChatInput        from './ChatInput';
import ProviderModal    from './ProviderModal';

interface ChatContainerProps {
    instanceId: string;
    apiBase:    string;
}

export default function ChatContainer({ instanceId, apiBase }: ChatContainerProps) {
    const createSession     = useOpencodeChat.use.createSession();
    const syncWithInstance  = useOpencodeChat.use.syncWithInstance();
    const sessionId         = useOpencodeChat.use.instanceSessions();

    // Initialize: create session + sync config/providers/model from the OpenCode instance
    useEffect(() => {
        if (!sessionId[instanceId]) {
            createSession(instanceId, apiBase);
        }
        // Sync provider, model, and agent from the instance's global config
        // If the user set Copilot + Claude in the real OpenCode web, we'll pick that up
        syncWithInstance(apiBase);
    }, [instanceId, apiBase]);

    return (
        <div className="flex flex-col h-full w-full bg-[#0a0a0a] overflow-hidden">
            <ChatHeader
                instanceId={instanceId}
                apiBase={apiBase}
            />

            <ChatMessages
                instanceId={instanceId}
                apiBase={apiBase}
            />

            <ChatInput
                instanceId={instanceId}
                apiBase={apiBase}
            />

            <ProviderModal apiBase={apiBase} />
        </div>
    );
}