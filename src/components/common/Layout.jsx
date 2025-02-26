import { IoMdAdd } from "react-icons/io";
import { useEffect, useState } from "react";
import FamilyTreeNode from "../ReactFlow/FamilyTree";
import { GrClear } from "react-icons/gr";
import { GrRefresh } from "react-icons/gr";
import AddMember from "../Modals/AddMember";
import MemberDetail from "../Modals/MemberDetail";
import { v4 as uuidv4 } from "uuid";

const Layout = () => {
  const defaultMember = {
    id: uuidv4(),
    name: "dip",
    dob: "2025-02-17",
    gender: "Male",
    relation: "Self",
    isRoot: true,
    relatedMemberId: "",
  };
  const loadMembers = () => {
    const storedMembers = localStorage.getItem("familyMembers");
    if (!storedMembers) {
      localStorage.setItem("familyMembers", JSON.stringify([defaultMember]));
      return [defaultMember];
    }
    return JSON.parse(storedMembers);
  };

  const [member, setMember] = useState(loadMembers() || []);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    relation: "",
    relatedMemberId: "",
  });
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddMemberVisible, setIsAddMemberVisible] = useState(false);
  const [isOpenmemberDetail, setIsOpenMemberDetail] = useState(false);
  const [memberDetail, setMemberDetail] = useState(null);

  useEffect(() => {
    localStorage.setItem("familyMembers", JSON.stringify(member));
  }, [member]);

  const handleAddMember = () => {
    setIsAddMemberVisible(true);
    setSelectedMember(null);
  };

  const handleClearAll = () => {
    localStorage.clear("familyMembers");

    setMember(loadMembers() || []);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row h-screen">
        <div className="flex flex-col items-center justify-start w-full sm:w-1/4 bg-purple-100 p-4">
          <div className="flex flex-wrap gap-4 justify-center w-full">
            <button
              className="p-3 shadow-lg bg-purple-500 hover:bg-purple-700 text-white rounded-lg cursor-pointer flex items-center justify-center gap-2"
              onClick={handleAddMember}
              title="Add Member"
            >
              <IoMdAdd className="h-5 w-5 text-white" />
            </button>
            <button
              className="p-3 shadow-lg bg-purple-500 hover:bg-purple-700 text-white rounded-lg cursor-pointer flex items-center justify-center gap-2"
              onClick={handleClearAll}
              title="Clear All"
            >
              <GrClear className="h-5 w-5" />
            </button>
            <button
              className="p-3 shadow-lg bg-purple-500 hover:bg-purple-700 text-white rounded-lg cursor-pointer flex items-center justify-center gap-2"
              onClick={() => location.reload()}
              title="Reset"
            >
              <GrRefresh className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 items-start justify-center mt-4 p-2 w-full max-w-xs sm:w-[180px]">
            {member?.map((key, index) => (
              <div
                key={key.id}
                className="w-full p-3 rounded-lg shadow-lg text-white bg-purple-500 hover:bg-purple-700 flex justify-between items-center"
                onClick={() => {
                  setIsOpenMemberDetail(true);
                  setMemberDetail(key);
                }}
              >
                <div className="flex justify-between items-center gap-3">
                  <h2 className="text-lg capitalize font-semibold">
                    {index + 1}
                  </h2>
                  <h2 className="text-lg capitalize font-semibold">
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
        {isOpenmemberDetail && (
          <MemberDetail
            memberDetail={memberDetail}
            setIsOpenMemberDetail={setIsOpenMemberDetail}
            isOpenmemberDetail={isOpenmemberDetail}
            member={member}
            setMember={setMember}
            setSelectedMember={setSelectedMember}
            setFormData={setFormData}
            setIsAddMemberVisible={setIsAddMemberVisible}
          />
        )}
      </div>
    </>
  );
};

export default Layout;
