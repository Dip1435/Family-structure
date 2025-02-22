import { Handle } from "reactflow";
import { MdEditSquare, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const NodeComponent = ({ data }) => {
  const hasChildren =
    data?.member?.children?.length > 0 &&
    (data.member.relation === "Father" || data.member.relation === "Self") &&
    !(
      data?.member?.children?.length === 1 &&
      data?.member?.children[0] === data?.member?.id
    );
  const handleDeleteMember = (id) => {
    let familyMembers = JSON.parse(localStorage.getItem("familyMembers"));
    // const memberToDelete = data.member.id === id;
    // if (!memberToDelete) return;
    // familyMembers = familyMembers.map((member) => {
    //   return {
    //     ...member,
    //     parents: member.parents?.filter((parentId) => parentId !== id),
    //     spouse: member.spouse === id ? null : member.spouse,
    //     children: member.children?.filter((childId) => childId !== id), // Remove from children array
    //   };
    // });

    // familyMembers = familyMembers.filter((member) => member.id !== id);
    // localStorage.setItem("familyMembers", JSON.stringify(familyMembers));

    let updatedMembers = [...familyMembers];

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updatedMembers = updatedMembers.map((m) => {
          return {
            ...m,
            spouse: m.spouse === id ? null : m.spouse, // Remove spouse
            children: m.children?.filter((childId) => childId !== id), // Remove from children
            parents: m.parents?.filter((parentId) => parentId !== id), // Remove from parents
          };
        });
        updatedMembers = updatedMembers.filter((m) => m.id !== id);
        data.setMember(updatedMembers);

        localStorage.setItem("familyMembers", JSON.stringify(updatedMembers));

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
    // : Swal.fire({
    //     title: "Error!",
    //     text: "You can't delete this member because they have children.",
    //     icon: "error",
    //   });
  };

  const handleEditMember = () => {
    data.setSelectedMember(data.member);
    data.setFormData(data.member);
    data.setIsAddMemberVisible(true);
  };

  return (
    <div className="py-3 px-5 bg-purple-100 border border-purple-500 rounded shadow-lg flex flex-col items-start gap-4 h-auto w-auto">
      <>
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
      </>

      {
        <Handle
          type="target"
          position="top"
          id="top"
          className="w-16 !bg-purple-700"
        />
      }
      {
        <Handle
          type="source"
          position="bottom"
          id="bottom"
          className="w-16 !bg-purple-700"
        />
      }

      {
        <Handle
          type="source"
          position="right"
          id="right"
          className="w-16 !bg-purple-700"
        />
      }
      {
        <Handle
          type="target"
          position="left"
          id="left"
          className="w-16 !bg-purple-700"
        />
      }
    </div>
  );
};
export default NodeComponent;
