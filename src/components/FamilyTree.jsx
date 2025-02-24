import { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  applyNodeChanges,
  Background,
  Controls,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
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
  const generateCoupleKey = (id1, id2) => [id1, id2].sort().join("-"); // Generate a unique key for a couple

  const coupleMap = new Map(); // Map to track couples

  member?.forEach((m) => {
    if (m.spouse.length > 0) {
      const coupleKey = generateCoupleKey(m.id, m.spouse);
      coupleMap.set(m.id, coupleKey);
      coupleMap.set(m.spouse, coupleKey);
    }
  });

  const initialEdges = member?.flatMap((memb) => {
    let edges = [];
    const { id, spouse, parents } = memb;
    const memberCoupleKey = (memdId) => {
      return coupleMap?.get(memdId);
    };

    if (parents?.length >= 2) {
      const [parent1, parent2] = parents.sort(); // Sort to maintain consistency
      const coupleKey = `${parent1}-${parent2}`;

      if (!coupleMap.has(parent1) && !coupleMap.has(parent2)) {
        coupleMap.set(parent1, coupleKey);
        coupleMap.set(parent2, coupleKey);
      }
    }

    const father = parents?.find((p) => {
      const parent = member.find((m) => m.id === p);
      return parent?.gender === "Male";
    });
    // Get mother second
    const mother = parents?.find((p) => {
      const parent = member.find((m) => m.id === p);
      return parent?.gender === "Female";
    });

    const isSpouse = (father) =>
      member?.find((m) => m.id === father)?.spouse?.length > 0;

    // Get couple keys if parents are in a couple
    const fatherCoupleKey = father && coupleMap.get(father);
    const motherCoupleKey = mother && coupleMap.get(mother);
    const parentCoupleKey =
      fatherCoupleKey || motherCoupleKey || father || mother;

    if (father && parents?.length >= 0) {
      edges.push({
        id: `edge-${id}-father`,
        source: isSpouse(father) ? parentCoupleKey : father,
        target: memberCoupleKey(memb.id) ?? memb?.id, // If this member is in a couple, use their couple key
        type: "smoothstep",
        sourceHandle: "bottom",
        targetHandle: "top",
      });
      const allChildren = member?.filter((m) => m.parents?.includes(mother));

      allChildren?.forEach((child) => {
        edges.push({
          id: `edge-${child.id}-${id}`,
          source: parentCoupleKey,
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
        source: parentCoupleKey,
        target: memberCoupleKey(memb.id) || memb.id, // If this member is in a couple, use their couple key
        type: "smoothstep",
        sourceHandle: "bottom",
        targetHandle: "top",
      });
    }
    // Handle spouse connection
    if (spouse.length > 0 && id < spouse) {
      edges.push({
        id: `edge-${id}-spouse`,
        source: memb.id,
        target: spouse,
        type: "smoothstep",
        sourceHandle: "right",
        targetHandle: "left",
      });
    }
    return edges;
  });

  const positionNodes = () => {
    let positions = {};
    let siblingSpacing = 450; // Space between siblings
    let generationSpacing = 280; // Space between generations
    let spouseSpacing = 250; // Space between spouses

    let visited = new Set();

    member?.forEach((memb) => {
      if (visited.has(memb.id)) return;

      let parentX = 0;
      let parentY = 0;

      // Place root members at (0,100)
      if (!memb?.relatedMemberId) {
        positions[memb.id] = { x: 0, y: 300 };
      }

      // Position Fathers
      if (memb?.relation === "Father" && positions[memb?.relatedMemberId]) {
        positions[memb.id] = {
          x: positions[memb.relatedMemberId].x,
          y: positions[memb.relatedMemberId].y - generationSpacing,
        };
        visited.add(memb.id);
      }

      // Position Mothers next to Fathers
      if (memb.relation === "Mother" && positions[memb.relatedMemberId]) {
        positions[memb.id] = {
          x: positions[memb.relatedMemberId].x,
          y: positions[memb.relatedMemberId].y - generationSpacing,
        };
        visited.add(memb.id);
      }

      // Position Spouses next to each other
      if (
        (memb.relation === "Wife" || memb.relation === "Husband") &&
        positions[memb.relatedMemberId]
      ) {
        positions[memb.id] = {
          x: positions[memb.relatedMemberId].x + spouseSpacing,
          y: positions[memb.relatedMemberId].y,
        };
        visited.add(memb.id);
      }

      // Position Children below Parents
      if (
        (memb.relation === "Son" || memb.relation === "Daughter") &&
        positions[memb.relatedMemberId]
      ) {
        parentX = positions[memb.relatedMemberId].x;
        parentY = positions[memb.relatedMemberId].y;

        // Get siblings count
        let siblings = member?.filter(
          (sibling) =>
            sibling.relatedMemberId === memb.relatedMemberId &&
            (sibling.relation === "Son" || sibling.relation === "Daughter")
        );

        let index = siblings.findIndex((s) => s.id === memb.id);

        // Space out siblings evenly
        positions[memb.id] = {
          x: parentX + (index - siblings.length / 2) * siblingSpacing,
          y: parentY + generationSpacing,
        };
        visited.add(memb.id);
      }

      // Position Brothers & Sisters next to each other
      if (
        (memb.relation === "Brother" || memb.relation === "Sister") &&
        positions[memb.relatedMemberId]
      ) {
        parentX = positions[memb.relatedMemberId].x;
        parentY = positions[memb.relatedMemberId].y;

        let siblings = member?.filter(
          (s) =>
            s.relatedMemberId === memb.relatedMemberId &&
            (s.relation === "Brother" || s.relation === "Sister")
        );

        let index = siblings.findIndex((s) => s.id === memb.id);

        positions[memb.id] = {
          x: parentX + (index - siblings.length / 2) * siblingSpacing,
          y: parentY,
        };
        visited.add(memb.id);
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
    if (member?.length > 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    } else {
      setNodes(familyNodes);
      setEdges(familyEdges);
    }
  }, [member]);

  useEffect(() => {
    const coupleSet = new Set(); // To track created couple nodes

    member?.forEach((mem) => {
      const { spouse } = mem;
      if (spouse?.length > 0) {
        const spouseId = spouse; // Assuming only one spouse
        const memberId = mem?.id;

        // Ensure the couple node is created only once
        const coupleKey = [memberId, spouseId]?.sort()?.join("-");
        if (coupleSet?.has(coupleKey)) return; // Skip duplicate creation
        coupleSet?.add(coupleKey);
        const spouseMember = member?.find((m) => m?.id === spouseId);
        if (!spouseMember) return;

        // Create couple node
        const coupleNode = {
          id: coupleKey,
          type: "default",
          data: null,
          position: {
            x: nodePositions[memberId]?.x - 60 || 0,
            y: nodePositions[memberId]?.y - 50 || 0,
          },
          style: {
            width: 480,
            height: 240,
            backgroundColor: "rgba(240,240,240,0.20)",
            borderColor: "oklch(0.627 0.265 303.9)",
          },
        };

        const coupleNodes = nodes
          ?.filter(
            (node) => node?.id === memberId || node?.id === spouseMember?.id
          )
          ?.map((node) => ({
            ...node,
            parentId: coupleKey,
            extent: "parent",
            position: {
              x: node.position.x + 20,
              y: node.position.y + 200,
            },
          }));
        setNodes((prevNodes) => [...prevNodes, coupleNode, ...coupleNodes]);
        setEdges((prevEdges) =>
          prevEdges.filter((edge) => {
            return !(
              edge.source === memberId ||
              edge.source === spouseId ||
              edge.target === memberId ||
              edge.target === spouseId
            );
          })
        );
      }
    });
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
        setEdges((prevEdges) => {
          const newEdges = prevEdges.filter((edge) => edge.source !== mother);
          return newEdges;
        });
      }
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
