import { useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  useEdgesState,
  useNodesState,
} from "reactflow";
import NodeComponent from "./CustomNode";
import { familyEdges, familyNodes } from "./Data/dummyData";

const FamilyTreeNode = ({
  member,
  setMember,
  setSelectedMember,
  setFormData,
  setIsAddMemberVisible,
}) => {
  const initialEdges = member?.flatMap((memb) => {
    let edges = [];
    const { id, spouse, parents } = memb;
    // Get father first
    const father = parents?.find((p) => {
      const parent = member.find((m) => m.id === p);
      return parent?.gender === "Male";
    });
    // Get mother second
    const mother = parents?.find((p) => {
      const parent = member.find((m) => m.id === p);
      return parent?.gender === "Female";
    });

    if ((father && parents?.length >= 0) || memb.gender === "Male") {
      edges.push({
        id: `edge-${id}-father`,
        source: father,
        target: memb?.id,
        type: "smoothstep",
        sourceHandle: "bottom",
        targetHandle: "top",
      });

      const allChildren = member?.filter((m) => m.parents?.includes(mother));

      allChildren?.forEach((child) => {
        edges.push({
          id: `edge-${child.id}-${id}`,
          source: father,
          target: child?.id,
          type: "smoothstep",
          sourceHandle: "bottom",
          targetHandle: "top",
        });
      });
    }

    if (mother && parents?.length >= 0) {
      edges.push({
        id: `edge-${id}-mother`,
        source: father ? father : mother,
        target: father ? mother : memb.id,
        type: "smoothstep",
        sourceHandle: father ? "right" : "bottom",
        targetHandle: father ? "left" : "top",
      });
    }
    // Handle Spouse Connection
    if (spouse.length > 0) {
      edges.push({
        id: `edge-${memb?.id}-spouse`,
        source:
          memb.relation === "Husband"
            ? memb?.id
            : memb.relation === "Wife"
            ? memb.relatedMemberId
            : father && father,
        target:
          memb.relation === "Husband"
            ? memb.relatedMemberId
            : memb.relation === "Wife"
            ? memb.id
            : mother && mother,
        type: "smoothstep",
        sourceHandle: "right",
        targetHandle: "left",
      });
    }

    return edges;
  });

  const positionNodes = () => {
    let positions = {};
    let count = 100;

    member?.forEach((memb) => {
      if (!memb?.relatedMemberId) {
        positions[memb?.id] = { x: 0, y: 100 };
      }
      if (memb?.relation === "Father" && positions[memb?.relatedMemberId]) {
        positions[memb?.id] = {
          x: positions[memb?.relatedMemberId]?.x,
          y: positions[memb?.relatedMemberId]?.y - 250,
        };
      }
      if (
        memb?.relation === "Brother" ||
        (memb.relation === "Sister" && positions[memb?.relatedMemberId])
      ) {
        positions[memb?.id] = {
          x: positions[memb?.relatedMemberId]?.x - count * 2,
          y: positions[memb?.relatedMemberId]?.y,
        };
        count += 200;
      }
      if (
        (memb?.relation === "Wife" || memb?.relation === "Husband") &&
        positions[memb?.relatedMemberId]
      ) {
        positions[memb?.id] = {
          x: positions[memb?.relatedMemberId]?.x + 210,
          y: positions[memb?.relatedMemberId]?.y,
        };
      }
      if (
        (memb?.relation === "Son" || memb?.relation === "Daughter") &&
        positions[memb?.relatedMemberId]
      ) {
        const childrens = member.find(
          (p) => p.id === memb.relatedMemberId
        ).children;
        positions[memb?.id] = {
          x:
            childrens?.length > 0
              ? positions[childrens[0]]?.x - 210
              : positions[memb?.relatedMemberId]?.x - 210,
          y:
            childrens?.length > 0
              ? positions[childrens[0]]?.y
              : positions[memb?.relatedMemberId]?.y + 300,
        };
      }

      if (memb.relation === "Mother" && positions[memb?.relatedMemberId]) {
        const hasFather = (id, memId) => {
          const father = member
            ?.find((p) => p.id === id)
            .parents?.filter((p) => p !== memId);
          return father;
        };
        positions[memb?.id] = {
          x:
            hasFather(memb?.relatedMemberId, memb.id).length > 0
              ? positions[hasFather(memb?.relatedMemberId, memb.id)[0]]?.x + 210
              : positions[memb?.relatedMemberId]?.x,
          y:
            hasFather(memb?.relatedMemberId, memb.id).length > 0
              ? positions[hasFather(memb?.relatedMemberId, memb.id)[0]]?.y
              : positions[memb?.relatedMemberId]?.y - 250,
        };
      }

      // if (memb.relation === "Mother") {
      //   positions[memb?.id] = {
      //     x:
      //       positions[
      //         findFather(
      //           member?.find((p) => p.relation === "Mother")?.relatedMemberId,
      //           member
      //         )
      //       ]?.x + 250,
      //     y: positions[memb?.relatedMemberId]?.y,
      //   };
      // }
    });

    return positions;
  };

  // const positionNodes = () => {
  //   let positions = {};
  //   let siblingSpacing = 210;
  //   let spouseSpacing = 210;
  //   let verticalSpacing = 250;
  //   let rootX = 0; // Track X position for new roots
  //   let parentMap = {}; // Store parent-child relationships for alignment

  //   member?.forEach((memb) => {
  //     if (!memb?.relatedMemberId) {
  //       positions[memb?.id] = { x: rootX, y: 100 };
  //       rootX += siblingSpacing * 3;
  //     }
  //     // If the member has parents, align them properly
  //     if (memb?.parents?.length > 0) {
  //       let parentX = 0;
  //       let count = 0;
  //       let maxY = 0;

  //       memb.parents.forEach((parentId) => {
  //         if (positions[parentId]) {
  //           parentX += positions[parentId].x;
  //           maxY = Math.max(maxY, positions[parentId].y);
  //           count++;
  //         }
  //       });

  //       if (count > 0) {
  //         positions[memb?.id] = {
  //           x: parentX / count,
  //           y: maxY + verticalSpacing,
  //         };

  //         // Track parent-child relationships for sibling positioning
  //         if (!parentMap[memb.parents[0]]) {
  //           parentMap[memb.parents[0]] = [];
  //         }
  //         parentMap[memb.parents[0]].push(memb.id);
  //       }
  //     }

  //     // Position siblings next to each other
  //     if (
  //       memb?.relation === "Brother" ||
  //       memb?.relation === "Sister" ||
  //       memb?.relation === "Son" ||
  //       memb?.relation === "Daughter"
  //     ) {
  //       let siblings = parentMap[memb?.parents?.[0]] || [];
  //       let index = siblings.indexOf(memb.id);
  //       if (index >= 0) {
  //         positions[memb?.id].x += (index + 1) * siblingSpacing;
  //         positions[memb?.id].y = 100;
  //       }
  //     }

  //     // Position spouses side by side
  //     if (
  //       (memb?.relation === "Wife" || memb?.relation === "Husband") &&
  //       positions[memb?.relatedMemberId]
  //     ) {
  //       positions[memb?.id] = {
  //         x: positions[memb?.relatedMemberId]?.x + spouseSpacing,
  //         y: positions[memb?.relatedMemberId]?.y,
  //       };
  //     }
  // if (memb.relation === "Mother" && positions[memb?.relatedMemberId]) {
  //   const hasFather = (id, memId) => {
  //     const father = member
  //       ?.find((p) => p.id === id)
  //       .parents?.filter((p) => p !== memId);
  //     return father;
  //   };
  //   positions[memb?.id] = {
  //     x:
  //       hasFather(memb?.relatedMemberId, memb.id).length > 0
  //         ? positions[hasFather(memb?.relatedMemberId, memb.id)[0]]?.x + 210
  //         : positions[memb?.relatedMemberId]?.x,
  //     y:
  //       hasFather(memb?.relatedMemberId, memb.id).length > 0
  //         ? positions[hasFather(memb?.relatedMemberId, memb.id)[0]]?.y
  //         : positions[memb?.relatedMemberId]?.y - 250,
  //   };
  // }
  //     if (memb?.relation === "Father" && positions[memb?.relatedMemberId]) {
  //       positions[memb?.id] = {
  //         x: positions[memb?.relatedMemberId]?.x,
  //         y: positions[memb?.relatedMemberId]?.y - 250,
  //       };
  //     }
  //   });

  //   return positions;
  // };

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
    if (member?.length > 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    } else {
      setNodes(familyNodes);
      setEdges(familyEdges);
    }
  }, [member]);

  const [nodes, setNodes, onNodesChange] = useNodesState(familyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(familyEdges);

  useEffect(() => {
    member?.forEach((memb) => {
      const { parents } = memb;
      const father = parents?.find((p) => {
        const parent = member.find((m) => m.id === p);
        return parent?.gender === "Male";
      });
      // Get mother second
      const mother = parents?.find((p) => {
        const parent = member?.find((m) => m.id === p);
        return parent?.gender === "Female";
      });

      if (father && mother) {
        console.log("inside if");

        setEdges((prevEdges) => {
          const newEdges = prevEdges.filter((edge) => edge.source !== mother);
          return newEdges;
        });
      }
    });
  }, [member]);

  useEffect(() => {
    member?.forEach((memb) => {
      const { parents, spouse } = memb;
      const father = parents?.find((p) => {
        const parent = member.find((m) => m.id === p);
        return parent?.gender === "Male";
      });
      // Get mother second
      const mother = parents?.find((p) => {
        const parent = member?.find((m) => m.id === p);
        return parent?.gender === "Female";
      });
      let couple = member?.find((m) => m.id === spouse);
      console.log(couple);
      console.log(nodes, "nodes");
    });
  }, [member]);

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
