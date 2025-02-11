import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

const AddMember = ({
  formData,
  setFormData,
  selectedMember,
  setSelectedMember,
  member,
  setMember,
  setIsAddMemberVisible,
}) => {
  const relationOptions = [
    "Father",
    "Mother",
    "Husband",
    "Wife",
    "Brother",
    "Sister",
  ];

  const addMember = () => {
    const newMember = { id: uuidv4(), ...formData };

    setMember([...member, newMember]);
    setFormData({
      name: "",
      dob: "",
      gender: "",
      relation: "",
      relatedMemberId: "",
    });
    setIsAddMemberVisible(false);
  };

  const editMember = (id) => {
    const updatedMembers = member.map((member) =>
      member.id === id ? { ...member, ...formData } : member
    );
    setMember(updatedMembers);
    setSelectedMember(null);
    setFormData({
      name: "",
      dob: "",
      gender: "",
      relation: "",
      relatedMemberId: "",
    });
    setIsAddMemberVisible(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    selectedMember ? editMember(selectedMember.id) : addMember();
    setIsAddMemberVisible(false);
  };

  return (
    <div className="bg-purple-300 rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 ">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="outline rounded-lg p-2"
          required
        />
        <input
          type="date"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          className="outline rounded-lg p-2"
          required
        />
        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="outline p-2 rounded-lg"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          value={formData.relation}
          onChange={(e) =>
            setFormData({ ...formData, relation: e.target.value })
          }
          className="border p-2"
        >
          <option value="">Select Relation</option>
          {relationOptions.map((relation) => (
            <option key={relation} value={relation}>
              {relation}
            </option>
          ))}
        </select>
        {formData.relation && (
          <select
            value={formData.relatedMemberId}
            onChange={(e) =>
              setFormData({ ...formData, relatedMemberId: e.target.value })
            }
            className="border p-2"
            required
          >
            <option value="">Select Related Member</option>
            {member.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        )}

        {/* <select
          value={formData.parentId}
          onChange={(e) =>
            setFormData({ ...formData, parentId: e.target.value })
          }
          className="outline p-2 rounded-lg"
        >
          <option value="">Select Parent</option>
          {member.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
        <select
            value={formData.coupleId}
            onChange={(e) => setFormData({ ...formData, coupleId: e.target.value })}
            className="outline p-2 rounded-lg"
          >
            <option value="">Select Spouse</option>
            {member.filter(member => (formData.gender === "Male" ? member.gender === "Female" : member.gender === "Male")).map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select> */}

        <button
          type="submit"
          className="bg-green-500 text-black px-4 py-2 rounded-lg"
        >
          {selectedMember ? "Update" : "Add"}
        </button>
      </form>
    </div>
  );
};

AddMember.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string,
    dob: PropTypes.string,
    gender: PropTypes.string,
    parentId: PropTypes.string,
  }),
  setFormData: PropTypes.func,
  selectedMember: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    dob: PropTypes.string,
    gender: PropTypes.string,
  }),
  setSelectedMember: PropTypes.func,
  member: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      dob: PropTypes.string,
      gender: PropTypes.string,
    })
  ),
  setMember: PropTypes.func,
};

export default AddMember;
