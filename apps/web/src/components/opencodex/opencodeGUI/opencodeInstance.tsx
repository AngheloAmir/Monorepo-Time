import type { OpencodeGUIInstance } from '../../../appstates/opencode';
import ChatContainer from './Chat/ChatContainer';

export default function OpencodeInstance(props: OpencodeGUIInstance) {
    return (
        <div className={`w-full h-full ${props.isActive ? 'block' : 'hidden'}`}>
            <ChatContainer />
        </div>
    )
}
