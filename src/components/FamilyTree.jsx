import { useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Position,
  useEdgesState,
  useNodesState,
} from "reactflow";
import NodeComponent from "./CustomNode";
import {
  findFather,
  findWife,
  isFather,
  isWife,
} from "./utils/commonFunctions";
import { familyEdges, familyNodes } from "./Data/dummyData";
const { Top, Bottom, Left, Right } = Position;

const FamilyTreeNode = ({
  member,
  setMember,
  setSelectedMember,
  setFormData,
  setIsAddMemberVisible,
}) => {
  const initialEdges = member?.flatMap((memb) => {
    const edges = [];
    let sourceId = memb?.relatedMemberId;

    let father = findFather(
      member?.find((p) => p.relation === "Mother")?.relatedMemberId,
      member
    );
    let BroOrSis = findFather(
      member?.find((p) => p.relation === "Brother" || p.relation === "Sister")
        ?.relatedMemberId,
      member
    );
    const Mother = findFather(
      member?.find((p) => p.relation === "Son" || p.relation === "Daughter")
        ?.relatedMemberId,
      member
    );
    const isMom = (id) => {
      return member.find((p) => p.id === id).relation === "Wife";
    };
    const findMom = (id) => {
      return member.find((p) => p.id === id && p.relation === "Wife")
        .relatedMemberId;
    };
    switch (memb?.relation) {
      case "Wife":
      case "Husband":
        edges.push({
          id: `edge-${memb?.id}`,
          source: sourceId,
          target: memb?.id,
          type: "straight",
          sourceHandle: "right",
          targetHandle: "left",
        });
        break;

      case "Son":
      case "Daughter":
        edges.push({
          id: `edge-${memb?.id}`,
          source:
            isFather(memb?.relatedMemberId, member) &&
            !isWife(memb?.relatedMemberId, member)
              ? sourceId
              : isFather(memb?.relatedMemberId, member) &&
                isWife(memb?.relatedMemberId, member)
              ? findWife(memb?.relatedMemberId, member)
              : Mother,
          target: memb?.id,
          type: "smoothstep",
          sourceHandle: "bottom",
          targetHandle: "top",
        });
        break;

      case "Brother":
      case "Sister":
        if (BroOrSis) {
          edges.push({
            id: `edge-${memb?.id}`,
            source: isMom(BroOrSis)
              ? findMom(BroOrSis)
              : isFather(BroOrSis)
              ? BroOrSis
              : Mother,

            target: memb?.id,
            type: "smoothstep",
            sourceHandle: "bottom",
            targetHandle: "top",
          });
        }
        break;

      case "Father":
        edges?.push({
          id: `edge-${memb?.id}`,
          source: memb?.id,
          target: memb?.relatedMemberId,
          type: "smoothstep",
          sourceHandle: "bottom",
          targetHandle: "top",
        });
        break;

      case "Mother":
        if (father) {
          edges.push({
            id: `edge-${memb?.id}`,
            source: father,
            target: memb?.id,
            type: "straight",
            sourceHandle: "right",
            targetHandle: "left",
          });
        }
        break;

      default:
        break;
    }
    return edges;
  });

  const positionNodes = () => {
    let positions = {};
    let siblingSpacing = 200;
    let spouseSpacing = 100;
    let count = 100;

    member?.forEach((memb) => {
      if (!memb?.relatedMemberId) {
        positions[memb?.id] = { x: 300, y: 50 };
      } else if (
        memb?.relation === "Father" &&
        positions[memb?.relatedMemberId]
      ) {
        positions[memb?.id] = {
          x: positions[memb?.relatedMemberId]?.x,
          y: positions[memb?.relatedMemberId]?.y - 300,
        };
      } else if (
        memb?.relation === "Brother" ||
        (memb.relation === "Sister" && positions[memb?.relatedMemberId])
      ) {
        positions[memb?.id] = {
          x: positions[memb?.relatedMemberId]?.x - count * 2,
          y: positions[memb?.relatedMemberId]?.y,
        };
        count += 200;
      } else if (
        (memb?.relation === "Wife" || memb?.relation === "Husband") &&
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
      } else if (
        (memb?.relation === "Son" || memb?.relation === "Daughter") &&
        positions[memb?.relatedMemberId]
      ) {
        // let siblings = member?.filter(
        //   (m) => m?.relatedMemberId === memb?.relatedMemberId
        // );
        // let siblingIndex = siblings?.findIndex((s) => s?.id === memb?.id);
        positions[memb?.id] = {
          x: positions[memb?.relatedMemberId]?.x + siblingSpacing * 2,
          y: positions[memb?.relatedMemberId]?.y + 300,
        };
      } else if (memb.relation === "Mother") {
        positions[memb?.id] = {
          x:
            positions[
              findFather(
                member?.find((p) => p.relation === "Mother")?.relatedMemberId,
                member
              )
            ]?.x + 250,
          y: positions[memb?.relatedMemberId]?.y,
        };
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
    sourcePosition:
      member?.relation === "Wife" ||
      member?.relation === "Husband" ||
      member?.relation === "Mother"
        ? Left
        : Bottom,
    targetPosition:
      member?.relation === "Wife" ||
      member?.relation === "Husband" ||
      member?.relation === "Mother"
        ? Right
        : Top,
  }));

  useEffect(() => {
    if (member?.length > 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    } else {
      setNodes(familyNodes);
      setEdges(familyEdges);
    }
  }, [member]);
  // const FamilyNode = ({ data }) => {
  //   return (
  //     <div className="relative flex items-center justify-center px-6 py-3 bg-white border border-gray-400 rounded-lg shadow-md">
  //       {data.id === "Haribhai" && (
  //         <>
  //           <Handle
  //             type="source"
  //             position="right"
  //             id="right"
  //             className="!w-2 !h-2 !bg-gray-500"
  //           />
  //           <Handle
  //             type="source"
  //             position="bottom"
  //             id="bottom"
  //             className="!w-2 !h-2 !bg-gray-500"
  //           />
  //         </>
  //       )}
  //       {data.id === "Jamnaben" && (
  //         <Handle
  //           type="target"
  //           position="left"
  //           id="left"
  //           className="!w-2 !h-2 !bg-gray-500"
  //         />
  //       )}
  //       {data.id === "Manubhai" && (
  //         <>

  //           <Handle
  //             type="source"
  //             position="right"
  //             id="right"
  //             className="!w-2 !h-2 !bg-gray-500"
  //           />
  //           <Handle
  //             type="source"
  //             position="bottom"
  //             id="bottom"
  //             className="!w-2 !h-2 !bg-gray-500"
  //           />
  //           <Handle
  //             type="target"
  //             position="top"
  //             id="top"
  //             className="!w-2 !h-2 !bg-gray-500"
  //           />
  //         </>
  //       )}
  //       {data.id === "Chetanaben" && (
  //         <Handle
  //           type="target"
  //           position="left"
  //           id="left"
  //           className="!w-2 !h-2 !bg-gray-500"
  //         />
  //       )}
  //       {data.id === "Dip" && (
  //         <Handle
  //           type="target"
  //           position="top"
  //           id="top"
  //           className="!w-2 !h-2 !bg-gray-500"
  //         />
  //       )}
  //       {data.id === "Khushi" && (
  //         <Handle
  //           type="target"
  //           position="top"
  //           id="top"
  //           className="!w-2 !h-2 !bg-gray-500"
  //         />
  //       )}

  //       <span className="text-sm text-gray-800">{data.label}</span>
  //     </div>
  //   );
  // };

  const [nodes, setNodes, onNodesChange] = useNodesState(familyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(familyEdges);

  const nodeTypes = useMemo(() => ({ custom: NodeComponent }), []);

  return (
    <div className=" w-full h-full overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default FamilyTreeNode;
