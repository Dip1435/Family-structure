import { Handle, Position } from "reactflow";
import { MdEditSquare, MdDelete } from "react-icons/md";

const { Top, Bottom, Left, Right } = Position;

const NodeComponent = ({ data }) => {
  const handleDeleteMember = (id) => {
    data.setMember((prevMembers) => prevMembers.filter((m) => m.id !== id));
  };

  const handleEditMember = () => {
    data.setSelectedMember(data.member);
    data.setFormData(data.member);
    data.setIsAddMemberVisible(true);
  };

  const allMembers = JSON.parse(localStorage.getItem("familyMembers")) || [];
  const marriedMembers = allMembers
    .filter((m) => m.spouse.length > 0)
    .map((m) => m.id);

  const parents = allMembers
    .filter((m) => m.children.length > 0)
    .map((m) => m.id);

  return (
    <div className="py-3 px-5 bg-white border rounded shadow-lg flex flex-col items-start gap-4 h-auto w-auto">
      <div className="flex items-center gap-2">
        <div className="w-10 rounded-full flex items-center justify-start">
          👤
        </div>
        <p className="text-lg font-bold -ms-4">
          Name : <span className="text-lg font-medium"> {data.label} </span>
        </p>
      </div>
      <p className="text-lg font-bold">
        Gender : <span className="text-lg font-medium"> {data.gender} </span>
      </p>
      <p className="text-lg font-bold">
        Born : <span className="text-lg font-medium"> {data.dob} </span>
      </p>
      <div className="flex gap-2 ">
        <MdEditSquare
          className="w-6 h-6 cursor-pointer"
          onClick={() => handleEditMember(data.id)}
        />
        <MdDelete
          className="w-6 h-6 cursor-pointer"
          onClick={() => handleDeleteMember(data.id)}
        />
      </div>

      {marriedMembers.includes(data.member.id) && (
        <>
          <Handle type="source" position={Right} id="right" />
          <Handle type="target" position={Left} id="left" />
        </>
      )}
      {parents.includes(data.member.id) && (
        <>
          <Handle type="source" position={Bottom} id="bottom" />
          <Handle type="target" position={Top} id="top" />
        </>
      )}
    </div>
  );
};
export default NodeComponent;
