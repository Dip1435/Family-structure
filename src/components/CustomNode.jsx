import { Handle } from "reactflow";
import { MdEditSquare } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const NodeComponent = ({ data }) => {
  const handleDeleteMember = (id) => {
    data.setMember((prevMembers) => {
      return prevMembers.filter((member) => member.id !== id);
    });
  };
  const handleEditMember = (id) => {
    data.setSelectedMember(data.member);
    data.setFormData(data.member);
    data.setIsAddMemberVisible(true);
  };

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
          className="w-6 h-6"
          onClick={() => handleEditMember(data.id)}
        />
        <MdDelete
          className="w-6 h-6 cursor-pointer"
          onClick={() => handleDeleteMember(data.id)}
        />
      </div>
      <Handle type="source" position="bottom" />
      <Handle type="target" position="top" />
    </div>
  );
};

export default NodeComponent;
