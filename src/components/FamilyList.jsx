import PropTypes from "prop-types";

import { IoMdAdd } from "react-icons/io";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import Header from "./Header";
import FamilyTreeNode from "./FamilyTree";
import AddMember from "./AddMember";

const FamilyList = () => {
  const [member, setMember] = useState(
    JSON.parse(localStorage.getItem("familyMembers")) || []
  );

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    relation: "",
    relatedMemberId: "",
  });
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddMemberVisible, setIsAddMemberVisible] = useState(false);

  useEffect(() => {
    const storedMembers =
      JSON.parse(localStorage.getItem("familyMembers")) || [];
    setMember(storedMembers);
  }, []);

  useEffect(() => {
    localStorage.setItem("familyMembers", JSON.stringify(member));
  }, [member]);

  const handleAddMember = () => {
    setIsAddMemberVisible(true);
  };
  // const navigate = useNavigate();
  // const handleDelete = (family) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You want to delete this family?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire({
  //         title: "Deleted!",
  //         text: "Your family has been deleted.",
  //         icon: "success",
  //       });
  //       setFamily((prevFamily) => prevFamily.filter((f) => f !== family));
  //     }
  //   });
  // };

  return (
    <>
      {/* <Header /> */}
      <div className="flex">
        <div className="flex flex-col items-center justify-start w-1/4 bg-purple-500">
          <button
            className="py-4 shadow-lg bg-purple-300 text-lg capitalize font-semibold  w-[220px] rounded-lg cursor-pointer mt-2 flex items-center justify-center gap-2"
            onClick={handleAddMember}
          >
            <IoMdAdd className="h-5 w-5" /> Add Family
          </button>
          <div className="flex flex-wrap gap-4   cursor-pointer items-start justify-start mt-4 p-4 w-[250px]">
            {member?.map((key, index) => (
              <div
                key={key.id}
                className="w-full p-4 rounded-lg shadow-lg bg-purple-300 hover:bg-purple-200 flex justify-between items-center"
              >
                <div className="flex justify-between items-center gap-5">
                  <h2 className="mx-2 text-lg capitalize font-semibold">
                    {index + 1}
                  </h2>

                  <h2 className="mx-2 text-lg capitalize font-semibold">
                    {key.name}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full h-screen">
          <FamilyTreeNode member={member} setMember={setMember} setSelectedMember={setSelectedMember} setFormData={setFormData} setIsAddMemberVisible={setIsAddMemberVisible}/>
        </div>
        <div
          className={`flex flex-col items-start justify-start p-4 w-1/4  bg-purple-500 ${
            isAddMemberVisible ? "block" : "hidden"
          }`}
        >
          <AddMember
            formData={formData}
            setFormData={setFormData}
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
            member={member}
            setMember={setMember}
            setIsAddMemberVisible={setIsAddMemberVisible}
          />
        </div>
      </div>
    </>
  );
};

FamilyList.propTypes = {
  setSelectedFamily: PropTypes.shape({
    type: PropTypes.object,
  }),
};

export default FamilyList;
