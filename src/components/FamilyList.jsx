import { IoMdAdd } from "react-icons/io";
import { useEffect, useState } from "react";
import FamilyTreeNode from "./FamilyTree";
import { GrClear } from "react-icons/gr";
import AddMember from "./Modals/AddMember";

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
    setSelectedMember(null);
  };

  const handleClearAll = () => {
    localStorage.clear("familyMembers");
    setMember([]);
  };

  return (
    <>
      {/* <Header /> */}
      <div className="flex">
        <div className="flex flex-col items-center justify-start w-1/4 bg-purple-100">
          {/* <button
            className="py-4 shadow-lg bg-purple-300 text-lg capitalize font-semibold  w-[220px] rounded-lg cursor-pointer mt-2 flex items-center justify-center gap-2"
            onClick={handleAddMember}
          >
            <IoMdAdd className="h-5 w-5" /> Add Family
          </button>
          <button
            className="py-4 shadow-lg bg-purple-300 text-lg capitalize font-semibold  w-[220px] rounded-lg cursor-pointer mt-2 flex items-center justify-center gap-2"
            onClick={() => handleClearAll()}
          >
            Clear All
          </button> */}
          <div className="flex justify-center items-center gap-14 mt-4">
            <button
              className="p-4 shadow-lg bg-purple-500 hover:bg-purple-700 text-white rounded-lg cursor-pointer flex items-center justify-center gap-2"
              onClick={handleAddMember}
              title="add member"
            >
              <IoMdAdd className="h-5 w-5 text-white" />
            </button>
            <button
              className="p-4 shadow-lg bg-purple-500 hover:bg-purple-700 text-white rounded-lg cursor-pointer flex items-center justify-center gap-2"
              onClick={() => handleClearAll()}
              title="clear all"
            >
              <GrClear className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-4 cursor-pointer items-start justify-start mt-4 p-2 w-[220px]">
            {member?.map((key, index) => (
              <div
                key={key.id}
                className="w-full p-3 rounded-lg shadow-lg text-white bg-purple-500 hover:bg-purple-700 flex justify-between items-center"
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
          <FamilyTreeNode
            member={member}
            setMember={setMember}
            setSelectedMember={setSelectedMember}
            setFormData={setFormData}
            setIsAddMemberVisible={setIsAddMemberVisible}
          />
        </div>
        <AddMember
          formData={formData}
          setFormData={setFormData}
          selectedMember={selectedMember}
          setSelectedMember={setSelectedMember}
          member={member}
          setMember={setMember}
          setIsAddMemberVisible={setIsAddMemberVisible}
          isAddMemberVisible={isAddMemberVisible}
        />
      </div>
    </>
  );
};

export default FamilyList;
