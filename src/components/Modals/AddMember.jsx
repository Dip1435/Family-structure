import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
const AddMember = ({
  isAddMemberVisible = false,
  selectedMember,
  member,
  setMember,
  setIsAddMemberVisible,
  setSelectedMember,
}) => {
  const maleRelations = ["Self", "Mother", "Wife", "Daughter", "Sister"];
  const femaleRelations = ["Self", "Father", "Husband", "Son", "Brother"];

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    dob: Yup.string().required("Date of Birth is required"),
    gender: Yup.string().required("Gender is required"),
    relation: Yup.string().required("Relation is required"),
    // relatedMemberId: Yup.string().when("relation", {
    //   is: (relation) => relation && relation !== "Self",
    //   then: Yup.string().required("Please select a related member"),
    //   otherwise: Yup.string().notRequired(),
    // }),
  });

  // const isRelationAllowed = (relatedId, relation) => {
  //   const relatedMember = member.find((m) => m.id === relatedId);
  //   if (!relatedMember) return true;

  //   if (relation === "Husband" || relation === "Wife") {
  //     return !relatedMember.spouse?.length; // Check if they already have a spouse
  //   }
  //   if (relation === "Father") {
  //     return !relatedMember.parents?.some((pId) => {
  //       const parent = member.find((m) => m.id === pId);
  //       return parent?.gender === "Male";
  //     });
  //   }
  //   if (relation === "Mother") {
  //     return !relatedMember.parents?.some((pId) => {
  //       const parent = member.find((m) => m.id === pId);
  //       return parent?.gender === "Female";
  //     });
  //   }
  //   return true;
  // };

  const formik = useFormik({
    initialValues: {
      name: selectedMember?.name || "",
      dob: selectedMember?.dob || "",
      gender: selectedMember?.gender || "",
      relation: selectedMember?.relation || "",
      relatedMemberId: selectedMember?.relatedMemberId || "",
    },
    validationSchema,
    enableReinitialize: true,

    onSubmit: (values) => {
      // if (
      //   !isRelationAllowed(values.relatedMemberId, values.relation) &&
      //   !selectedMember
      // ) {
      //   toast.error(`The selected person already has a ${values.relation}.`);
      //   return;
      // } else if (
      //   values.relation === "Brother" ||
      //   values.relation === "Sister"
      // ) {
      //   let id = values.relatedMemberId;
      //   let relatedMember = member.find((m) => m.id === id);
      //   if (
      //     relatedMember.relation === "Father" ||
      //     relatedMember.relation === "Self" ||
      //     relatedMember.relation === "Mother" ||
      //     relatedMember.relation === "Husband" ||
      //     relatedMember.relation === "Wife"
      //   ) {
      //     toast.error(`Cant add relation`);
      //     return;
      //   }
      // } else if (values.relation === "Self" && values.gender === "Female") {
      //   toast.error(`Cant add Female as root member`);
      //   return;
      // }

      let updatedMembers = [...member];
      const newMemberId = selectedMember ? selectedMember?.id : uuidv4();
      const relatedMember = member?.find(
        (m) => m.id === values.relatedMemberId
      );

      const newMember = {
        id: newMemberId,
        ...values,
        children: [],
        spouse: [],
        parents: [],
      };

      if (selectedMember) {
        updatedMembers = updatedMembers.map((m) =>
          m.id === selectedMember.id ? { ...m, ...values } : m
        );
        setSelectedMember(null);
        formik.resetForm();
      } else {
        updatedMembers.push(newMember);
        formik.resetForm();
      }
      // if (values.relatedMemberId) {
      //   updatedMembers = updatedMembers.map((m) => {
      //     if (m.id === values.relatedMemberId) {
      //       if (values.relation === "Son" || values.relation === "Daughter") {
      //         return { ...m, children: [...(m.children || []), newMemberId] };
      //       }
      //       if (values.relation === "Husband" || values.relation === "Wife") {
      //         return { ...m, spouse: [newMemberId] };
      //       }
      //       if (values.relation === "Mother") {
      //         return {
      //           ...m,
      //           spouse: [...(m.relatedMemberId || []), newMemberId],
      //         };
      //       }
      //     }
      //     return m;
      //   });

      //   if (
      //     values.relation === "Husband" ||
      //     values.relation === "Wife" ||
      //     values.relation === "Mother"
      //   ) {
      //     updatedMembers = updatedMembers.map((m) => {
      //       if (m.id === newMemberId) {
      //         return { ...m, spouse: [values.relatedMemberId] }; // Set spouse ID only if it's a marital relation
      //       }
      //       return m;
      //     });
      //   }
      //   if (
      //     values.relation === "Son" ||
      //     values.relation === "Daughter" ||
      //     values.relation === "Brother" ||
      //     values.relation === "Sister" ||
      //     values.relation === "Father" ||
      //     values.relation === "Mother"
      //   ) {
      //     updatedMembers = updatedMembers.map((m) => {
      //       if (m.id === newMemberId) {
      //         return { ...m, children: [values.relatedMemberId] }; // Set spouse ID only if it's a marital relation
      //       }
      //       return m;
      //     });
      //   }
      // }
      if (relatedMember) {
        updatedMembers = updatedMembers?.map((m) => {
          if (m.id === values.relatedMemberId) {
            if (values.relation === "Son" || values.relation === "Daughter") {
              return {
                ...m,
                children: [...new Set([...(m.children || []), newMemberId])],
              };
            }
            if (values.relation === "Husband" || values.relation === "Wife") {
              return { ...m, spouse: newMemberId };
            }
            if (values.relation === "Mother" || values.relation === "Father") {
              return {
                ...m,
                parents: [...new Set([...(m.parents || []), newMemberId])],
              };
            }
          }
          return m;
        });
        updatedMembers = updatedMembers.map((m) => {
          if (m.id === newMemberId) {
            if (values.relation === "Husband" || values.relation === "Wife") {
              return { ...m, spouse: values.relatedMemberId };
            }
            if (values.relation === "Son" || values.relation === "Daughter") {
              return {
                ...m,
                parents: [
                  ...new Set([...(m.parents || []), values.relatedMemberId]),
                ],
              };
            }
            if (values.relation === "Brother" || values.relation === "Sister") {
              return { ...m, parents: [...(relatedMember.parents || [])] }; // Inherit parents
            }
            if (values.relation === "Father" || values.relation === "Mother") {
              return {
                ...m,
                children: [
                  ...new Set([...(m.children || []), values.relatedMemberId]),
                ],
              };
            }
          }
          return m;
        });
        // Add new sibling to parents' children list
        if (values.relation === "Brother" || values.relation === "Sister") {
          relatedMember.parents?.forEach((parentId) => {
            updatedMembers = updatedMembers.map((parent) => {
              if (parent.id === parentId) {
                return {
                  ...parent,
                  children: [
                    ...new Set([...(parent.children || []), newMemberId]),
                  ],
                };
              }
              return parent;
            });
          });
        }
      }
      setMember(updatedMembers);
      setIsAddMemberVisible(false);
      formik.resetForm();
    },
  });

  return (
    <>
      <Transition appear show={isAddMemberVisible} as={Fragment}>
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
                    className="text-xl font-semibold leading-6 text-gray-900 mb-4"
                  >
                    Add Member
                  </Dialog.Title>
                  <div className="bg-white rounded-lg">
                    <form
                      onSubmit={formik.handleSubmit}
                      className="flex flex-col gap-4 p-5"
                    >
                      <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        className="outline rounded-lg p-2"
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500">{formik.errors.name}</p>
                      )}

                      <input
                        type="date"
                        name="dob"
                        value={formik.values.dob}
                        onChange={formik.handleChange}
                        className="outline rounded-lg p-2"
                      />
                      {formik.touched.dob && formik.errors.dob && (
                        <p className="text-red-500">{formik.errors.dob}</p>
                      )}

                      <select
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        className="outline p-2 rounded-lg"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {formik.touched.gender && formik.errors.gender && (
                        <p className="text-red-500">{formik.errors.gender}</p>
                      )}

                      <select
                        name="relation"
                        value={formik.values.relation}
                        onChange={formik.handleChange}
                        className="border p-2 rounded-lg"
                      >
                        <option value="">Select Relation</option>
                        {formik.values.gender === "Male"
                          ? femaleRelations?.map((relation) => (
                              <option key={relation} value={relation}>
                                {relation}
                              </option>
                            ))
                          : maleRelations?.map((relation) => (
                              <option key={relation} value={relation}>
                                {relation}
                              </option>
                            ))}
                      </select>
                      {formik.touched.relation && formik.errors.relation && (
                        <p className="text-red-500">{formik.errors.relation}</p>
                      )}

                      {formik.values.relation &&
                        formik.values.relation !== "Self" && (
                          <select
                            name="relatedMemberId"
                            value={formik.values.relatedMemberId}
                            onChange={formik.handleChange}
                            className="border p-2 rounded-lg"
                          >
                            <option value="">Select Related Member</option>
                            {member?.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                        )}
                      {formik.touched.relatedMemberId &&
                        formik.errors.relatedMemberId && (
                          <p className="text-red-500">
                            {formik.errors.relatedMemberId}
                          </p>
                        )}
                      <div className="flex justify-start items-center gap-4">
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                          {selectedMember ? "Update" : "Add"}
                        </button>
                        <button
                          className={`bg-red-600 ${
                            selectedMember ? "hidden" : "block"
                          } text-white px-4 py-2 rounded-lg`}
                          onClick={() => {
                            formik.resetForm();
                          }}
                        >
                          Reset
                        </button>
                        <button
                          className={`bg-red-600 text-white px-4 py-2 rounded-lg`}
                          onClick={() => {
                            setIsAddMemberVisible(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
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

export default AddMember;
