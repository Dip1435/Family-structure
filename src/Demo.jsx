import ReactFlow, { Handle, Background } from "reactflow";
import "reactflow/dist/style.css";

const FamilyNode = ({ data }) => {
  return (
    <div className="relative flex items-center justify-center px-6 py-3 bg-white border border-gray-400 rounded-lg shadow-md">
      {/* Father (A) Handles */}
      {data.id === "Haribhai" && (
        <>
          <Handle
            type="source"
            position="right"
            id="right"
            className="!w-2 !h-2 !bg-gray-500"
          />
          <Handle
            type="source"
            position="bottom"
            id="bottom"
            className="!w-2 !h-2 !bg-gray-500"
          />
        </>
      )}

      {data.id === "Jamnaben" && (
        <Handle
          type="target"
          position="left"
          id="left"
          className="!w-2 !h-2 !bg-gray-500"
        />
      )}

      {data.id === "Manubhai" && (
        <>

          <Handle
            type="source"
            position="right"
            id="right"
            className="!w-2 !h-2 !bg-gray-500"
          />
          <Handle
            type="source"
            position="bottom"
            id="bottom"
            className="!w-2 !h-2 !bg-gray-500"
          />
          <Handle
            type="target"
            position="top"
            id="top"
            className="!w-2 !h-2 !bg-gray-500"
          />
        </>
      )}

      {data.id === "Chetanaben" && (
        <Handle
          type="target"
          position="left"
          id="left"
          className="!w-2 !h-2 !bg-gray-500"
        />
      )}
      {data.id === "Dip" && (
        <Handle
          type="target"
          position="top"
          id="top"
          className="!w-2 !h-2 !bg-gray-500"
        />
      )}
      {data.id === "Khushi" && (
        <Handle
          type="target"
          position="top"
          id="top"
          className="!w-2 !h-2 !bg-gray-500"
        />
      )}

      <span className="text-sm text-gray-800">{data.label}</span>
    </div>
  );
};

const familyNodes = [
  {
    id: "Haribhai",
    type: "family",
    position: { x: 300, y: 300 },
    data: { label: "Haribhai", id: "Haribhai" },
    children: ["Manubhai"],
    spouse: ["Jamnaben"],
  },
  {
    id: "Jamnaben",
    type: "family",
    position: { x: 450, y: 300 },
    data: { label: "Jamnaben", id: "Jamnaben" },
    spouse: ["Haribhai"],
    children: ["Manubhai"],
  },
  {
    id: "Manubhai",
    type: "family",
    position: { x: 300, y: 450 },
    data: { label: "Manubhai", id: "Manubhai" },
    spouse: ["Chetanaben"],
    children: ["Dip", "Khushi"],
  },
  {
    id: "Chetanaben",
    type: "family",
    position: { x: 450, y: 450 },
    data: { label: "Chetanaben", id: "Chetanaben" },
    spouse: ["Manubhai"],
    children: ["Dip", "Khushi"],
  },
  {
    id: "Dip",
    type: "family",
    position: { x: 300, y: 600 },
    data: { label: "Dip", id: "Dip" },
  },
  {
    id: "Khushi",
    type: "family",
    position: { x: 450, y: 600 },
    data: { label: "Khushi", id: "Khushi" },
  },
];

const familyEdges = [
  {
    id: "e-Haribhai-Jamnaben",
    source: "Haribhai",
    sourceHandle: "right",
    target: "Jamnaben",
    targetHandle: "left",
  },
  {
    id: "e-Haribhai-Manubhai",
    source: "Haribhai",
    sourceHandle: "bottom",
    target: "Manubhai",
    targetHandle: "top",
  },
  {
    id: "e-Manubhai-Chetanaben",
    source: "Manubhai",
    sourceHandle: "right",
    target: "Chetanaben",
    targetHandle: "left",
  },
  {
    id: "e-Maunubhai-Dip",
    source: "Manubhai",
    sourceHandle: "bottom",
    target: "Dip",
    targetHandle: "top",
  },
  {
    id: "e-Maunubhai-Khushi",
    source: "Manubhai",
    sourceHandle: "bottom",
    target: "Khushi",
    targetHandle: "top",
  },
];

const nodeTypes = { family: FamilyNode };

export default function FamilyTree() {
  return (
    <div className="h-screen w-full">
      <ReactFlow nodes={familyNodes} edges={familyEdges} nodeTypes={nodeTypes}>
        <Background />
      </ReactFlow>
    </div>
  );
}
