import type { OpencodeInstance } from 'types';

interface OpencodeInstanceProps {
    instance:  OpencodeInstance;
    isVisible: boolean;
}

export default function OpencodeInstance(props: OpencodeInstanceProps) {
    return (
        <div className={`w-full h-full ${props.isVisible ? 'block' : 'hidden'}`}>
            {
                props.instance.name
            }
        </div>
    )
}