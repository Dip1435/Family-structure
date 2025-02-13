// import PropTypes from "prop-types";
// import { v4 as uuidv4 } from "uuid";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { toast } from "react-toastify";

// const AddMember = ({
//   selectedMember,
//   member,
//   setMember,
//   setIsAddMemberVisible,
//   setSelectedMember,
// }) => {
//   const relationOptions = [
//     "Self",
//     "Father",
//     "Mother",
//     "Husband",
//     "Wife",
//     "Brother",
//     "Sister",
//     "Son",
//     "Daughter",
//   ];

//   const validationSchema = Yup.object({
//     name: Yup.string().required("Name is required"),
//     dob: Yup.string().required("Date of Birth is required"),
//     gender: Yup.string().required("Gender is required"),
//   });

//   const isRelationAllowed = (relatedId, relation) => {
//     const relatedMember = member.find((m) => m.id === relatedId);
//     if (!relatedMember) return true;

//     if (relation === "Husband" || relation === "Wife") {
//       return !relatedMember.spouse?.length; // Check if they already have a spouse
//     }
//     if (relation === "Father") {
//       return !relatedMember.parents?.some((pId) => {
//         const parent = member.find((m) => m.id === pId);
//         return parent?.gender === "Male";
//       });
//     }
//     if (relation === "Mother") {
//       return !relatedMember.parents?.some((pId) => {
//         const parent = member.find((m) => m.id === pId);
//         return parent?.gender === "Female";
//       });
//     }
//     return true;
//   };

//   const formik = useFormik({
//     initialValues: {
//       name: selectedMember?.name || "",
//       dob: selectedMember?.dob || "",
//       gender: selectedMember?.gender || "",
//       relation: selectedMember?.relation || "",
//       relatedMemberId: selectedMember?.relatedMemberId || "",
//     },
//     validationSchema,
//     enableReinitialize: true,

//     onSubmit: (values) => {
//       if (
//         !isRelationAllowed(values.relatedMemberId, values.relation) &&
//         !selectedMember
//       ) {
//         toast.error(`The selected person already has a ${values.relation}.`);
//         return;
//       } else if (
//         values.relation === "Brother" ||
//         values.relation === "Sister"
//       ) {
//         let id = values.relatedMemberId;
//         let relatedMember = member.find((m) => m.id === id);
//         if (
//           relatedMember.relation === "Father" ||
//           relatedMember.relation === "Self" ||
//           relatedMember.relation === "Mother" ||
//           relatedMember.relation === "Husband" ||
//           relatedMember.relation === "Wife"
//         ) {
//           toast.error(`Cant add relation `);
//           return;
//         }
//       }

//       let updatedMembers = [...member];
//       const newMemberId = selectedMember ? selectedMember.id : uuidv4();

//       const newMember = {
//         id: newMemberId,
//         ...values,
//         children: [],
//         spouse: [],
//       };

//       if (selectedMember) {
//         updatedMembers = updatedMembers.map((m) =>
//           m.id === selectedMember.id ? { ...m, ...values } : m
//         );
//         setSelectedMember(null);
//         formik.resetForm();
//       } else {
//         updatedMembers.push(newMember);
//         formik.resetForm();
//       }
//       if (values.relatedMemberId) {
//         updatedMembers = updatedMembers.map((m) => {
//           if (m.id === values.relatedMemberId) {
//             if (values.relation === "Son" || values.relation === "Daughter") {
//               return { ...m, children: [...(m.children || []), newMemberId] };
//             }
//             if (values.relation === "Husband" || values.relation === "Wife") {
//               return { ...m, spouse: [newMemberId] };
//             }
//             if (values.relation === "Mother") {
//               return {
//                 ...m,
//                 spouse: [...(m.relatedMemberId || []), newMemberId],
//               };
//             }
//           }
//           return m;
//         });

