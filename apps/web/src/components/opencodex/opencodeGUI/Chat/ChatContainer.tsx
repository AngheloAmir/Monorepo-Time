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
    const createSession  = useOpencodeChat.use.createSession();
    const fetchProviders = useOpencodeChat.use.fetchProviders();
    const fetchConfig    = useOpencodeChat.use.fetchConfig();
    const fetchAgents    = useOpencodeChat.use.fetchAgents();
    const sessionId      = useOpencodeChat.use.instanceSessions();

    // Initialize session and fetch config on mount
    useEffect(() => {
        if (!sessionId[instanceId]) {
            createSession(instanceId, apiBase);
        }
        fetchProviders(apiBase);
        fetchConfig(apiBase);
        fetchAgents(apiBase);
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