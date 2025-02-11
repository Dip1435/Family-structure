import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo } from "react";
import { data } from "react-router";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Handle,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import NodeComponent from "./CustomNode";

const FamilyTreeNode = ({
  member,
  setMember,
  setSelectedMember,
  setFormData,
  setIsAddMemberVisible,
}) => {
  const initialEdges = member?.flatMap((memb) => {
    const edges = [];

    if (memb?.relation === "Father") {
      edges?.push({
        id: `edge-${memb?.id}`,
        source: memb?.relatedMemberId,
        target: memb?.id,
      });
    } else if (memb?.relation === "Brother") {
      let id = member.filter((person) => person.id === memb?.relatedMemberId);
      edges?.push({
        id: `edge-${memb?.id}`,
        source: id[0]?.relatedMemberId,
        target: memb?.id,
      });
    } else if (memb?.relation === "Sister") {
      let id = member.filter((person) => person.id === memb?.relatedMemberId);
      edges?.push({
        id: `edge-${memb?.id}`,
        source: id[0]?.relatedMemberId,
        target: memb?.id,
      });
    } else if (memb?.relation === "Wife") {
      edges?.push({
        id: `edge-${memb?.id}`,
        source: memb?.relatedMemberId,
        target: memb?.id,
      });
    } else if (memb?.relation === "Husband") {
      edges?.push({
        id: `edge-${memb?.id}`,
        source: memb?.relatedMemberId,
        target: memb?.id,
      });
    }

    return edges;
  });

  const positionNodes = () => {
    let positions = {};
    let level = 0;
    let siblingSpacing = 200;
    let parentY = -150;
    let siblingY = 150;
    let spouseSpacing = 100;
    let count = 100;

    member?.forEach((memb) => {
      if (!memb?.relatedMemberId) {
        positions[memb?.id] = { x: 0, y: 0 };
      } else if (
        memb?.relation === "Father" &&
        positions[memb?.relatedMemberId]
      ) {
        let siblings = member?.filter(
          (m) => m?.relatedMemberId === memb?.relatedMemberId
        );
        let siblingIndex = siblings?.findIndex((s) => s?.id === memb?.id);
        positions[memb?.id] = {
          x: siblingIndex * siblingSpacing,
          y: positions[memb?.relatedMemberId]?.y + 300,
        };
      } else if (
        memb?.relation === "Brother" &&
        positions[memb?.relatedMemberId]
      ) {
        positions[memb?.id] = {
          x: positions[memb?.relatedMemberId]?.x - count * 2,
          y: positions[memb?.relatedMemberId]?.y,
        };
        count += 100;
      } else if (
        memb?.relation === "Sister" &&
        positions[memb?.relatedMemberId]
      ) {
        positions[memb?.id] = {
          x: positions[memb?.relatedMemberId]?.x - count * 2,
          y: positions[memb?.relatedMemberId]?.y,
        };
        count += 100;
      } else if (
        memb?.relation === "Wife" &&
        positions[memb?.relatedMemberId]
      ) {
        positions[memb?.relatedMemberId] = {
          x: positions[memb?.relatedMemberId]?.x + spouseSpacing * 2,
          y: positions[memb?.relatedMemberId]?.y,
        };
        positions[memb?.id] = {
          x: positions[memb?.relatedMemberId]?.x + spouseSpacing * 2,
          y: positions[memb?.relatedMemberId]?.y,
        };

        count += 200;
      }
    });

    return positions;
  };

  const nodePositions = positionNodes();

  const initialNodes = member?.map((member) => ({
    id: member?.id,
    type: "custom",
    data: {
      label: `${member?.name}`,
      id: member?.id,
      gender: member?.gender,
      dob: member?.dob,
      member: member,
      setMember: setMember,
      setSelectedMember: setSelectedMember,
      setFormData: setFormData,
      setIsAddMemberVisible: setIsAddMemberVisible,
    },
    position: nodePositions[member?.id] || { x: 0, y: 0 },
  }));

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [member]);

  const [nodes, setNodes, onNodesChange] = useNodesState();
  const [edges, setEdges, onEdgesChange] = useEdgesState();

  const nodeTypes = useMemo(() => ({ custom: NodeComponent }), []);

  return (
    <div className=" w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>

    // <div className="flex flex-col items-center relative pt-4">
    //   <div className="flex flex-col items-center">
    // <div className="w-16 h-16 bg-white border-2 border-gray-500 rounded-full flex items-center justify-center shadow-md">
    //   👤
    // </div>
    //     {member?.partner ? (
    //       <p className="mt-2 text-sm font-semibold">{`${member?.name} & ${member?.partner}`}</p>
    //     ) : (
    //       <p className="mt-2 text-sm font-semibold">{member?.name}</p>
    //     )}
    //   </div>

    //   {member?.children && member?.children?.length > 0 && (
    //     <>
    //       <div className="w-0.5 h-6 bg-gray-500 mt-2"></div>
    //       {member?.children && member?.children?.length > 1 && (
    //         <div className="w-28 h-0.5 bg-gray-500 mt-2"></div>
    //       )}
    //     </>
    //   )}
    //   {member?.children && (
    //     <div className="flex mt-4 space-x-4">
    //       {member?.children?.map((child, index) => (
    //         <div key={index} className="flex flex-col items-center">
    //           <FamilyTreeNode member={child} />
    //         </div>
    //       ))}
    //     </div>
    //   )}
    // </div>
  );
};

/* ✅ PropTypes Validation */
FamilyTreeNode.propTypes = {
  member: PropTypes.shape([
    {
      id: PropTypes.number,
      name: PropTypes.string,
      gender: PropTypes.string,
      children: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
          children: PropTypes.array, // Children can be undefined
        })
      ),
    },
  ]),
  data: PropTypes.shape({
    label: PropTypes.string,
  }),
};

export default FamilyTreeNode;
