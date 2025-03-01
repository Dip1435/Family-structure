export const familyNodes = [
  {
    id: "couple-1",
    position: { x: -270, y: -50 },
    type: "default",
    data: null,
    style: {
      height: 240,
      width: 500,
      TextDecoderStream: {
        text: "Haribhai & Jamnaben",
        fontSize: 20,
        fontWeight: "bold",
      },
    },
  },
  {
    id: "Haribhai",
    type: "custom",
    position: { x: 40, y: 30 },
    data: {
      label: "Haribhai",
      id: "Haribhai",
      gender: "Male",
      dob: "1940-01-01",
    },
    children: ["Manubhai"],
    spouse: ["Jamnaben"],
    parentId: "couple-1",
    extent: "parent",
  },
  {
    id: "Jamnaben",
    type: "custom",
    position: { x: 270, y: 30 },
    data: {
      label: "Jamnaben",
      id: "Jamnaben",
      gender: "Female",
      dob: "1940-01-01",
    },
    spouse: ["Haribhai"],
    children: ["Manubhai"],
    parentId: "couple-1",
    extent: "parent",
  },
  {
    id: "couple-2",
    position: { x: 250, y: 350 },
    type: "default",
    data: null,
    style: {
      height: 250,
      width: 500,
    },
  },
  {
    id: "Manubhai",
    type: "custom",
    position: { x: 40, y: 30 },
    data: {
      label: "Manubhai",
      id: "Manubhai",
      gender: "Male",
      dob: "1960-01-01",
    },
    spouse: ["Chetanaben"],
    children: ["Dip", "Khushi"],
    parentId: "couple-2",
    extent: "parent",
  },
  {
    id: "Chetanaben",
    type: "custom",
    position: { x: 250, y: 30 },
    data: {
      label: "Chetanaben",
      id: "Chetanaben",
      gender: "Female",
      dob: "1960-01-01",
    },
    spouse: ["Manubhai"],
    children: ["Dip", "Khushi"],
    parentId: "couple-2",
    extent: "parent",
  },
  {
    id: "couple-3",
    position: { x: -270, y: 350 },
    type: "default",
    data: null,
    style: {
      height: 250,
      width: 500,
    },
  },
  {
    id: "Kanubhai",
    type: "custom",
    position: { x: 40, y: 30 },
    data: {
      label: "Kanubhai",
      id: "Kanubhai",
      gender: "Male",
      dob: "1950-01-01",
    },
    spouse: ["Keshaben"],
    parentId: "couple-3",
    extent: "parent",
  },
  {
    id: "Keshaben",
    type: "custom",
    position: { x: 250, y: 30 },
    data: {
      label: "Keshaben",
      id: "Keshaben",
      gender: "Female",
      dob: "1960-01-01",
    },
    spouse: ["Kanubhai"],
    children: ["Jagruti"],
    parentId: "couple-3",
    extent: "parent",
  },
  {
    id: "couple-4",
    position: { x: -790, y: 350 },
    type: "default",
    data: null,
    style: {
      height: 250,
      width: 500,
    },
  },
  {
    id: "Gagabhai",
    type: "custom",
    position: { x: 40, y: 40 },
    data: {
      label: "Gagabhai",
      id: "Gagabhai",
      gender: "Male",
      dob: "1950-01-01",
    },
    spouse: ["Krishnaben"],
    children: ["Jagruti"],
    parentId: "couple-4",
    extent: "parent",
  },
  {
    id: "Krishnaben",
    type: "custom",
    position: { x: 260, y: 40 },
    data: {
      label: "Krishnaben",
      id: "Krishnaben",
      gender: "Female",
      dob: "1960-01-01",
    },
    spouse: ["Gagabhai"],
    children: ["Jagruti"],
    parentId: "couple-4",
    extent: "parent",
  },
  {
    id: "couple-5",
    position: { x: -790, y: 650 },
    type: "default",
    data: null,
    style: {
      height: 250,
      width: 500,
    },
  },
  {
    id: "Jagruti",
    type: "custom",
    position: { x: 260, y: 30 },
    data: {
      label: "Jagruti",
      id: "Jagruti",
      gender: "Female",
      dob: "1960-01-01",
    },
    spouse: ["Mihir"],
    children: ["Abhyant"],
    parentId: "couple-5",
    extent: "parent",
  },
  {
    id: "Mihir",
    type: "custom",
    position: { x: 40, y: 30 },
    data: {
      label: "Mihir",
      id: "Mihir",
      gender: "Male",
      dob: "1960-01-01",
    },
    spouse: ["Jagruti"],
    children: ["Abhyant"],
    parentId: "couple-5",
    extent: "parent",
  },
  {
    id: "Abhyant",
    type: "custom",
    position: { x: -634, y: 950 },
    data: {
      label: "Abhyant",
      id: "Abhyant",
      gender: "Male",
      dob: "1960-01-01",
    },
  },
  {
    id: "Dip",
    type: "custom",
    position: { x: 300, y: 670 },
    data: { label: "Dip", id: "Dip", gender: "Male", dob: "1980-01-01" },
  },
  {
    id: "Khushi",
    type: "custom",
    position: { x: 520, y: 670 },
    data: {
      label: "Khushi",
      id: "Khushi",
      gender: "Female",
      dob: "1980-01-01",
    },
  },
];

