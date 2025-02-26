import { useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  useEdgesState,
  useNodesState,
} from "reactflow";
import NodeComponent from "../custom/CustomNode";
import { entitreeSettings, familyEdges, familyNodes } from "../Data/dummyData";
import { layoutFromMap } from "entitree-flex";

const FamilyTreeNode = ({
  member,
  setMember,
  setSelectedMember,
  setFormData,
  setIsAddMemberVisible,
}) => {
  const generateCoupleKey = (id1, id2) => [id1, id2]?.sort()?.join("-"); // Generate a unique key for a couple

  const coupleMap = new Map();

  member?.forEach((m) => {
    if (m?.spouse?.length > 0) {
      const coupleKey = generateCoupleKey(m?.id, m?.spouse);
      coupleMap?.set(m?.id, coupleKey);
      coupleMap?.set(m?.spouse, coupleKey);
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

      if (!coupleMap?.has(parent1) && !coupleMap?.has(parent2)) {
        coupleMap?.set(parent1, coupleKey);
        coupleMap?.set(parent2, coupleKey);
      }
    }

    const father = parents?.find((p) => {
      const parent = member?.find((m) => m?.id === p);
      return parent?.gender === "Male";
    });
    // Get mother second
    const mother = parents?.find((p) => {
      const parent = member?.find((m) => m?.id === p);
      return parent?.gender === "Female";
    });

    const isSpouse = (father) =>
      member?.find((m) => m?.id === father)?.spouse?.length > 0;

    // Get couple keys if parents are in a couple
    const fatherCoupleKey = father && coupleMap?.get(father);
    const motherCoupleKey = mother && coupleMap?.get(mother);
    const parentCoupleKey =
      fatherCoupleKey || motherCoupleKey || father || mother;

    if (father && parents?.length >= 0) {
      edges.push({
        id: `edge-${id}-father`,
        source: isSpouse(father) ? parentCoupleKey : father,
        target: memberCoupleKey(memb?.id) ?? memb?.id, // If this member is in a couple, use their couple key
        type: "smoothstep",
        sourceHandle: "bottom",
        targetHandle: "top",
      });
      const allChildren = member?.filter((m) => m.parents?.includes(mother));

      allChildren?.forEach((child) => {
        edges.push({
          id: `edge-${child?.id}-${id}`,
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
        target: memberCoupleKey(memb?.id) || memb?.id, // If this member is in a couple, use their couple key
        type: "smoothstep",
        sourceHandle: "bottom",
        targetHandle: "top",
      });
    }
    // Handle spouse connection
    if (spouse?.length > 0 && id < spouse) {
      edges.push({
        id: `edge-${id}-spouse`,
        source: memb?.id,
        target: spouse,
        type: "smoothstep",
        sourceHandle: "right",
        targetHandle: "left",
      });
    }
    return edges;
  });

 
  const transformMembers = () => {
    return member?.reduce((acc, member) => {
      acc[member?.id] = {
        ...member,
        spouses: member?.spouse?.length > 0 ? [member?.spouse] : [], // Store spouse as array
        isSpouse: Boolean(member?.spouse?.length > 0),
        children: member?.children ?? [],
        parents: member?.parents ?? [],
        type: "custom",
      };

      delete acc[member?.id].spouse; // Remove original spouse key
      return acc;
    }, {});
  };

  const formatedData = transformMembers(); // Transform member data for Entitree
  const rootId = member?.find((m) => m?.isRoot)?.id; // Find the root node

  const { nodes: entitreeNode } = layoutFromMap(rootId, formatedData, {
    ...entitreeSettings,
  });
  const uniqueNodes = [...new Set(entitreeNode.map((node) => node))];

  const initialNodes = uniqueNodes?.map((member) => ({
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
    position: { x: member?.x || 0, y: member?.y || 0 },
    draggable: false,
  }));

  useEffect(() => {
    if (member?.length > 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    } else {
      setNodes(familyNodes);
      setEdges(familyEdges);
    }

    setTimeout(() => {
      setNodes((prevNodes) => {
        const coupleSet = new Set();
        const updatedNodes = [...prevNodes];

        member?.forEach((mem) => {
          const { spouse } = mem;
          if (spouse?.length > 0) {
            const spouseId = spouse;
            const memberId = mem?.id;
            const coupleKey = [memberId, spouseId]?.sort()?.join("-");

            if (coupleSet?.has(coupleKey)) return;
            coupleSet?.add(coupleKey);

            const spouseMember = member?.find((m) => m?.id === spouseId);
            if (!spouseMember) return;

            const nodePosition = entitreeNode?.find(
              (node) => node?.id === memberId
            );
            const coupleNode = {
              id: coupleKey,
              type: "default",
              data: null,
              draggable: false,
              position: {
                x: nodePosition?.x || 0,
                y: nodePosition?.y || 0,
              },
              style: {
                width: 450,
                height: 200,
                backgroundColor: "rgba(240,240,240,0.20)",
                borderColor: "oklch(0.627 0.265 303.9)",
              },
            };

            const coupleNodes = updatedNodes
              ?.filter(
                (node) => node?.id === memberId || node?.id === spouseMember?.id
              )
              ?.map((node, index) => {
                return {
                  ...node,
                  parentId: coupleKey,
                  extent: "parent",
                  draggable: true,
                  selectable: true,
                  position: {
                    x: index % 2 == 0 ? 10 : index % 2 != 0 && 250,
                    y: 5,
                  },
                  selected: true,
                };
              });

            updatedNodes.push(coupleNode, ...coupleNodes);
            setEdges((prevEdges) =>
              prevEdges.filter((edge) => {
                return !(
                  edge?.source === memberId ||
                  edge?.source === spouseId ||
                  edge?.target === memberId ||
                  edge?.target === spouseId
                );
              })
            );
          }
        });
        return updatedNodes;
      });
    }, 0);
  }, [member]);

  const [nodes, setNodes, onNodesChange] = useNodesState(familyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(familyEdges);

  useEffect(() => {
    member?.forEach((memb) => {
      const { parents } = memb;
      const father = parents?.find((p) => {
        const parent = member.find((m) => m?.id === p);
        return parent?.gender === "Male";
      });
      // Get mother second
      const mother = parents?.find((p) => {
        const parent = member?.find((m) => m?.id === p);
        return parent?.gender === "Female";
      });

      if (father && mother) {
        setEdges((prevEdges) => {
          const newEdges = prevEdges?.filter((edge) => edge?.source !== mother);
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
