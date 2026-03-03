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
          <span className="text-gray-400 text-xs ml-1 transition-transform duration-200" style={{ display: 'inline-block', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
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

// Build all nodes and edges based on expanded state
function buildFlowData(expandedCourses: Set<string>) {
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

  // Course nodes
  const courseCount = courses.length;
  const verticalSpacing = 100;
  const totalHeight = (courseCount - 1) * verticalSpacing;
  const startY = 250 - totalHeight / 2;

  courses.forEach((course, courseIndex) => {
    const courseId = `course-${course.id}`;
    const courseY = startY + courseIndex * verticalSpacing;
    const isExpanded = expandedCourses.has(course.id);

    nodes.push({
      id: courseId,
      type: 'courseNode',
      position: { x: 280, y: courseY },
      data: {
        label: course.title,
        level: 1,
        chapterCount: course.chapters.length,
        isExpanded,
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
    if (course.chapters.length > 0) {
      const chapterCount = course.chapters.length;
      const horizontalSpacing = 220;
      const verticalSpacingChapter = 45;
      const startX = 280 + horizontalSpacing;

      const maxChaptersPerColumn = 6;
      const columns = Math.ceil(chapterCount / maxChaptersPerColumn);
      const chaptersPerColumn = Math.ceil(chapterCount / columns);

      course.chapters.forEach((chapter, index) => {
        const columnIndex = Math.floor(index / chaptersPerColumn);
        const rowIndex = index % chaptersPerColumn;

        const x = startX + columnIndex * horizontalSpacing;
        const columnHeight = Math.min(chaptersPerColumn, chapterCount - columnIndex * chaptersPerColumn) * verticalSpacingChapter;
        const columnStartY = courseY - columnHeight / 2 + verticalSpacingChapter / 2;
        const y = columnStartY + rowIndex * verticalSpacingChapter;

        const chapterId = `chapter-${course.id}-${chapter.id}`;

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

        // Connect to course node or previous chapter in same column
        if (columnIndex === 0) {
          edges.push({
            id: `edge-${courseId}-${chapterId}`,
            source: courseId,
            target: chapterId,
            type: 'smoothstep',
            style: { stroke: '#cbd5e1', strokeWidth: 1.5 },
            hidden: !isExpanded,
          });
        } else {
          const prevChapterIndex = columnIndex * chaptersPerColumn - 1;
          if (prevChapterIndex >= 0) {
            const prevChapterId = `chapter-${course.id}-${course.chapters[prevChapterIndex].id}`;
            edges.push({
              id: `edge-${prevChapterId}-${chapterId}`,
              source: prevChapterId,
              target: chapterId,
              type: 'smoothstep',
              style: { stroke: '#cbd5e1', strokeWidth: 1.5 },
              hidden: !isExpanded,
            });
          }
        }
      });
    }
  });

  return { nodes, edges };
}

function CourseTreeInner() {
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const { fitView } = useReactFlow();

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildFlowData(new Set()),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when expanded courses change
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = buildFlowData(expandedCourses);
    setNodes(newNodes);
    setEdges(newEdges);

    // Fit view after a short delay to allow React to process the changes
    setTimeout(() => {
      fitView({ padding: 0.3, duration: 300 });
    }, 50);
  }, [expandedCourses, setNodes, setEdges, fitView]);

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
