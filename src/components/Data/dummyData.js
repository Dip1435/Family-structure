export const familyNodes = [
  {
    id: "Haribhai",
    type: "custom",
    position: { x: 300, y: 300 },
    data: {
      label: "Haribhai",
      id: "Haribhai",
      gender: "Male",
      dob: "1940-01-01",
    },
    children: ["Manubhai"],
    spouse: ["Jamnaben"],
  },
  {
    id: "Jamnaben",
    type: "custom",
    position: { x: 550, y: 300 },
    data: {
      label: "Jamnaben",
      id: "Jamnaben",
      gender: "Female",
      dob: "1940-01-01",
    },
    spouse: ["Haribhai"],
    children: ["Manubhai"],
  },
  {
    id: "Manubhai",
    type: "custom",
    position: { x: 300, y: 550 },
    data: {
      label: "Manubhai",
      id: "Manubhai",
      gender: "Male",
      dob: "1960-01-01",
    },
    spouse: ["Chetanaben"],
    children: ["Dip", "Khushi"],
  },
  {
    id: "Chetanaben",
    type: "custom",
    position: { x: 550, y: 550 },
    data: {
      label: "Chetanaben",
      id: "Chetanaben",
      gender: "Female",
      dob: "1960-01-01",
    },
    spouse: ["Manubhai"],
    children: ["Dip", "Khushi"],
  },
  {
    id: "Dip",
    type: "custom",
    position: { x: 300, y: 800 },
    data: { label: "Dip", id: "Dip", gender: "Male", dob: "1980-01-01" },
  },
  {
    id: "Khushi",
    type: "custom",
    position: { x: 550, y: 800 },
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