export const familyEdges = [
  {
    id: "e-Haribhai-Jamnaben",
    source: "Haribhai",
    sourceHandle: "right",
    target: "Jamnaben",
    targetHandle: "left",
    type: "smoothstep",
  },
  {
    id: "e-couple-1-Manubhai",
    source: "couple-1",
    sourceHandle: "bottom",
    target: "couple-2",
    targetHandle: "top",
    type: "smoothstep",
  },
  // {
  //   id: "e-Haribhai-Manubhai",
  //   source: "Haribhai",
  //   sourceHandle: "bottom",
  //   target: "Manubhai",
  //   targetHandle: "top",
  //   type: "smoothstep",
  // },
  {
    id: "e-couple-1-Kanubhai",
    source: "couple-1",
    sourceHandle: "bottom",
    target: "couple-3",
    targetHandle: "top",
    type: "smoothstep",
  },
  {
    id: "e-couple-1-Gagabhai",
    source: "couple-1",
    sourceHandle: "bottom",
    target: "couple-4",
    targetHandle: "top",
    type: "smoothstep",
  },
  {
    id: "e-Kanubhai-Keshaben",
    source: "Kanubhai",
    sourceHandle: "right",
    target: "Keshaben",
    targetHandle: "left",
    type: "smoothstep",
  },
  {
    id: "e-Gagabhai-Krishnaben",
    source: "Gagabhai",
    sourceHandle: "right",
    target: "Krishnaben",
    targetHandle: "left",
    type: "smoothstep",
  },
  {
    id: "e-couple-4-Mihir",
    source: "couple-4",
    sourceHandle: "bottom",
    target: "couple-5",
    targetHandle: "top",
    type: "smoothstep",
  },
  {
    id: "e-Mihir-Jagruti",
    source: "Mihir",
    sourceHandle: "right",
    target: "Jagruti",
    targetHandle: "left",
    type: "smoothstep",
  },
  {
    id: "e-couple-5-Abhyant",
    source: "couple-5",
    sourceHandle: "bottom",
    target: "Abhyant",
    targetHandle: "top",
    type: "smoothstep",
  },
  {
    id: "e-Manubhai-Chetanaben",
    source: "Manubhai",
    sourceHandle: "right",
    target: "Chetanaben",
    targetHandle: "left",
    type: "smoothstep",
  },
  {
    id: "e-couple-2-Dip",
    source: "couple-2",
    sourceHandle: "bottom",
    target: "Dip",
    targetHandle: "top",
    type: "smoothstep",
  },
  {
    id: "e-couple-2-Khushi",
    source: "couple-2",
    sourceHandle: "bottom",
    target: "Khushi",
    targetHandle: "top",
    type: "smoothstep",
  },
];

export  const entitreeSettings = {
  clone: false, // returns a copy of the input, if your application does not allow editing the original object
  enableFlex: false, // has slightly better perfomance if turned off (node.width, node.height will not be read)
  firstDegreeSpacing: 10, // spacing in px between nodes belonging to the same source, eg children with same parent
  nextAfterAccessor: "spouses", // the side node prop used to go sideways, AFTER the current node
  nextAfterSpacing: 10, // the spacing of the "side" nodes AFTER the current node
  nextBeforeAccessor: "siblings", // the side node prop used to go sideways, BEFORE the current node
  nextBeforeSpacing: 380, // the spacing of the "side" nodes BEFORE the current node
  nodeHeight: 40, // default node height in px
  nodeWidth: 40, // default node width in px
  orientation: "vertical", // "vertical" to see parents top and children bottom, "horizontal" to see parents left and
  rootX: -100, // set root position if other than 0
  rootY: 300, // set root position if other than 0
  secondDegreeSpacing: 10, // spacing in px between nodes not belonging to same parent eg "cousin" nodes
  sourcesAccessor: "parents", // the prop used as the array of ancestors ids
  sourceTargetSpacing: 250, // the "vertical" spacing between nodes in vertical orientation, horizontal otherwise
  targetsAccessor: "children", // the prop used as the array of children ids
};
