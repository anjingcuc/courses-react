'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  MarkerType,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
  NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { courses } from '@/lib/courses';

// Custom node component
function CourseNode({ data }: NodeProps) {
  const isRoot = data.level === 0;
  const isCourse = data.level === 1;
  const isChapter = data.level === 2;

  let nodeClass = 'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ';
  let dotColor = '';

  if (isRoot) {
    nodeClass += 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200';
    dotColor = 'bg-white';
  } else if (isCourse) {
    nodeClass += 'bg-white border-2 border-blue-400 text-blue-700 shadow-md hover:shadow-lg hover:border-blue-500 cursor-pointer';
    dotColor = 'bg-blue-500';
  } else {
    nodeClass += 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 cursor-pointer';
    dotColor = 'bg-gray-400';
  }

  return (
    <div className={nodeClass}>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-transparent !border-0 !w-1 !h-1"
      />
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span>{data.label}</span>
        {data.chapterCount && (
          <span className="text-xs opacity-60">({data.chapterCount})</span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-transparent !border-0 !w-1 !h-1"
      />
    </div>
  );
}

const nodeTypes = {
  courseNode: CourseNode,
};

// Convert course data to React Flow nodes and edges
function createFlowData() {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Root node
  const rootId = 'root';
  nodes.push({
    id: rootId,
    type: 'courseNode',
    position: { x: 0, y: 0 },
    data: { label: '课程资料', level: 0 },
  });

  // Course nodes
  courses.forEach((course, courseIndex) => {
    const courseId = `course-${course.id}`;
    const courseY = courseIndex * 80;

    nodes.push({
      id: courseId,
      type: 'courseNode',
      position: { x: 200, y: courseY },
      data: {
        label: course.title,
        level: 1,
        chapterCount: course.chapters.length,
      },
    });

    edges.push({
      id: `edge-root-${courseId}`,
      source: rootId,
      target: courseId,
      type: 'smoothstep',
      style: { stroke: '#94a3b8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
    });

    // Chapter nodes
    course.chapters.forEach((chapter, chapterIndex) => {
      const chapterId = `chapter-${course.id}-${chapter.id}`;
      const chapterY = courseY + (chapterIndex - course.chapters.length / 2 + 0.5) * 28;

      nodes.push({
        id: chapterId,
        type: 'courseNode',
        position: { x: 450, y: chapterY },
        data: {
          label: chapter.title,
          level: 2,
          courseId: course.id,
          chapterId: chapter.id,
        },
      });

      edges.push({
        id: `edge-${courseId}-${chapterId}`,
        source: courseId,
        target: chapterId,
        type: 'smoothstep',
        style: { stroke: '#cbd5e1', strokeWidth: 1.5 },
      });
    });
  });

  return { nodes, edges };
}

export function CourseTree() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => createFlowData(), []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-[500px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
}
