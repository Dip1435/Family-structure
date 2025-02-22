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
    relatedMemberId: Yup.string().when("relation", (relation, schema) =>
      relation == "Self"
        ? schema.notRequired()
        : schema.required("Related member is required")
    ),
  });

  const isRelationAllowed = (relatedId, relation) => {
    const relatedMember = member.find((m) => m.id === relatedId);
    if (!relatedMember) return true;

    if (relation === "Husband" || relation === "Wife") {
      return !relatedMember.spouse?.length; // Check if they already have a spouse
    }
    return true;
  };

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
      if (
        !isRelationAllowed(values.relatedMemberId, values.relation) &&
        !selectedMember
      ) {
        toast.error(`The selected person already has a ${values.relation}.`);
        return;
      }
      if (values.relation === "Husband") {
        const relatedMember = member.find(
          (m) => m.id === values.relatedMemberId
        );
        if (relatedMember.gender === "Male") {
          toast.error("Husband can only be added to a female member.");
          return;
        }
      }
      if (values.relation === "Wife") {
        const relatedMember = member.find(
          (m) => m.id === values.relatedMemberId
        );
        if (relatedMember.gender === "Female") {
          toast.error("Wife can only be added to a male member.");
          return;
        }
      }
      if (values.relation === "Brother" || values.relation === "Sister") {
        let id = values.relatedMemberId;
        let relatedMember = member.find((m) => m.id === id);
        if (relatedMember.parents.length < 1) {
          toast.error("You must add a parent before adding siblings.");
          return;
        }
      }
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
              // const relatedMember = member?.find(
              //   (m) => m.id === values.relatedMemberId
              // );
              return {
                ...m,
                children: [
                  ...new Set([...(m.children || []), values.relatedMemberId]),
                ],
                // spouse: [...(relatedMember?.parents || [])],
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

        if (values.relation === "Mother" || values.relation === "Father") {
          const child = updatedMembers.find(
            (m) => m.id === values.relatedMemberId
          );
          if (child) {
            const existingParentId = child.parents?.find(
              (p) => p !== newMemberId
            ); // Find existing parent
            if (existingParentId) {
              updatedMembers = updatedMembers.map((m) => {
                if (m.id === existingParentId) {
                  return { ...m, spouse: newMemberId }; // Set spouse for existing parent
                }
                if (m.id === newMemberId) {
                  return { ...m, spouse: existingParentId }; // Set spouse for new parent
                }
                return m;
              });
            }
          }
        }
      }
      setMember(updatedMembers);
      setIsAddMemberVisible(false);
      formik.resetForm();
    },
  });
  const hasRootMember = member.some((m) => m.relation === "Self");

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
                  {/* <div className="bg-white rounded-lg">
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
                        // autoComplete="off"
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
                        {(formik.values.gender === "Male"
                          ? femaleRelations
                          : maleRelations
                        )
                          ?.filter(
                            (relation) => relation !== "Self" || !hasRootMember
                          )
                          ?.map((relation) => (
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
                            formik.resetForm();
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div> */}
                  <div className="bg-white rounded-lg shadow-md max-w-md mx-auto p-6">
                    <form
                      onSubmit={formik.handleSubmit}
                      className="flex flex-col space-y-4"
                    >
                      {/* Name Input */}
                      <label className="text-sm font-semibold">
                        Name
                        <input
                          type="text"
                          placeholder="Enter name"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-300 outline-none"
                        />
                      </label>
                      {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.name}
                        </p>
                      )}

                      {/* Date of Birth */}
                      <label className="text-sm font-semibold">
                        Date of Birth
                        <input
                          type="date"
                          name="dob"
                          value={formik.values.dob}
                          onChange={formik.handleChange}
                          className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-300 outline-none"
                        />
                      </label>
                      {formik.touched.dob && formik.errors.dob && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.dob}
                        </p>
                      )}

                      {/* Gender Selection */}
                      <label className="text-sm font-semibold">
                        Gender
                        <select
                          name="gender"
                          value={formik.values.gender}
                          onChange={formik.handleChange}
                          className="border border-gray-300 p-2 rounded-lg w-full focus:ring focus:ring-blue-300 outline-none"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </label>
                      {formik.touched.gender && formik.errors.gender && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.gender}
                        </p>
                      )}

                      {/* Relation Selection */}
                      <label className="text-sm font-semibold">
                        Relation
                        <select
                          name="relation"
                          value={formik.values.relation}
                          onChange={formik.handleChange}
                          className="border border-gray-300 p-2 rounded-lg w-full focus:ring focus:ring-blue-300 outline-none"
                        >
                          <option value="">Select Relation</option>
                          {(formik.values.gender === "Male"
                            ? femaleRelations
                            : maleRelations
                          )
                            ?.filter(
                              (relation) =>
                                relation !== "Self" || !hasRootMember
                            )
                            ?.map((relation) => (
                              <option key={relation} value={relation}>
                                {relation}
                              </option>
                            ))}
                        </select>
                      </label>
                      {formik.touched.relation && formik.errors.relation && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.relation}
                        </p>
                      )}

                      {/* Related Member Selection */}
                      {formik.values.relation &&
                        formik.values.relation !== "Self" && (
                          <label className="text-sm font-semibold">
                            Related Member
                            <select
                              name="relatedMemberId"
                              value={formik.values.relatedMemberId}
                              onChange={formik.handleChange}
                              className="border border-gray-300 p-2 rounded-lg w-full focus:ring focus:ring-blue-300 outline-none"
                            >
                              <option value="">Select Related Member</option>
                              {member?.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        )}
                      {formik.touched.relatedMemberId &&
                        formik.errors.relatedMemberId && (
                          <p className="text-red-500 text-sm">
                            {formik.errors.relatedMemberId}
                          </p>
                        )}

                      {/* Buttons */}
                      <div className="flex justify-between items-center mt-8">
                        <button
                          type="submit"
                          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg w-full"
                        >
                          {selectedMember ? "Update" : "Add"}
                        </button>
                      </div>

                      <div className="flex justify-between items-center space-x-2">
                        {!selectedMember && (
                          <button
                            type="button"
                            className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-lg w-1/2"
                            onClick={() => formik.resetForm()}
                          >
                            Reset
                          </button>
                        )}

                        <button
                          type="button"
                          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg w-1/2"
                          onClick={() => {
                            setIsAddMemberVisible(false);
                            formik.resetForm();
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
