
import { memo } from 'react';
import { Handle, Position } from 'reactflow';

export interface AgentNodeData {
    label: string;
    description?: string;
    icon?: string;
    status?: 'idle' | 'running' | 'completed' | 'failed';
}

const AgentNode = ({ data }: { data: AgentNodeData }) => {
    return (
        <div className="px-4 py-2 shadow-md rounded-md bg-zinc-900 border-2 border-zinc-700 w-[200px]">
            <div className="flex items-center">
                {data.icon && <div className="mr-2 text-xl">{data.icon}</div>}
                <div className="ml-2">
                    <div className="text-lg font-bold text-zinc-100">{data.label}</div>
                    {data.description && (
                        <div className="text-zinc-400 text-xs">{data.description}</div>
                    )}
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Left}
                className="h-16 !bg-zinc-500 rounded-none w-2 -ml-1"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-16 !bg-zinc-500 rounded-none h-2 -mb-1"
            />
            {data.status && (
                 <div className={`mt-2 text-xs font-semibold ${
                     data.status === 'running' ? 'text-blue-400' :
                     data.status === 'completed' ? 'text-green-400' :
                     data.status === 'failed' ? 'text-red-400' : 'text-zinc-500'
                 }`}>
                     Status: {data.status}
                 </div>
            )}
        </div>
    );
};

export default memo(AgentNode);
