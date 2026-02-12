
import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath } from 'reactflow';

const WorkflowEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            className="absolute pointer-events-auto bg-white px-2 py-1 rounded shadow-sm border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default memo(WorkflowEdge);
