
import { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes, edgeTypes } from './ReactFlow';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'agent',
    position: { x: 250, y: 5 },
    data: { label: 'Start Agent', icon: '🚀', status: 'completed' },
  },
  {
    id: '2',
    type: 'agent',
    position: { x: 100, y: 100 },
    data: { label: 'Researcher', icon: '🔍', status: 'running' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'smoothstep' },
];

const VERTICAL_SPACING  = 150;
const HORIZONTAL_INDENT = 250;

// Simple custom layout function to achieve "file tree" style indentation
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  if (nodes.length === 0) return { nodes, edges };

  // 1. Build adjacency list (parent -> children)
  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string>();
  
  edges.forEach(edge => {
    if (!childrenMap.has(edge.source)) {
      childrenMap.set(edge.source, []);
    }
    childrenMap.get(edge.source)!.push(edge.target);
    parentMap.set(edge.target, edge.source);
  });

  // 2. Find roots (nodes with no parents)
  const roots = nodes.filter(node => !parentMap.has(node.id));
  
  // If connection cycle exists or something weird, just pick the first node as root fallback
  if (roots.length === 0 && nodes.length > 0) {
      roots.push(nodes[0]);
  }

  // 3. Traverse and assign positions
  let currentY = 50;
  const newNodes = [...nodes];
  const processed = new Set<string>();

  const traverse = (nodeId: string, depth: number) => {
    if (processed.has(nodeId)) return;
    processed.add(nodeId);

    const nodeIndex = newNodes.findIndex(n => n.id === nodeId);
    if (nodeIndex !== -1) {
        newNodes[nodeIndex] = {
            ...newNodes[nodeIndex],
            position: {
                x: 250 + (depth * HORIZONTAL_INDENT),
                y: currentY
            }
        };
        currentY += VERTICAL_SPACING;
    }

    const children = childrenMap.get(nodeId) || [];
    // Sort children by their current/previous Y position to maintain relative order if possible
    children.sort((a, b) => {
         const nodeA = nodes.find(n => n.id === a);
         const nodeB = nodes.find(n => n.id === b);
         return (nodeA?.position.y || 0) - (nodeB?.position.y || 0);
    });

    children.forEach(childId => traverse(childId, depth + 1));
  };

  // Sort roots too
  roots.sort((a,b) => a.position.y - b.position.y);
  roots.forEach(root => traverse(root.id, 0));

  // Handle any disconnected nodes (processed check handles duplicates)
  nodes.forEach(node => {
      if (!processed.has(node.id)) {
          traverse(node.id, 0);
      }
  });

  return { nodes: newNodes, edges };
};

export default function Workflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Auto-layout effect
  useEffect(() => {
     // We only want to run layout when the topological stricture changes (count of nodes/edges)
     // To avoid infinite loops where layout changes position -> triggers effect -> layout...
     // we could check if positions actually change significantly, or just rely on the assumption 
     // that we only add nodes/edges via user action.
     // However, setNodes triggers a re-render. 
     // A safer way is to have a function triggerLayout() and call it onDrop/onConnect.
     // But user asked "auto arrange them selves".
     
     // Let's run it once on mount and then whenever edge/node count changes
     const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges);
     
     // Check if we actually need to update to avoid infinite loop
     const positionsChanged = layoutedNodes.some((n) => {
         const oldN = nodes.find(on => on.id === n.id);
         if (!oldN) return true;
         return Math.abs(oldN.position.x - n.position.x) > 1 || Math.abs(oldN.position.y - n.position.y) > 1;
     });

     if (positionsChanged) {
        setNodes([...layoutedNodes]);
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, edges.length]); 
  // Dependency on length is a heuristic to avoid infinite loop on position updates.
  // Real layouting usually happens on specific triggers.

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const dataString = event.dataTransfer.getData('application/reactflow');
      if (!dataString) return;

      const data = JSON.parse(dataString);
      
      // check if the dropped element is valid
      if (typeof data === 'undefined' || !data || !reactFlowInstance) {
        return;
      }

      // Find the node that is furthest down (max Y) to attach to
      // We use a simple heuristic: the "last" node is the one at the bottom.
      // If there are multiple at the same level, we pick the last one in the array.
      let parentNode = null;
      // let newY = 50; // Default start Y if no nodes
      // let newX = 250; // Default start X

      if (nodes.length > 0) {
        // Find node with max Y
        // Since we are using an auto-layout that assigns Y based on visit order, 
        // the "last" node visually usually corresponds to the logic order.
        // However, the reduce below finds the node with the LARGEST Y.
        parentNode = nodes.reduce((prev, current) => 
          (prev.position.y > current.position.y) ? prev : current
        , nodes[0]);
      }

      const newNodeId = `${data.label}-${Date.now()}`;
      
      // Use a temporary position, the layout effect will fix it
      const newNode: Node = {
        id: newNodeId,
        type: 'agent',
        position: { x: 250, y: 0 }, // Initial temp position
        data: { 
            label: data.label, 
            icon: data.icon, 
            description: data.description,
            status: 'idle' 
        },
      };

      setNodes((nds) => nds.concat(newNode));

      if (parentNode) {
        const newEdge: Edge = {
            id: `e${parentNode.id}-${newNodeId}`,
            source: parentNode.id,
            target: newNodeId,
            type: 'smoothstep',
            animated: true
        };
        setEdges((eds) => eds.concat(newEdge));
      }
    },
    [reactFlowInstance, setNodes, setEdges, nodes],
  );

  return (
    <div className="flex-1 h-full w-full bg-zinc-950 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
}