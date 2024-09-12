import { useCallback, useState, useEffect } from "react";
import React from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  MarkerType,
  Panel,
  ConnectionLineType,
} from "reactflow";
import dagre from "dagre";
import CustomNode from "@/components/sections/Provanance/CustomNode";
import { useDependencyStore } from "@/stores/dependencyStore";
import "reactflow/dist/style.css";

const nodeTypes = {
  custom_1: CustomNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const ReactFlowWrapper = React.memo(function ReactFlowWrapper() {
  const dependencyList = useDependencyStore((state) => state.dependencyList);
  console.log("Dependency List:", dependencyList);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [layoutDirection, setLayoutDirection] = useState("TB");

  useEffect(() => {
    let nodes = [];
    let edges = [];
    let posX = 0;
    let posY = 0;

    dependencyList.forEach((item) => {
      item.dependency.forEach((dep) => {
        if (!nodes.find((node) => node.id === dep.sheet_id)) {
          nodes.push({
            id: dep.sheet_id,
            type: "custom_1",
            data: { name: dep.sheet_id, job: "CEO", emoji: "😎" },
            position: { x: posX, y: posY },
          });
          posX += 200;
          posY += 200;
        }

        if (!nodes.find((node) => node.id === item.sheet_id)) {
          nodes.push({
            id: item.sheet_id,
            type: "custom_1",
            data: { name: item.sheet_id, job: "CEO", emoji: "😎" },
            position: { x: posX, y: posY },
          });
          posX += 200;
          posY += 200;
        }

        edges.push({
          id: `e${dep.sheet_id}-${item.sheet_id}`,
          source: dep.sheet_id,
          target: item.sheet_id,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        });
      });
    });

    // deduplicate edges if id is the same
    edges = edges.filter(
      (edge, index, self) => index === self.findIndex((t) => t.id === edge.id),
    );

    const layoutedElements = getLayoutedElements(nodes, edges, layoutDirection);
    setNodes(layoutedElements.nodes);
    setEdges(layoutedElements.edges);
  }, [dependencyList, setNodes, setEdges, layoutDirection]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds,
        ),
      ),
    [],
  );

  const onLayout = useCallback(
    (direction) => {
      setLayoutDirection(direction);
      const layoutedElements = getLayoutedElements(nodes, edges, direction);
      setNodes([...layoutedElements.nodes]);
      setEdges([...layoutedElements.edges]);
    },
    [nodes, edges],
  );

  return (
    <div
      style={{ width: "100%", height: "95%" }}
      className="rounded-lg border border-solid"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultZoom={1}
        fitView
      >
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
});

export default ReactFlowWrapper;
