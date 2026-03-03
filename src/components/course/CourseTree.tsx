'use client';

import { useState, useCallback } from 'react';
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
  Controls,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { courses } from '@/lib/courses';

// Custom node component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CourseNode({ data }: NodeProps<Node<any>>) {
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
        <span className="whitespace-nowrap">{data.label as string}</span>
        {data.chapterCount && (
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
            {data.chapterCount as number}
          </span>
        )}
        {isCourse && (
          <span className="text-gray-400 text-xs ml-1">
            {isExpanded ? '▼' : '▶'}
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

// Create initial nodes (only root and courses)
function createInitialNodes() {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Root node
  const rootId = 'root';
  nodes.push({
    id: rootId,
    type: 'courseNode',
    position: { x: 0, y: 250 },
    data: { label: '📚 课程资料', level: 0 },
  });

  // Course nodes only (chapters hidden by default)
  const courseCount = courses.length;
  const verticalSpacing = 100;
  const totalHeight = (courseCount - 1) * verticalSpacing;
  const startY = 250 - totalHeight / 2;

  courses.forEach((course, index) => {
    const courseId = `course-${course.id}`;
    const y = startY + index * verticalSpacing;

    nodes.push({
      id: courseId,
      type: 'courseNode',
      position: { x: 280, y },
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
  });

  return { nodes, edges };
}

// Create chapter nodes for a specific course
function createChapterNodes(
  courseId: string,
  courseY: number,
  isExpanded: boolean
): { nodes: Node[]; edges: Edge[] } {
  const course = courses.find((c) => c.id === courseId);
  if (!course) return { nodes: [], edges: [] };

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const chapterCount = course.chapters.length;

  // Calculate positions for chapters
  const horizontalSpacing = 220;
  const verticalSpacing = 45;
  const startX = 280 + horizontalSpacing;

  // Determine if chapters should be arranged horizontally or in a grid
  const maxChaptersPerColumn = 6;
  const columns = Math.ceil(chapterCount / maxChaptersPerColumn);
  const chaptersPerColumn = Math.ceil(chapterCount / columns);

  course.chapters.forEach((chapter, index) => {
    const columnIndex = Math.floor(index / chaptersPerColumn);
    const rowIndex = index % chaptersPerColumn;

    const x = startX + columnIndex * horizontalSpacing;
    const columnHeight = Math.min(chaptersPerColumn, chapterCount - columnIndex * chaptersPerColumn) * verticalSpacing;
    const columnStartY = courseY - columnHeight / 2 + verticalSpacing / 2;
    const y = columnStartY + rowIndex * verticalSpacing;

    const chapterId = `chapter-${courseId}-${chapter.id}`;

    nodes.push({
      id: chapterId,
      type: 'courseNode',
      position: { x, y },
      data: {
        label: chapter.title,
        level: 2,
      },
      hidden: !isExpanded,
    });

    const sourceId = columnIndex === 0 ? `course-${courseId}` : `chapter-${courseId}-${course.chapters[columnIndex * chaptersPerColumn - 1]?.id}`;

    edges.push({
      id: `edge-${sourceId}-${chapterId}`,
      source: sourceId,
      target: chapterId,
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 1.5 },
      hidden: !isExpanded,
    });
  });

  return { nodes, edges };
}

export function CourseTree() {
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

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

  // Build nodes and edges based on expanded state
  const { nodes: allNodes, edges: allEdges } = (() => {
    const initial = createInitialNodes();
    const allNodesList = [...initial.nodes];
    const allEdgesList = [...initial.edges];

    courses.forEach((course, index) => {
      const courseCount = courses.length;
      const verticalSpacing = 100;
      const totalHeight = (courseCount - 1) * verticalSpacing;
      const startY = 250 - totalHeight / 2;
      const courseY = startY + index * verticalSpacing;

      const isExpanded = expandedCourses.has(course.id);
      const { nodes: chapterNodes, edges: chapterEdges } = createChapterNodes(
        course.id,
        courseY,
        isExpanded
      );

      allNodesList.push(...chapterNodes);
      allEdgesList.push(...chapterEdges);

      // Update course node's isExpanded state
      const courseNode = allNodesList.find((n) => n.id === `course-${course.id}`);
      if (courseNode) {
        courseNode.data.isExpanded = isExpanded;
      }
    });

    return { nodes: allNodesList, edges: allEdgesList };
  })();

  const [nodes, setNodes, onNodesChange] = useNodesState(allNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(allEdges);

  // Update nodes when expanded courses change
  useState(() => {
    setNodes(allNodes);
    setEdges(allEdges);
  });

  // Handle node click for expand/collapse
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.data.level === 1 && node.data.courseId) {
        toggleCourse(node.data.courseId as string);
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
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
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
