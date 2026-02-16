import type { OpencodeGUIInstance } from '../../../appstates/opencode';
import ChatContainer from './Chat/ChatContainer';

export default function OpencodeInstance(props: OpencodeGUIInstance) {
    const apiBase = `http://localhost:${props.instance.port}`;

    return (
        <div className={`w-full h-full ${props.isActive ? 'block' : 'hidden'}`}>
            <ChatContainer
                instanceId={props.instance.id}
                apiBase={apiBase}
            />
        </div>
    )
}
