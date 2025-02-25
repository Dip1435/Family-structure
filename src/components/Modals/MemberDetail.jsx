import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import {
  FaBirthdayCake,
  FaFemale,
  FaMale,
  FaUsers,
  FaVenusMars,
} from "react-icons/fa";
import Swal from "sweetalert2";
const MemberDetail = ({
  memberDetail,
  setIsOpenMemberDetail,
  isOpenmemberDetail,
  member,
  setMember,
  setSelectedMember,
  setFormData,
  setIsAddMemberVisible,
}) => {
  const findMember = (id) => member.find((m) => m.id === id);

  const hasChildren =
    memberDetail?.children?.length > 0 &&
    (memberDetail.relation === "Father" || memberDetail.relation === "Self") &&
    !(memberDetail?.children?.length === 1 && memberDetail?.children[0] === memberDetail?.id);

  const isRoot = memberDetail?.relation === "Self";
  const handleDeleteMember = (id) => {
    let familyMembers = JSON.parse(localStorage.getItem("familyMembers"));

    let updatedMembers = [...familyMembers];

    !hasChildren && !isRoot
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
            updatedMembers = updatedMembers.map((m) => {
              return {
                ...m,
                spouse: m.spouse === id ? null : m.spouse, // Remove spouse
                children: m.children?.filter((childId) => childId !== id), // Remove from children
                parents: m.parents?.filter((parentId) => parentId !== id), // Remove from parents
                siblings: m.siblings?.filter((siblingId) => siblingId !== id), // Remove from siblings
              };
            });
            updatedMembers = updatedMembers.filter((m) => m.id !== id);
            setMember(updatedMembers);

            localStorage.setItem(
              "familyMembers",
              JSON.stringify(updatedMembers)
            );

            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        })
      : isRoot
      ? Swal.fire({
          title: "Error!",
          text: "You can't delete root member.",
          icon: "error",
        })
      : Swal.fire({
          title: "Error!",
          text: "You can't delete this member because they have children.",
          icon: "error",
        });
        setIsOpenMemberDetail(false);
  };

  const handleEditMember = () => {
    setSelectedMember(memberDetail);
    setFormData(memberDetail);
    setIsAddMemberVisible(true);
    setIsOpenMemberDetail(false);
  };

  return (
    <>
      <Transition appear show={isOpenmemberDetail} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl uppercase font-semibold leading-6 text-gray-900 mb-5 flex justify-between items-center"
                  >
                    {`${memberDetail?.name}'s Details`}
                    <IoMdCloseCircle
                      className="h-8 w-8 cursor-pointer"
                      onClick={() => setIsOpenMemberDetail(false)}
                    />
                  </Dialog.Title>
                  <div className="bg-white rounded-lg shadow-lg p-6 w-80 mx-auto">
                    <div className="flex flex-col items-center space-y-3">
                      {/* Avatar (Optional) */}
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-full">
                        {memberDetail?.gender === "Male" ? (
                          <FaMale className="text-blue-500 text-3xl" />
                        ) : (
                          <FaFemale className="text-pink-500 text-3xl" />
                        )}
                      </div>

                      {/* Member Details */}
                      <p className="text-xl font-semibold text-gray-800">
                        {memberDetail?.name}
                      </p>

                      <div className="w-full border-t border-gray-300"></div>

                      <div className="w-full space-y-2">
                        <p className="flex items-center gap-2 text-gray-600">
                          <FaVenusMars className="text-gray-500" />
                          <span className="font-semibold">Gender:</span>{" "}
                          {memberDetail?.gender}
                        </p>

                        <p className="flex items-center gap-2 text-gray-600">
                          <FaBirthdayCake className="text-gray-500" />
                          <span className="font-semibold">Born:</span>{" "}
                          {memberDetail?.dob}
                        </p>

                        <p className="flex items-center gap-2 text-gray-600">
                          <FaUsers className="text-gray-500" />
                          <span className="font-semibold">Relation:</span>
                          {memberDetail?.relation === "Self"
                            ? "Self"
                            : `${memberDetail?.relation} of ${
                                findMember(memberDetail?.relatedMemberId)?.name
                              }`}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-center gap-4 mt-4">
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500"
                          onClick={handleEditMember}
                        >
                          <MdEditSquare className="text-lg" />
                          Edit
                        </button>
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-500"
                          onClick={() => handleDeleteMember(memberDetail?.id)}
                        >
                          <MdDelete className="text-lg" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MemberDetail;