//         if (
//           values.relation === "Husband" ||
//           values.relation === "Wife" ||
//           values.relation === "Mother"
//         ) {
//           updatedMembers = updatedMembers.map((m) => {
//             if (m.id === newMemberId) {
//               return { ...m, spouse: [values.relatedMemberId] }; // Set spouse ID only if it's a marital relation
//             }
//             return m;
//           });
//         }
//         if (
//           values.relation === "Son" ||
//           values.relation === "Daughter" ||
//           values.relation === "Brother" ||
//           values.relation === "Sister" ||
//           values.relation === "Father" ||
//           values.relation === "Mother"
//         ) {
//           updatedMembers = updatedMembers.map((m) => {
//             if (m.id === newMemberId) {
//               return { ...m, children: [values.relatedMemberId] }; // Set spouse ID only if it's a marital relation
//             }
//             return m;
//           });
//         }
//       }
//       setMember(updatedMembers);
//       setIsAddMemberVisible(false);
//       formik.resetForm();
//     },
//   });

//   return (
//     <div className="bg-purple-500 rounded-lg">
//       <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 p-5">
//         <input
//           type="text"
//           placeholder="Name"
//           name="name"
//           value={formik.values.name}
//           onChange={formik.handleChange}
//           className="outline rounded-lg p-2"
//         />
//         {formik.touched.name && formik.errors.name && (
//           <p className="text-red-500">{formik.errors.name}</p>
//         )}

//         <input
//           type="date"
//           name="dob"
//           value={formik.values.dob}
//           onChange={formik.handleChange}
//           className="outline rounded-lg p-2"
//         />
//         {formik.touched.dob && formik.errors.dob && (
//           <p className="text-red-500">{formik.errors.dob}</p>
//         )}

//         <select
//           name="gender"
//           value={formik.values.gender}
//           onChange={formik.handleChange}
//           className="outline p-2 rounded-lg"
//         >
//           <option value="">Select Gender</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//         </select>
//         {formik.touched.gender && formik.errors.gender && (
//           <p className="text-red-500">{formik.errors.gender}</p>
//         )}

//         <select
//           name="relation"
//           value={formik.values.relation}
//           onChange={formik.handleChange}
//           className="border p-2 rounded-lg"
//         >
//           <option value="">Select Relation</option>
//           {relationOptions.map((relation) => (
//             <option key={relation} value={relation}>
//               {relation}
//             </option>
//           ))}
//         </select>
//         {formik.touched.relation && formik.errors.relation && (
//           <p className="text-red-500">{formik.errors.relation}</p>
//         )}

//         {formik.values.relation && (
//           <select
//             name="relatedMemberId"
//             value={formik.values.relatedMemberId}
//             onChange={formik.handleChange}
//             className="border p-2 rounded-lg"
//           >
//             <option value="">Select Related Member</option>
//             {member.map((m) => (
//               <option key={m.id} value={m.id}>
//                 {m.name}
//               </option>
//             ))}
//           </select>
//         )}
//         {formik.touched.relatedMemberId && formik.errors.relatedMemberId && (
//           <p className="text-red-500">{formik.errors.relatedMemberId}</p>
//         )}
//         <div className="flex justify-start items-center gap-4">
//           <button
//             type="submit"
//             className="bg-green-600 text-white px-4 py-2 rounded-lg"
//           >
//             {selectedMember ? "Update" : "Add"}
//           </button>
//           <button
//             className={`bg-red-600 ${
//               selectedMember ? "hidden" : "block"
//             } text-white px-4 py-2 rounded-lg`}
//             onClick={() => {
//               formik.resetForm();
//             }}
//           >
//             Reset
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// AddMember.propTypes = {
//   selectedMember: PropTypes.shape({
//     id: PropTypes.string,
//     name: PropTypes.string,
//     dob: PropTypes.string,
//     gender: PropTypes.string,
//     relation: PropTypes.string,
//     relatedMemberId: PropTypes.string,
//   }),
//   setSelectedMember: PropTypes.func.isRequired,
//   member: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       name: PropTypes.string,
//       dob: PropTypes.string,
//       gender: PropTypes.string,
//       relation: PropTypes.string,
//       relatedMemberId: PropTypes.string,
//     })
//   ).isRequired,
//   setMember: PropTypes.func.isRequired,
//   setIsAddMemberVisible: PropTypes.func.isRequired,
// };

// export default AddMember;
