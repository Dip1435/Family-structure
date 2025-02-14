// const allMembers = JSON.parse(localStorage.getItem("familyMembers")) || [];
export const findFather = (id, member) => {
  let person = member?.find((p) => p.id === id);

  if (!person || person.relation === "Son" || person.relation === "Daughter") {
    return person?.relatedMemberId;
  } else if (person.relation === "Self") {
    return person.id;
  }
  return findFather(person.relatedMemberId);
};

export const isFather = (id, member) => {
  return (
    member?.find((p) => p.id === id)?.relation === "Father" ||
    member?.find((p) => p.id === id)?.relation === "Self" ||
    member?.find((p) => p.id === id)?.relation === "Son" ||
    member?.find((p) => p.id === id)?.relation === "Brother" ||
    member?.find((p) => p.id === id)?.relation === "Husband" ||
    member?.find((p) => p.id === id)?.relation === "Wife" ||
    member?.find((p) => p.id === id)?.relation === "Daughter" ||
    member?.find((p) => p.id === id)?.relation === "Sister"
  );
};
export const isWife = (id, member) => {
  return (
    member?.find((p) => p.id === id)?.relation === "Wife" ||
    member?.find((p) => p.id === id)?.relation === "Daughter" ||
    member?.find((p) => p.id === id)?.relation === "Sister"
  );
};
export const findWife = (id, member) => {
  let wife = member?.find((p) => p.id === id);
  return wife.spouse[0]
};
