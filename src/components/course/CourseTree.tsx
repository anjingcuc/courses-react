'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
  NodeProps,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import '@xyflow/react/dist/style.css';
import { courses } from '@/lib/courses';

// Layout configuration
const NODE_WIDTH = 160;
const NODE_HEIGHT = 40;
const HORIZONTAL_SPACING = 50;
const VERTICAL_SPACING = 15;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CourseNodeData = {
  label: string;
  level: number;
  chapterCount?: number;
  isExpanded?: boolean;
  courseId?: string;
};

// Custom node component
function CourseNode({ data }: NodeProps<Node<CourseNodeData>>) {
  const isRoot = data.level === 0;
  const isCourse = data.level === 1;
  const isExpanded = data.isExpanded;

  let nodeClass = 'px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ';
  let dotColor = '';

  if (isRoot) {
    nodeClass += 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/50';
    dotColor = 'bg-white';
  } else if (isCourse) {
    nodeClass += 'bg-white border-2 border-blue-400 text-gray-800 shadow-md hover:shadow-xl hover:border-blue-500 hover:-translate-y-0.5 cursor-pointer';
    dotColor = 'bg-blue-500';
  } else {
    nodeClass += 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 cursor-pointer';
    dotColor = 'bg-gray-400';
  }

  return (
    <div className={nodeClass}>
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-blue-400 !border-2 !border-white"
      />
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor} flex-shrink-0`} />
        <span className="whitespace-nowrap">{data.label}</span>
        {data.chapterCount && (
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
            {data.chapterCount}
          </span>
        )}
        {isCourse && (
          <span
            className="text-gray-400 text-xs ml-1 transition-transform duration-200"
            style={{ display: 'inline-block', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            ▶
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-blue-400 !border-2 !border-white"
      />
    </div>
  );
}

const nodeTypes = {
  courseNode: CourseNode,
};

// Use dagre to calculate auto layout
function getLayoutedElements(
  nodes: Node<CourseNodeData>[],
  edges: Edge[],
  expandedCourses: Set<string>
) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: 'LR',
    nodesep: HORIZONTAL_SPACING,
    ranksep: VERTICAL_SPACING * 4,
    marginx: 60,
    marginy: 60,
  });

  // Filter visible nodes
  const visibleNodes = nodes.filter((node) => {
    if (node.data.level === 2) {
      const courseId = node.id.split('-')[1];
      return expandedCourses.has(courseId);
    }
    return true;
  });

  // Add nodes to dagre
  visibleNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges to dagre (only for visible nodes)
  edges.forEach((edge) => {
    if (visibleNodes.some((n) => n.id === edge.source) && visibleNodes.some((n) => n.id === edge.target)) {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Update node positions
  const layoutedNodes: Node<CourseNodeData>[] = nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    const isVisible = visibleNodes.includes(node);

    if (dagreNode && isVisible) {
      return {
        ...node,
        hidden: false,
        position: {
          x: dagreNode.x - NODE_WIDTH / 2,
          y: dagreNode.y - NODE_HEIGHT / 2,
        },
      };
    }

    return {
      ...node,
      hidden: !isVisible,
    };
  });

  // Update edge visibility
  const layoutedEdges: Edge[] = edges.map((edge) => {
    const sourceVisible = visibleNodes.some((n) => n.id === edge.source);
    const targetVisible = visibleNodes.some((n) => n.id === edge.target);
    return {
      ...edge,
      hidden: !(sourceVisible && targetVisible),
    };
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
}

// Build all nodes and edges
function buildFlowData(): { nodes: Node<CourseNodeData>[]; edges: Edge[] } {
  const nodes: Node<CourseNodeData>[] = [];
  const edges: Edge[] = [];

  // Root node
  const rootId = 'root';
  nodes.push({
    id: rootId,
    type: 'courseNode',
    position: { x: 0, y: 0 },
    data: { label: '📚 课程资料', level: 0 },
  });

  // Course nodes
  courses.forEach((course) => {
    const courseId = `course-${course.id}`;

    nodes.push({
      id: courseId,
      type: 'courseNode',
      position: { x: 0, y: 0 },
      data: {
        label: course.title,
        level: 1,
        chapterCount: course.chapters.length,
        isExpanded: false,
        courseId: course.id,
      },
    });

    edges.push({
      id: `edge-${rootId}-${courseId}`,
      source: rootId,
      target: courseId,
      type: 'smoothstep',
      style: { stroke: '#94a3b8', strokeWidth: 2 },
    });

    // Chapter nodes
    course.chapters.forEach((chapter) => {
      const chapterId = `chapter-${course.id}-${chapter.id}`;

      nodes.push({
        id: chapterId,
        type: 'courseNode',
        position: { x: 0, y: 0 },
        data: {
          label: chapter.title,
          level: 2,
        },
        hidden: true,
      });

      edges.push({
        id: `edge-${courseId}-${chapterId}`,
        source: courseId,
        target: chapterId,
        type: 'smoothstep',
        style: { stroke: '#cbd5e1', strokeWidth: 1.5 },
        hidden: true,
      });
    });
  });

  return { nodes, edges };
}

function CourseTreeInner() {
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const { fitView } = useReactFlow();

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => buildFlowData(), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Apply layout when expanded courses change
  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      expandedCourses
    );

    // Update course expansion states
    const updatedNodes = layoutedNodes.map((node) => {
      if (node.data.level === 1 && node.data.courseId) {
        return {
          ...node,
          data: {
            ...node.data,
            isExpanded: expandedCourses.has(node.data.courseId),
          },
        };
      }
      return node;
    });

    setNodes(updatedNodes);
    setEdges(layoutedEdges);

    // Fit view after layout
    setTimeout(() => {
      fitView({ padding: 0.3, duration: 400 });
    }, 100);
  }, [expandedCourses, initialNodes, initialEdges, setNodes, setEdges, fitView]);

  const toggleCourse = useCallback((courseId: string) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  }, []);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<CourseNodeData>) => {
      if (node.data.level === 1 && node.data.courseId) {
        toggleCourse(node.data.courseId);
      }
    },
    [toggleCourse]
  );

  return (
    <div className="w-full h-[500px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            if (node.data.level === 0) return '#3b82f6';
            if (node.data.level === 1) return '#60a5fa';
            return '#94a3b8';
          }}
          maskColor="rgba(0,0,0,0.05)"
          style={{ background: 'rgba(255,255,255,0.8)' }}
        />
      </ReactFlow>
    </div>
  );
}

export function CourseTree() {
  return (
    <ReactFlowProvider>
      <CourseTreeInner />
    </ReactFlowProvider>
  );
}
