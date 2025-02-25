import { useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import NodeComponent from "./CustomNode";
import { familyEdges, familyNodes, rootMember } from "./Data/dummyData";
import { layoutFromMap } from "entitree-flex";

const FamilyTreeNode = ({
  member,
  setMember,
  setSelectedMember,
  setFormData,
  setIsAddMemberVisible,
}) => {
  const generateCoupleKey = (id1, id2) => [id1, id2]?.sort()?.join("-"); // Generate a unique key for a couple

  const coupleMap = new Map(); // Map to track couples

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

  const entitreeSettings = {
    clone: false, // returns a copy of the input, if your application does not allow editing the original object
    enableFlex: false, // has slightly better perfomance if turned off (node.width, node.height will not be read)
    firstDegreeSpacing: 180, // spacing in px between nodes belonging to the same source, eg children with same parent
    nextAfterAccessor: "spouses", // the side node prop used to go sideways, AFTER the current node
    nextAfterSpacing: 180, // the spacing of the "side" nodes AFTER the current node
    nextBeforeAccessor: "siblings", // the side node prop used to go sideways, BEFORE the current node
    nextBeforeSpacing: 430, // the spacing of the "side" nodes BEFORE the current node
    nodeHeight: 40, // default node height in px
    nodeWidth: 40, // default node width in px
    orientation: "vertical", // "vertical" to see parents top and children bottom, "horizontal" to see parents left and
    rootX: 0, // set root position if other than 0
    rootY: 0, // set root position if other than 0
    secondDegreeSpacing: 10, // spacing in px between nodes not belonging to same parent eg "cousin" nodes
    sourcesAccessor: "parents", // the prop used as the array of ancestors ids
    sourceTargetSpacing: 250, // the "vertical" spacing between nodes in vertical orientation, horizontal otherwise
    targetsAccessor: "children", // the prop used as the array of children ids
  };
  // const transformMembers = (members) => {

  //   return members?.reduce((acc, member) => {
  //     acc[member?.id] = {
  //       ...member,
  //       spouses: member?.spouse?.length > 0 ? [member?.spouse] : [], // Ensure spouse array exists
  //       isSpouse: member?.spouse?.length > 0,
  //       // siblings: member?.siblings?.length > 0 ? member?.siblings : [], // Ensure siblings array exists
  //       type: "custom",
  //     };
  //     delete acc[member?.id].spouse; // Remove original "spouse" key

  //     return acc;
  //   }, {});
  // };

  // const formatedData =
  //   member.length > 0 ? transformMembers(member) : rootMember;
  // console.log("entitreeNode", formatedData);

  // const { nodes: entitreeNode } = layoutFromMap(
  //   member[0]?.id,
  //   formatedData,
  //   entitreeSettings
  // );

  // const uniqueNodes = [...new Set(entitreeNode.map((node) => node))];
  const transformMembers = () => {
    return member?.reduce((acc, member) => {
      acc[member?.id] = {
        ...member,
        spouses: member?.spouse?.length > 0 ? [member?.spouse] : [], // Store spouse as array
        isSpouse: Boolean(member?.spouse?.length > 0),
        type: "custom",
      };

      // Ensure floating members are connected
      if (!member.spouse && !member.parent) {
        acc[member.id].parent = "Self";
        acc["Self"] = { id: "Self", name: "Root Node", type: "custom" };
      }

      delete acc[member?.id].spouse; // Remove original spouse key
      return acc;
    }, {});
  };

  const formatedData =
    member.length > 0 ? transformMembers() : rootMember;
  const rootId = member.find((m) => m.relation === "Self")?.id;
  const { nodes: entitreeNode } = layoutFromMap(rootId, formatedData, {
    ...entitreeSettings,
  });


  const initialNodes = entitreeNode?.map((member) => ({
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
  }));

  // useEffect(() => {
  //   if (member?.length > 0) {
  //     setNodes(initialNodes);
  //     setEdges(initialEdges);
  //   } else {
  //     setNodes(familyNodes);
  //     setEdges(familyEdges);
  //   }
  // }, [member]);

  // useEffect(() => {
  //   const coupleSet = new Set();
  //   member?.forEach((mem) => {
  //     const { spouse } = mem;
  //     if (spouse?.length > 0) {
  //       const spouseId = spouse;
  //       const memberId = mem?.id;

  //       // Ensure the couple node is created only once
  //       const coupleKey = [memberId, spouseId]?.sort()?.join("-");
  //       if (coupleSet?.has(coupleKey)) return;
  //       coupleSet?.add(coupleKey);
  //       const spouseMember = member?.find((m) => m?.id === spouseId);
  //       if (!spouseMember) return;

  //       const nodePosition = entitreeNode?.find(
  //         (node) => node?.id === memberId
  //       );

  //       const coupleNode = {
  //         id: coupleKey,
  //         type: "default",
  //         data: null,
  //         position: {
  //           x: nodePosition?.x || 0,
  //           y: nodePosition?.y || 0,
  //         },
  //         style: {
  //           width: 450,
  //           height: 200,
  //           backgroundColor: "rgba(240,240,240,0.20)",
  //           borderColor: "oklch(0.627 0.265 303.9)",
  //         },
  //       };
  //       const coupleNodes = nodes
  //         ?.filter(
  //           (node) => node?.id === memberId || node?.id === spouseMember?.id
  //         )
  //         ?.map((node, index) => {
  //           const existingNode = entitreeNode.find((n) => n.id === node.id);
  //           return {
  //             ...node,
  //             parentId: coupleKey,
  //             extent: "parent",
  //             position: {
  //               x: existingNode.x + 110, // Use existing x position
  //               y: existingNode.y + 250, // Use existing y position
  //             },
  //           };
  //         });
  //       console.log(coupleNodes);

  //       setNodes((prevNodes) => [...prevNodes, coupleNode, ...coupleNodes]);
  //       setEdges((prevEdges) =>
  //         prevEdges.filter((edge) => {
  //           return !(
  //             edge?.source === memberId ||
  //             edge?.source === spouseId ||
  //             edge?.target === memberId ||
  //             edge?.target === spouseId
  //           );
  //         })
  //       );
  //     }
  //   });
  // }, [member]);

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
                  draggable: true, // Allow individual nodes to move
                  selectable: true,
                  position: {
                    x: index % 2 == 0 ? 10 : index % 2 != 0 && 250, // Position members inside the couple box
                    y: 5, // Keep them inside the box
                  },
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
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default FamilyTreeNode;
