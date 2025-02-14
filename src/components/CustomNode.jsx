import { Handle, Position } from "reactflow";
import { MdEditSquare, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const { Top, Bottom, Left, Right } = Position;

const NodeComponent = ({ data }) => {
  // const hasChildren =
  //   (data?.member?.children?.length > 0 && data.member.relation === "Father") ||
  //   data.member.relation === "Self";
  const hasChildren =
    data?.member?.children?.length > 0 &&
    (data.member.relation === "Father" || data.member.relation === "Self") &&
    !(
      data?.member?.children?.length === 1 &&
      data?.member?.children[0] === data?.member?.id
    );

  const handleDeleteMember = (id) => {
    !hasChildren
      ? Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            data.setMember((prevMembers) =>
              prevMembers.filter((m) => m.id !== id)
            );
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        })
      : Swal.fire({
          title: "Error!",
          text: "You can't delete this member because they have children.",
          icon: "error",
        });
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
    <div className="py-3 px-5 bg-purple-100 border rounded shadow-lg flex flex-col items-start gap-4 h-auto w-auto">
      <p className="text-lg font-bold">
        Name : <span className="text-lg font-medium"> {data.label} </span>
      </p>
      <p className="text-lg font-bold">
        Gender : <span className="text-lg font-medium"> {data.gender} </span>
      </p>
      <p className="text-lg font-bold">
        Born : <span className="text-lg font-medium"> {data.dob} </span>
      </p>
      <div className="flex gap-2 ">
        <MdEditSquare
          className="w-7 h-7 cursor-pointer"
          onClick={() => handleEditMember(data.id)}
        />
        <MdDelete
          className="w-7 h-7 cursor-pointer"
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
