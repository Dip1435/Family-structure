const allMembers = JSON.parse(localStorage.getItem("familyMembers")) || [];
export const findFather = (id) => {
    let person = allMembers?.find((p) => p.id === id);

    if (
      !person ||
      person.relation === "Son" ||
      person.relation === "Daughter"
    ) {
      return person?.relatedMemberId;
    } else if (person.relation === "Self") {
      return person.id;
    }
    return findFather(person.relatedMemberId);
  };

  