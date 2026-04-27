// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { BASE_URL } from "./Apipath";
// import Receipt from "./Receipt";
// import { useNavigate } from "react-router-dom";
// import Dashboard from "./Dashboard";

// import {
//   Search,
//   LogOut,
//   User,
//   BookOpen,
//   GraduationCap,
//   Calendar,
//   DollarSign,
//   Save,
//   RefreshCw,
//   Edit3,
//   UserPlus,
//   CreditCard,
//   Hash,
// } from "lucide-react";

// const App = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("add");

//   const standardCourses = [
//     "Web Development",
//     "AI/ML",
//     "Cybersecurity",
//     "App Development",
//     "Digital Marketing",
//   ];

//   const [addForm, setAddForm] = useState({
//     rollno: "",
//     name: "",
//     fatherName: "",
//     course: "",
//     college: "",
//     dateOfEnrollment: "",
//     totalFee: "",
//     paidAmount: "",
//     courseduration: "",
//   });

//   const [updateForm, setUpdateForm] = useState({
//     rollno: "",
//     name: "",
//     fatherName: "",
//     course: "",
//     college: "",
//     dateOfEnrollment: "",
//     totalFee: "",
//     paidAmount: "",
//     courseduration: "",
//   });

//   const [addStatus, setAddStatus] = useState({ type: "", message: "" });
//   const [updateStatus, setUpdateStatus] = useState({ type: "", message: "" });
//   const [showOtherInput, setShowOtherInput] = useState(false);
//   const [isExisting, setIsExisting] = useState(false);
//   const [lastSubmittedData, setLastSubmittedData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     axios
//       .get(`${BASE_URL}/api/adminlogin/getcookie`, { withCredentials: true })
//       .then((res) => {
//         if (res.status === 200) console.log("Authenticated");
//       })
//       .catch(() => navigate("/"));
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         `${BASE_URL}/api/adminlogin/logoutadmin`,
//         {},
//         { withCredentials: true },
//       );
//       window.location.href = "/";
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleAddChange = (e) => {
//     const { name, value, tagName } = e.target;
//     if (name === "course" && tagName === "SELECT") {
//       if (value === "Other") {
//         setShowOtherInput(true);
//         setAddForm((prev) => ({ ...prev, course: "" }));
//       } else {
//         setShowOtherInput(false);
//         setAddForm((prev) => ({ ...prev, course: value }));
//       }
//     } else {
//       setAddForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleAddSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setAddStatus({ type: "info", message: "Processing..." });
//     try {
//       const response = await axios.post(
//         `${BASE_URL}/api/students/add`,
//         addForm,
//       );
//       setAddStatus({
//         type: "success",
//         message: "New Student Added & Synced successfully!",
//       });
//       setLastSubmittedData(response.data.data);
//       setAddForm({
//         rollno: "",
//         name: "",
//         fatherName: "",
//         course: "",
//         college: "",
//         dateOfEnrollment: "",
//         totalFee: "",
//         paidAmount: "",
//         courseduration: "",
//       });
//       setShowOtherInput(false);
//     } catch (error) {
//       setAddStatus({
//         type: "error",
//         message: error.response?.data?.message || "Operation failed.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateChange = (e) => {
//     const { name, value } = e.target;
//     setUpdateForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // ← KEY CHANGE: search by rollno OR name, whichever is filled
//   const handleFind = async () => {
//     const hasRollno = updateForm.rollno.toString().trim() !== "";
//     const hasName = updateForm.name.trim() !== "";

//     if (!hasRollno && !hasName) {
//       return setUpdateStatus({
//         type: "error",
//         message: "Please enter a name or roll number to search.",
//       });
//     }

//     setLoading(true);
//     setUpdateStatus({ type: "info", message: "Searching database..." });
//     setLastSubmittedData(null);

//     try {
//       // Prefer rollno if both are filled
//       const query = hasRollno
//         ? `rollno=${updateForm.rollno.toString().trim()}`
//         : `name=${updateForm.name.toLowerCase().trim()}`;

//       const response = await axios.get(
//         `${BASE_URL}/api/students/find?${query}`,
//       );
//       const fetchedCourse = response.data.course;

//       setUpdateForm({
//         rollno: response.data.rollno || "",
//         name: response.data.name,
//         fatherName: response.data.fatherName,
//         course: fetchedCourse,
//         college: response.data.college || "",
//         dateOfEnrollment: response.data.dateOfEnrollment || "",
//         totalFee: response.data.totalFee,
//         paidAmount: "",
//         courseduration: response.data.courseduration || "",
//       });

//       setIsExisting(true);
//       setUpdateStatus({
//         type: "success",
//         message: `Found: ${response.data.name}. You can now update fees.`,
//       });
//     } catch (error) {
//       setIsExisting(false);
//       setUpdateStatus({ type: "warning", message: "Student not found." });
//       setUpdateForm((prev) => ({
//         ...prev,
//         fatherName: "",
//         course: "",
//         college: "",
//         dateOfEnrollment: "",
//         totalFee: "",
//         paidAmount: "",
//         courseduration: "",
//       }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     if (!isExisting)
//       return setUpdateStatus({
//         type: "error",
//         message: "Please find a student first.",
//       });

//     setLoading(true);
//     setUpdateStatus({ type: "info", message: "Processing..." });
//     try {
//       const response = await axios.put(`${BASE_URL}/api/students/update-fees`, {
//         name: updateForm.name.toLowerCase().trim(),
//         fatherName: updateForm.fatherName,
//         additionalPaid: updateForm.paidAmount,
//       });
//       setUpdateStatus({
//         type: "success",
//         message: "Fees Updated & Synced successfully!",
//       });
//       setLastSubmittedData(response.data.data);
//       setUpdateForm({
//         rollno: "",
//         name: "",
//         fatherName: "",
//         course: "",
//         college: "",
//         dateOfEnrollment: "",
//         totalFee: "",
//         paidAmount: "",
//         courseduration: "",
//       });
//       setIsExisting(false);
//     } catch (error) {
//       setUpdateStatus({
//         type: "error",
//         message: error.response?.data?.message || "Operation failed.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const StatusBanner = ({ status }) =>
//     status.message ? (
//       <div
//         className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
//           status.type === "success"
//             ? "bg-green-100 text-green-800 border border-green-200"
//             : status.type === "error"
//               ? "bg-red-100 text-red-800 border border-red-200"
//               : status.type === "warning"
//                 ? "bg-amber-100 text-amber-800 border border-amber-200"
//                 : "bg-blue-100 text-blue-800 border border-blue-200"
//         }`}
//       >
//         <div
//           className={`w-2 h-2 rounded-full animate-pulse ${
//             status.type === "success"
//               ? "bg-green-500"
//               : status.type === "error"
//                 ? "bg-red-500"
//                 : "bg-blue-500"
//           }`}
//         />
//         {status.message}
//       </div>
//     ) : null;

//   return (
//     <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
//       <div className="max-w-2xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
//               Fee Portal
//             </h1>
//             <p className="text-slate-500">
//               Manage student enrollments and payments
//             </p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
//           >
//             <LogOut size={18} /> Logout
//           </button>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
//           <div className="p-2 bg-slate-100 border-b border-slate-200">
//             <div className="relative flex bg-slate-200 rounded-xl p-1">
//               <div
//                 className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm transition-transform duration-300 ease-in-out ${activeTab === "update" ? "translate-x-full" : "translate-x-0"}`}
//                 style={{ width: "calc(50% - 4px)" }}
//               />
//               <button
//                 onClick={() => setActiveTab("add")}
//                 className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${activeTab === "add" ? "text-indigo-600" : "text-slate-500"}`}
//               >
//                 <UserPlus size={16} /> Add Student
//               </button>
//               <button
//                 onClick={() => setActiveTab("update")}
//                 className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${activeTab === "update" ? "text-amber-600" : "text-slate-500"}`}
//               >
//                 <CreditCard size={16} /> Update Fees
//               </button>
//             </div>
//           </div>

//           {/* ── ADD STUDENT TAB ── */}
//           {activeTab === "add" && (
//             <form onSubmit={handleAddSubmit} className="p-8 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* ← NEW: Roll Number field */}
//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <Hash size={16} className="text-slate-400" /> Roll Number*
//                   </label>
//                   <input
//                     type="number"
//                     name="rollno"
//                     placeholder="e.g. 1001"
//                     value={addForm.rollno}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <User size={16} className="text-slate-400" /> Student Name*
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     placeholder="Full Name"
//                     value={addForm.name}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <User size={16} className="text-slate-400" /> Father's Name*
//                   </label>
//                   <input
//                     type="text"
//                     name="fatherName"
//                     placeholder="Full Name"
//                     value={addForm.fatherName}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <BookOpen size={16} className="text-slate-400" /> Select
//                     Course*
//                   </label>
//                   <select
//                     name="course"
//                     value={showOtherInput ? "Other" : addForm.course}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
//                   >
//                     <option value="" disabled>
//                       Choose a course
//                     </option>
//                     {standardCourses.map((c) => (
//                       <option key={c} value={c}>
//                         {c}
//                       </option>
//                     ))}
//                     <option value="Other">Other (Type manually)</option>
//                   </select>
//                 </div>

//                 {showOtherInput && (
//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <Edit3 size={16} className="text-slate-400" /> Specify
//                       Course Name*
//                     </label>
//                     <input
//                       type="text"
//                       name="course"
//                       placeholder="Enter your course name"
//                       value={addForm.course}
//                       onChange={handleAddChange}
//                       required
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                     />
//                   </div>
//                 )}

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <BookOpen size={16} className="text-slate-400" /> Course
//                     Duration*
//                   </label>
//                   <select
//                     name="courseduration"
//                     value={addForm.courseduration}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
//                   >
//                     <option value="" disabled>
//                       Select Duration
//                     </option>
//                     <option value="6 weeks">6 weeks</option>
//                     <option value="3 months">3 months</option>
//                     <option value="4 months">4 months</option>
//                     <option value="6 months">6 months</option>
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <GraduationCap size={16} className="text-slate-400" />{" "}
//                     College*
//                   </label>
//                   <input
//                     type="text"
//                     name="college"
//                     placeholder="College Name"
//                     value={addForm.college}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <Calendar size={16} className="text-slate-400" /> Date of
//                     Enrollment*
//                   </label>
//                   <input
//                     type="date"
//                     name="dateOfEnrollment"
//                     value={addForm.dateOfEnrollment}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <DollarSign size={16} className="text-slate-400" /> Total
//                     Fee*
//                   </label>
//                   <input
//                     type="number"
//                     name="totalFee"
//                     placeholder="0.00"
//                     value={addForm.totalFee}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <DollarSign size={16} className="text-slate-400" /> Initial
//                     Payment*
//                   </label>
//                   <input
//                     type="number"
//                     name="paidAmount"
//                     placeholder="0.00"
//                     value={addForm.paidAmount}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-green-50/50"
//                   />
//                 </div>
//               </div>

//               <StatusBanner status={addStatus} />

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-4 rounded-xl font-bold text-white shadow-lg bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 transform active:scale-[0.98] transition-all flex justify-center items-center gap-2"
//               >
//                 {loading ? (
//                   <RefreshCw className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     <Save size={20} /> REGISTER & SYNC STUDENT
//                   </>
//                 )}
//               </button>
//             </form>
//           )}

//           {/* ── UPDATE FEES TAB ── */}
//           {activeTab === "update" && (
//             <div className="p-8 space-y-6">
//               {/* ← UPDATED: dual search by name OR roll number */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Search Student — by name{" "}
//                   <span className="font-normal text-slate-400">or</span> roll
//                   number
//                 </label>
//                 <div className="flex gap-3">
//                   <div className="relative flex-1">
//                     <Search
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                       size={18}
//                     />
//                     <input
//                       type="text"
//                       name="name"
//                       placeholder="Student name..."
//                       value={updateForm.name}
//                       onChange={handleUpdateChange}
//                       className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
//                     />
//                   </div>
//                   <div className="relative w-36">
//                     <Hash
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                       size={16}
//                     />
//                     <input
//                       type="number"
//                       name="rollno"
//                       placeholder="Roll no."
//                       value={updateForm.rollno}
//                       onChange={handleUpdateChange}
//                       className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
//                     />
//                   </div>
//                   <button
//                     onClick={handleFind}
//                     disabled={loading}
//                     className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
//                   >
//                     {loading ? (
//                       <RefreshCw className="animate-spin" size={18} />
//                     ) : (
//                       "Find"
//                     )}
//                   </button>
//                 </div>
//                 <p className="text-xs text-slate-400 mt-1.5">
//                   Fill either field — roll number takes priority if both are
//                   entered.
//                 </p>
//               </div>

//               <form onSubmit={handleUpdateSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Show roll number as read-only once student is found */}
//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <Hash size={16} className="text-slate-400" /> Roll Number
//                     </label>
//                     <input
//                       type="number"
//                       name="rollno"
//                       value={updateForm.rollno}
//                       disabled
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <User size={16} className="text-slate-400" /> Father's
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       name="fatherName"
//                       value={updateForm.fatherName}
//                       disabled
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <BookOpen size={16} className="text-slate-400" /> Course
//                     </label>
//                     <input
//                       type="text"
//                       name="course"
//                       value={updateForm.course}
//                       disabled
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <BookOpen size={16} className="text-slate-400" /> Course
//                       Duration
//                     </label>
//                     <input
//                       type="text"
//                       name="courseduration"
//                       value={updateForm.courseduration}
//                       disabled
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <GraduationCap size={16} className="text-slate-400" />{" "}
//                       College
//                     </label>
//                     <input
//                       type="text"
//                       name="college"
//                       value={updateForm.college}
//                       disabled
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <DollarSign size={16} className="text-slate-400" /> Total
//                       Fee
//                     </label>
//                     <input
//                       type="number"
//                       name="totalFee"
//                       value={updateForm.totalFee}
//                       disabled
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
//                     />
//                   </div>

//                   <div className="space-y-1 md:col-span-2">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <DollarSign size={16} className="text-slate-400" />{" "}
//                       Additional Payment*
//                     </label>
//                     <input
//                       type="number"
//                       name="paidAmount"
//                       placeholder="0.00"
//                       value={updateForm.paidAmount}
//                       onChange={handleUpdateChange}
//                       required
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none transition-all bg-green-50/50"
//                     />
//                   </div>
//                 </div>

//                 <StatusBanner status={updateStatus} />

//                 <button
//                   type="submit"
//                   disabled={loading || !isExisting}
//                   className="w-full py-4 rounded-xl font-bold text-white shadow-lg bg-amber-500 hover:bg-amber-600 shadow-amber-200 transform active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
//                 >
//                   {loading ? (
//                     <RefreshCw className="animate-spin" size={20} />
//                   ) : (
//                     <>
//                       <RefreshCw size={20} /> UPDATE & SYNC RECORD
//                     </>
//                   )}
//                 </button>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>

//       <div>
//         <Dashboard />
//       </div>

//       {lastSubmittedData && (
//         <Receipt
//           data={lastSubmittedData}
//           onClose={() => setLastSubmittedData(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default App;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { BASE_URL } from "./Apipath";
// import Receipt from "./Receipt";
// import { useNavigate } from "react-router-dom";
// import Dashboard from "./Dashboard";

// import {
//   Search,Banknote,Smartphone,BadgeIndianRupee,ScanQrCode,
//   LogOut,
//   User,
//   BookOpen,
//   GraduationCap,
//   Calendar,
//   DollarSign,
//   Save,
//   RefreshCw,
//   Edit3,
//   UserPlus,
//   CreditCard,
//   Hash,
//   Wallet,
// } from "lucide-react";

//   const PaymentMethodFields = ({ form, handleChange }) => (
//     <>
//       <div className="space-y-1">
//         <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//           <Wallet size={16} className="text-slate-400" /> Payment Method*
//         </label>
//         <div className="flex gap-3">
//           <button
//             type="button"
//             onClick={() =>
//               handleChange({
//                 target: { name: "paymentMethod", value: "cash" },
//               })
//             }
//             className={`flex-1 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
//               form.paymentMethod === "cash"
//                 ? "border-green-500 bg-green-50 text-green-700"
//                 : "border-slate-200 text-slate-500 hover:border-slate-300"
//             }`}
//           >
//             <BadgeIndianRupee size={18} />
//             Cash
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               handleChange({
//                 target: { name: "paymentMethod", value: "upi" },
//               })
//             }
//             className={`flex-1 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
//               form.paymentMethod === "upi"
//                 ? "border-indigo-500 bg-indigo-50 text-indigo-700"
//                 : "border-slate-200 text-slate-500 hover:border-slate-300"
//             }`}
//           >
//             <ScanQrCode size={18} />
//             UPI
//           </button>
//         </div>
//       </div>

//       {form.paymentMethod === "upi" && (
//         <div className="space-y-1">
//           <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//             <Hash size={16} className="text-slate-400" /> UPI Transaction ID*
//           </label>
//           <input
//             type="text"
//             name="transactionId"
//             placeholder="e.g. TXN123456789"
//             value={form.transactionId}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-indigo-50/30"
//           />
//         </div>
//       )}
//     </>
//   );

// const App = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("add");

//   const standardCourses = [
//     "Web Development",
//     "AI/ML",
//     "Cybersecurity",
//     "App Development",
//     "Digital Marketing",
//   ];

//   const [addForm, setAddForm] = useState({
//     rollno: "",
//     name: "",
//     fatherName: "",
//     course: "",
//     college: "",
//     dateOfEnrollment: "",
//     totalFee: "",
//     paidAmount: "",
//     courseduration: "",
//     paymentMethod: "cash",
//     transactionId: "",
//   });

//   const [updateForm, setUpdateForm] = useState({
//     rollno: "",
//     name: "",
//     fatherName: "",
//     course: "",
//     college: "",
//     dateOfEnrollment: "",
//     totalFee: "",
//     paidAmount: "",
//     courseduration: "",
//     paymentMethod: "cash",
//     transactionId: "",
//   });

//   const [addStatus, setAddStatus] = useState({ type: "", message: "" });
//   const [updateStatus, setUpdateStatus] = useState({ type: "", message: "" });
//   const [showOtherInput, setShowOtherInput] = useState(false);
//   const [isExisting, setIsExisting] = useState(false);
//   const [lastSubmittedData, setLastSubmittedData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     axios
//       .get(`${BASE_URL}/api/adminlogin/getcookie`, { withCredentials: true })
//       .then((res) => {
//         if (res.status === 200) console.log("Authenticated");
//       })
//       .catch(() => navigate("/"));
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         `${BASE_URL}/api/adminlogin/logoutadmin`,
//         {},
//         { withCredentials: true },
//       );

//       window.location.href = "/";

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleAddChange = (e) => {
//     const { name, value, tagName } = e.target;
//     if (name === "course" && tagName === "SELECT") {
//       if (value === "Other") {
//         setShowOtherInput(true);
//         setAddForm((prev) => ({ ...prev, course: "" }));
//       } else {
//         setShowOtherInput(false);
//         setAddForm((prev) => ({ ...prev, course: value }));
//       }
//     } else {
//       setAddForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleAddSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setAddStatus({ type: "info", message: "Processing..." });
//     try {
//       const response = await axios.post(
//         `${BASE_URL}/api/students/add`,
//         addForm,
//       );
//       setAddStatus({
//         type: "success",
//         message: "New Student Added & Synced successfully!",
//       });
//       setLastSubmittedData(response.data.data);
//       setAddForm({
//         rollno: "",
//         name: "",
//         fatherName: "",
//         course: "",
//         college: "",
//         dateOfEnrollment: "",
//         totalFee: "",
//         paidAmount: "",
//         courseduration: "",
//         paymentMethod: "cash",
//         transactionId: "",
//       });
//       setShowOtherInput(false);
//     } catch (error) {
//       setAddStatus({
//         type: "error",
//         message: error.response?.data?.message || "Operation failed.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateChange = (e) => {
//     const { name, value } = e.target;
//     setUpdateForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFind = async () => {
//     const hasRollno = updateForm.rollno.toString().trim() !== "";
//     const hasName = updateForm.name.trim() !== "";

//     if (!hasRollno && !hasName) {
//       return setUpdateStatus({
//         type: "error",
//         message: "Please enter a name or roll number to search.",
//       });
//     }

//     setLoading(true);
//     setUpdateStatus({ type: "info", message: "Searching database..." });
//     setLastSubmittedData(null);

//     try {
//       const query = hasRollno
//         ? `rollno=${updateForm.rollno.toString().trim()}`
//         : `name=${updateForm.name.toLowerCase().trim()}`;

//       const response = await axios.get(
//         `${BASE_URL}/api/students/find?${query}`,
//       );
//       const fetchedCourse = response.data.course;

//       setUpdateForm({
//         rollno: response.data.rollno || "",
//         name: response.data.name,
//         fatherName: response.data.fatherName,
//         course: fetchedCourse,
//         college: response.data.college || "",
//         dateOfEnrollment: response.data.dateOfEnrollment || "",
//         totalFee: response.data.totalFee,
//         paidAmount: "",
//         courseduration: response.data.courseduration || "",
//         paymentMethod: "cash",
//         transactionId: "",
//       });

//       setIsExisting(true);
//       setUpdateStatus({
//         type: "success",
//         message: `Found: ${response.data.name}. You can now update fees.`,
//       });
//     } catch (error) {
//       setIsExisting(false);
//       setUpdateStatus({ type: "warning", message: "Student not found." });
//       setUpdateForm((prev) => ({
//         ...prev,
//         fatherName: "",
//         course: "",
//         college: "",
//         dateOfEnrollment: "",
//         totalFee: "",
//         paidAmount: "",
//         courseduration: "",
//         paymentMethod: "cash",
//         transactionId: "",
//       }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     if (!isExisting)
//       return setUpdateStatus({
//         type: "error",
//         message: "Please find a student first.",
//       });

//     setLoading(true);
//     setUpdateStatus({ type: "info", message: "Processing..." });
//     try {
//       const response = await axios.put(`${BASE_URL}/api/students/update-fees`, {
//         name: updateForm.name.toLowerCase().trim(),
//         fatherName: updateForm.fatherName,
//         additionalPaid: updateForm.paidAmount,
//         paymentMethod: updateForm.paymentMethod,
//         transactionId: updateForm.transactionId,
//       });
//       setUpdateStatus({
//         type: "success",
//         message: "Fees Updated & Synced successfully!",
//       });
//       setLastSubmittedData(response.data.data);
//       setUpdateForm({
//         rollno: "",
//         name: "",
//         fatherName: "",
//         course: "",
//         college: "",
//         dateOfEnrollment: "",
//         totalFee: "",
//         paidAmount: "",
//         courseduration: "",
//         paymentMethod: "cash",
//         transactionId: "",
//       });
//       setIsExisting(false);
//     } catch (error) {
//       setUpdateStatus({
//         type: "error",
//         message: error.response?.data?.message || "Operation failed.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const StatusBanner = ({ status }) =>
//     status.message ? (
//       <div
//         className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
//           status.type === "success"
//             ? "bg-green-100 text-green-800 border border-green-200"
//             : status.type === "error"
//               ? "bg-red-100 text-red-800 border border-red-200"
//               : status.type === "warning"
//                 ? "bg-amber-100 text-amber-800 border border-amber-200"
//                 : "bg-blue-100 text-blue-800 border border-blue-200"
//         }`}
//       >
//         <div
//           className={`w-2 h-2 rounded-full animate-pulse ${
//             status.type === "success"
//               ? "bg-green-500"
//               : status.type === "error"
//                 ? "bg-red-500"
//                 : "bg-blue-500"
//           }`}
//         />
//         {status.message}
//       </div>
//     ) : null;

//   return (
//     <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
//       <div className="max-w-2xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
//              ANSH InfoTech Fee Portal
//             </h1>
//             <p className="text-slate-500">
//               Manage student enrollments and payments
//             </p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
//           >
//             <LogOut size={18} /> Logout
//           </button>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
//           <div className="p-2 bg-slate-100 border-b border-slate-200">
//             <div className="relative flex bg-slate-200 rounded-xl p-1">
//               <div
//                 className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm transition-transform duration-300 ease-in-out ${activeTab === "update" ? "translate-x-full" : "translate-x-0"}`}
//                 style={{ width: "calc(50% - 4px)" }}
//               />
//               <button
//                 onClick={() => setActiveTab("add")}
//                 className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${activeTab === "add" ? "text-indigo-600" : "text-slate-500"}`}
//               >
//                 <UserPlus size={16} /> Add Student
//               </button>
//               <button
//                 onClick={() => setActiveTab("update")}
//                 className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${activeTab === "update" ? "text-amber-600" : "text-slate-500"}`}
//               >
//                 <CreditCard size={16} /> Update Fees
//               </button>
//             </div>
//           </div>

//           {/* ── ADD STUDENT TAB ── */}
//           {activeTab === "add" && (
//             <form onSubmit={handleAddSubmit} className="p-8 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <Hash size={16} className="text-slate-400" /> Roll Number*
//                   </label>
//                   <input
//                     type="number"
//                     name="rollno"
//                     placeholder="e.g. 1001"
//                     value={addForm.rollno}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <User size={16} className="text-slate-400" /> Student Name*
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     placeholder="Full Name"
//                     value={addForm.name}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <User size={16} className="text-slate-400" /> Father's Name*
//                   </label>
//                   <input
//                     type="text"
//                     name="fatherName"
//                     placeholder="Full Name"
//                     value={addForm.fatherName}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <BookOpen size={16} className="text-slate-400" /> Select
//                     Course*
//                   </label>
//                   <select
//                     name="course"
//                     value={showOtherInput ? "Other" : addForm.course}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
//                   >
//                     <option value="" disabled>
//                       Choose a course
//                     </option>
//                     {standardCourses.map((c) => (
//                       <option key={c} value={c}>
//                         {c}
//                       </option>
//                     ))}
//                     <option value="Other">Other (Type manually)</option>
//                   </select>
//                 </div>

//                 {showOtherInput && (
//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <Edit3 size={16} className="text-slate-400" /> Specify
//                       Course Name*
//                     </label>
//                     <input
//                       type="text"
//                       name="course"
//                       placeholder="Enter your course name"
//                       value={addForm.course}
//                       onChange={handleAddChange}
//                       required
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                     />
//                   </div>
//                 )}

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <BookOpen size={16} className="text-slate-400" /> Course
//                     Duration*
//                   </label>
//                   <select
//                     name="courseduration"
//                     value={addForm.courseduration}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
//                   >
//                     <option value="" disabled>
//                       Select Duration
//                     </option>
//                     <option value="6 weeks">6 weeks</option>
//                     <option value="3 months">3 months</option>
//                     <option value="4 months">4 months</option>
//                     <option value="6 months">6 months</option>
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <GraduationCap size={16} className="text-slate-400" />{" "}
//                     College*
//                   </label>
//                   <input
//                     type="text"
//                     name="college"
//                     placeholder="College Name"
//                     value={addForm.college}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <Calendar size={16} className="text-slate-400" /> Date of
//                     Enrollment*
//                   </label>
//                   <input
//                     type="date"
//                     name="dateOfEnrollment"
//                     value={addForm.dateOfEnrollment}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <DollarSign size={16} className="text-slate-400" /> Total
//                     Fee*
//                   </label>
//                   <input
//                     type="number"
//                     name="totalFee"
//                     placeholder="0.00"
//                     value={addForm.totalFee}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                     <DollarSign size={16} className="text-slate-400" /> Initial
//                     Payment*
//                   </label>
//                   <input
//                     type="number"
//                     name="paidAmount"
//                     placeholder="0.00"
//                     value={addForm.paidAmount}
//                     onChange={handleAddChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-green-50/50"
//                   />
//                 </div>

//                 {/* Payment Method + Transaction ID */}
//                 <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <PaymentMethodFields
//                     form={addForm}
//                     handleChange={handleAddChange}
//                   />
//                 </div>
//               </div>

//               <StatusBanner status={addStatus} />

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-4 rounded-xl font-bold text-white shadow-lg bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 transform active:scale-[0.98] transition-all flex justify-center items-center gap-2"
//               >
//                 {loading ? (
//                   <RefreshCw className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     <Save size={20} /> REGISTER & SYNC STUDENT
//                   </>
//                 )}
//               </button>
//             </form>
//           )}

//           {/* ── UPDATE FEES TAB ── */}
//           {activeTab === "update" && (
//             <div className="p-8 space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Search Student —{" "}
//                   <span className="font-normal text-slate-400">
//                     by name or roll number
//                   </span>
//                 </label>
//                 <div className="flex gap-3">
//                   <div className="relative flex-1">
//                     <Search
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                       size={18}
//                     />
//                     <input
//                       type="text"
//                       name="name"
//                       placeholder="Student name..."
//                       value={updateForm.name}
//                       onChange={handleUpdateChange}
//                       className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
//                     />
//                   </div>
//                   <div className="relative w-36">
//                     <Hash
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                       size={16}
//                     />
//                     <input
//                       type="number"
//                       name="rollno"
//                       placeholder="Roll no."
//                       value={updateForm.rollno}
//                       onChange={handleUpdateChange}
//                       className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
//                     />
//                   </div>
//                   <button
//                     onClick={handleFind}
//                     disabled={loading}
//                     className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
//                   >
//                     {loading ? (
//                       <RefreshCw className="animate-spin" size={18} />
//                     ) : (
//                       "Find"
//                     )}
//                   </button>
//                 </div>
//                 <p className="text-xs text-slate-400 mt-1.5">
//                   Fill either field — roll number takes priority if both are
//                   entered.
//                 </p>
//               </div>

//               <form onSubmit={handleUpdateSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <Hash size={16} className="text-slate-400" /> Roll Number
//                     </label>
//                     <input
//                       type="number"
//                       name="rollno"
//                       value={updateForm.rollno}
//                       disabled
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <User size={16} className="text-slate-400" /> Father's
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       name="fatherName"
//                       value={updateForm.fatherName}
//                       disabled
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <BookOpen size={16} className="text-slate-400" /> Course
//                     </label>
//                     <input
//                       type="text"
//                       name="course"
//                       value={updateForm.course}
//                       disabled
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <BookOpen size={16} className="text-slate-400" /> Course
//                       Duration
//                     </label>
//                     <input
//                       type="text"
//                       name="courseduration"
//                       value={updateForm.courseduration}
//                       disabled
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <GraduationCap size={16} className="text-slate-400" />{" "}
//                       College
//                     </label>
//                     <input
//                       type="text"
//                       name="college"
//                       value={updateForm.college}
//                       disabled
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <DollarSign size={16} className="text-slate-400" /> Total
//                       Fee
//                     </label>
//                     <input
//                       type="number"
//                       name="totalFee"
//                       value={updateForm.totalFee}
//                       disabled
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
//                     />
//                   </div>

//                   <div className="space-y-1 md:col-span-2">
//                     <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <DollarSign size={16} className="text-slate-400" />{" "}
//                       Additional Payment*
//                     </label>
//                     <input
//                       type="number"
//                       name="paidAmount"
//                       placeholder="0.00"
//                       value={updateForm.paidAmount}
//                       onChange={handleUpdateChange}
//                       required
//                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none transition-all bg-green-50/50"
//                     />
//                   </div>

//                   {/* Payment Method + Transaction ID */}
//                   <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <PaymentMethodFields
//                       form={updateForm}
//                       handleChange={handleUpdateChange}
//                     />
//                   </div>
//                 </div>

//                 <StatusBanner status={updateStatus} />

//                 <button
//                   type="submit"
//                   disabled={loading || !isExisting}
//                   className="w-full py-4 rounded-xl font-bold text-white shadow-lg bg-amber-500 hover:bg-amber-600 shadow-amber-200 transform active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
//                 >
//                   {loading ? (
//                     <RefreshCw className="animate-spin" size={20} />
//                   ) : (
//                     <>
//                       <RefreshCw size={20} /> UPDATE & SYNC RECORD
//                     </>
//                   )}
//                 </button>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>

//       <div>
//         <Dashboard />
//       </div>

//       {lastSubmittedData && (
//         <Receipt
//           data={lastSubmittedData}
//           onClose={() => setLastSubmittedData(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./Apipath";
import Receipt from "./Receipt";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";

import {
  Search,
  Banknote,
  Smartphone,
  BadgeIndianRupee,
  ScanQrCode,
  LogOut,
  User,
  BookOpen,
  GraduationCap,
  Calendar,
  DollarSign,
  Save,
  RefreshCw,
  Edit3,
  UserPlus,
  CreditCard,
  Hash,
  Wallet,
  ScanBarcode,
} from "lucide-react";

const PaymentMethodFields = ({ form, handleChange }) => (
  <>
    <div className="space-y-1">
      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <Wallet size={16} className="text-slate-400" /> Payment Method*
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() =>
            handleChange({ target: { name: "paymentMethod", value: "cash" } })
          }
          className={`flex-1 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            form.paymentMethod === "cash"
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-slate-200 text-slate-500 hover:border-slate-300"
          }`}
        >
          <BadgeIndianRupee size={18} />
          Cash
        </button>

        <button
          type="button"
          onClick={() =>
            handleChange({ target: { name: "paymentMethod", value: "upi" } })
          }
          className={`flex-1 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            form.paymentMethod === "upi"
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-slate-200 text-slate-500 hover:border-slate-300"
          }`}
        >
          <ScanQrCode size={18} />
          UPI
        </button>
      </div>
    </div>

    {form.paymentMethod === "upi" && (
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <ScanBarcode size={16} className="text-slate-400" /> UPI Transaction ID*
        </label>
        <input
          type="text"
          name="transactionId"
          placeholder="e.g. TXN123456789"
          value={form.transactionId}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-indigo-50/30"
        />
      </div>
    )}
  </>
);

const App = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("add");

  const standardCourses = [
    "Web Development",
    "AI/ML",
    "Cybersecurity",
    "App Development",
    "Digital Marketing",
  ];

  const [addForm, setAddForm] = useState({
    rollno: "",
    name: "",
    fatherName: "",
    course: "",
    college: "",
    dateOfEnrollment: "",
    totalFee: "",
    paidAmount: "",
    courseduration: "",
    paymentMethod: "cash",
    transactionId: "",
  });

  const [updateForm, setUpdateForm] = useState({
    rollno: "",
    name: "",
    fatherName: "",
    course: "",
    college: "",
    dateOfEnrollment: "",
    totalFee: "",
    paidAmount: "",
    courseduration: "",
    paymentMethod: "cash",
    transactionId: "",
  });

  const [addStatus, setAddStatus] = useState({ type: "", message: "" });
  const [updateStatus, setUpdateStatus] = useState({ type: "", message: "" });
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [isExisting, setIsExisting] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/adminlogin/getcookie`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) console.log("Authenticated");
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/adminlogin/logoutadmin`,
        {},
        { withCredentials: true },
      );
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddChange = (e) => {
    const { name, value, tagName } = e.target;
    if (name === "course" && tagName === "SELECT") {
      if (value === "Other") {
        setShowOtherInput(true);
        setAddForm((prev) => ({ ...prev, course: "" }));
      } else {
        setShowOtherInput(false);
        setAddForm((prev) => ({ ...prev, course: value }));
      }
    } else {
      setAddForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAddStatus({ type: "info", message: "Processing..." });
    try {
      const response = await axios.post(
        `${BASE_URL}/api/students/add`,
        addForm,
      );

      // ✅ Merge the form's payment info (not in DB response) into the receipt data
      setLastSubmittedData({
        ...response.data.data,
        lastPaid: Number(addForm.paidAmount), // amount paid THIS transaction
        paymentMethod: addForm.paymentMethod,
        transactionId: addForm.transactionId,
      });

      setAddStatus({
        type: "success",
        message: "New Student Added & Synced successfully!",
      });
      setAddForm({
        rollno: "",
        name: "",
        fatherName: "",
        course: "",
        college: "",
        dateOfEnrollment: "",
        totalFee: "",
        paidAmount: "",
        courseduration: "",
        paymentMethod: "cash",
        transactionId: "",
      });
      setShowOtherInput(false);
    } catch (error) {
      setAddStatus({
        type: "error",
        message: error.response?.data?.message || "Operation failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFind = async () => {
    const hasRollno = updateForm.rollno.toString().trim() !== "";
    const hasName = updateForm.name.trim() !== "";

    if (!hasRollno && !hasName) {
      return setUpdateStatus({
        type: "error",
        message: "Please enter a name or roll number to search.",
      });
    }

    setLoading(true);
    setUpdateStatus({ type: "info", message: "Searching database..." });
    setLastSubmittedData(null);

    try {
      const query = hasRollno
        ? `rollno=${updateForm.rollno.toString().trim()}`
        : `name=${updateForm.name.toLowerCase().trim()}`;

      const response = await axios.get(
        `${BASE_URL}/api/students/find?${query}`,
      );
      const fetchedCourse = response.data.course;

      setUpdateForm({
        rollno: response.data.rollno || "",
        name: response.data.name,
        fatherName: response.data.fatherName,
        course: fetchedCourse,
        college: response.data.college || "",
        dateOfEnrollment: response.data.dateOfEnrollment || "",
        totalFee: response.data.totalFee,
        paidAmount: "",
        courseduration: response.data.courseduration || "",
        paymentMethod: "cash",
        transactionId: "",
      });

      setIsExisting(true);
      setUpdateStatus({
        type: "success",
        message: `Found: ${response.data.name}. You can now update fees.`,
      });
    } catch (error) {
      setIsExisting(false);
      setUpdateStatus({ type: "warning", message: "Student not found." });
      setUpdateForm((prev) => ({
        ...prev,
        fatherName: "",
        course: "",
        college: "",
        dateOfEnrollment: "",
        totalFee: "",
        paidAmount: "",
        courseduration: "",
        paymentMethod: "cash",
        transactionId: "",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!isExisting)
      return setUpdateStatus({
        type: "error",
        message: "Please find a student first.",
      });

    setLoading(true);
    setUpdateStatus({ type: "info", message: "Processing..." });
    try {
      const response = await axios.put(`${BASE_URL}/api/students/update-fees`, {
        name: updateForm.name.toLowerCase().trim(),
        fatherName: updateForm.fatherName,
        additionalPaid: updateForm.paidAmount,
        paymentMethod: updateForm.paymentMethod,
        transactionId: updateForm.transactionId,
      });

      // ✅ Merge the form's payment info (not in DB response) into the receipt data
      setLastSubmittedData({
        ...response.data.data,
        lastPaid: Number(updateForm.paidAmount), // amount paid THIS transaction
        paymentMethod: updateForm.paymentMethod,
        transactionId: updateForm.transactionId,
      });

      setUpdateStatus({
        type: "success",
        message: "Fees Updated & Synced successfully!",
      });
      setUpdateForm({
        rollno: "",
        name: "",
        fatherName: "",
        course: "",
        college: "",
        dateOfEnrollment: "",
        totalFee: "",
        paidAmount: "",
        courseduration: "",
        paymentMethod: "cash",
        transactionId: "",
      });
      setIsExisting(false);
    } catch (error) {
      setUpdateStatus({
        type: "error",
        message: error.response?.data?.message || "Operation failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const StatusBanner = ({ status }) =>
    status.message ? (
      <div
        className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
          status.type === "success"
            ? "bg-green-100 text-green-800 border border-green-200"
            : status.type === "error"
              ? "bg-red-100 text-red-800 border border-red-200"
              : status.type === "warning"
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : "bg-blue-100 text-blue-800 border border-blue-200"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full animate-pulse ${
            status.type === "success"
              ? "bg-green-500"
              : status.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
          }`}
        />
        {status.message}
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              ANSH InfoTech Fee Portal
            </h1>
            <p className="text-slate-500">
              Manage student enrollments and payments
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-2 bg-slate-100 border-b border-slate-200">
            <div className="relative flex bg-slate-200 rounded-xl p-1">
              <div
                className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm transition-transform duration-300 ease-in-out ${
                  activeTab === "update" ? "translate-x-full" : "translate-x-0"
                }`}
                style={{ width: "calc(50% - 4px)" }}
              />
              <button
                onClick={() => setActiveTab("add")}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${
                  activeTab === "add" ? "text-indigo-600" : "text-slate-500"
                }`}
              >
                <UserPlus size={16} /> Add Student
              </button>
              <button
                onClick={() => setActiveTab("update")}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${
                  activeTab === "update" ? "text-amber-600" : "text-slate-500"
                }`}
              >
                <CreditCard size={16} /> Update Fees
              </button>
            </div>
          </div>

          {/* ── ADD STUDENT TAB ── */}
          {activeTab === "add" && (
            <form onSubmit={handleAddSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Hash size={16} className="text-slate-400" /> Roll Number*
                  </label>
                  <input
                    type="number"
                    name="rollno"
                    placeholder="e.g. 1001"
                    value={addForm.rollno}
                    onChange={handleAddChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <User size={16} className="text-slate-400" /> Student Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={addForm.name}
                    onChange={handleAddChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <User size={16} className="text-slate-400" /> Father's Name*
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    placeholder="Full Name"
                    value={addForm.fatherName}
                    onChange={handleAddChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <BookOpen size={16} className="text-slate-400" /> Select
                    Course*
                  </label>
                  <select
                    name="course"
                    value={showOtherInput ? "Other" : addForm.course}
                    onChange={handleAddChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                  >
                    <option value="" disabled>
                      Choose a course
                    </option>
                    {standardCourses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Other">Other (Type manually)</option>
                  </select>
                </div>

                {showOtherInput && (
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Edit3 size={16} className="text-slate-400" /> Specify
                      Course Name*
                    </label>
                    <input
                      type="text"
                      name="course"
                      placeholder="Enter your course name"
                      value={addForm.course}
                      onChange={handleAddChange}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <BookOpen size={16} className="text-slate-400" /> Course
                    Duration*
                  </label>
                  <select
                    name="courseduration"
                    value={addForm.courseduration}
                    onChange={handleAddChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                  >
                    <option value="" disabled>
                      Select Duration
                    </option>
                    <option value="6 weeks">6 weeks</option>
                    <option value="3 months">3 months</option>
                    <option value="4 months">4 months</option>
                    <option value="6 months">6 months</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <GraduationCap size={16} className="text-slate-400" />{" "}
                    College*
                  </label>
                  <input
                    type="text"
                    name="college"
                    placeholder="College Name"
                    value={addForm.college}
                    onChange={handleAddChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" /> Date of
                    Enrollment*
                  </label>
                  <input
                    type="date"
                    name="dateOfEnrollment"
                    value={addForm.dateOfEnrollment}
                    onChange={handleAddChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <DollarSign size={16} className="text-slate-400" /> Total
                    Fee*
                  </label>
                  <input
                    type="number"
                    name="totalFee"
                    placeholder="0.00"
                    value={addForm.totalFee}
                    onChange={handleAddChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <DollarSign size={16} className="text-slate-400" /> Initial
                    Payment*
                  </label>
                  <input
                    type="number"
                    name="paidAmount"
                    placeholder="0.00"
                    value={addForm.paidAmount}
                    onChange={handleAddChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-green-50/50"
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PaymentMethodFields
                    form={addForm}
                    handleChange={handleAddChange}
                  />
                </div>
              </div>

              <StatusBanner status={addStatus} />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white shadow-lg bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 transform active:scale-[0.98] transition-all flex justify-center items-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={20} /> REGISTER & SYNC STUDENT
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── UPDATE FEES TAB ── */}
          {activeTab === "update" && (
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Search Student —{" "}
                  <span className="font-normal text-slate-400">
                    by name or roll number
                  </span>
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="Student name..."
                      value={updateForm.name}
                      onChange={handleUpdateChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                    />
                  </div>
                  <div className="relative w-36">
                    <Hash
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="number"
                      name="rollno"
                      placeholder="Roll no."
                      value={updateForm.rollno}
                      onChange={handleUpdateChange}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={handleFind}
                    disabled={loading}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="animate-spin" size={18} />
                    ) : (
                      "Find"
                    )}
                  </button>
                </div>
                
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Hash size={16} className="text-slate-400" /> Roll Number
                    </label>
                    <input
                      type="number"
                      name="rollno"
                      value={updateForm.rollno}
                      disabled
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <User size={16} className="text-slate-400" /> Father's
                      Name
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={updateForm.fatherName}
                      disabled
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <BookOpen size={16} className="text-slate-400" /> Course
                    </label>
                    <input
                      type="text"
                      name="course"
                      value={updateForm.course}
                      disabled
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <BookOpen size={16} className="text-slate-400" /> Course
                      Duration
                    </label>
                    <input
                      type="text"
                      name="courseduration"
                      value={updateForm.courseduration}
                      disabled
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <GraduationCap size={16} className="text-slate-400" />{" "}
                      College
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={updateForm.college}
                      disabled
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <DollarSign size={16} className="text-slate-400" /> Total
                      Fee
                    </label>
                    <input
                      type="number"
                      name="totalFee"
                      value={updateForm.totalFee}
                      disabled
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <DollarSign size={16} className="text-slate-400" />{" "}
                      Additional Payment*
                    </label>
                    <input
                      type="number"
                      name="paidAmount"
                      placeholder="0.00"
                      value={updateForm.paidAmount}
                      onChange={handleUpdateChange}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none transition-all bg-green-50/50"
                    />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PaymentMethodFields
                      form={updateForm}
                      handleChange={handleUpdateChange}
                    />
                  </div>
                </div>

                <StatusBanner status={updateStatus} />

                <button
                  type="submit"
                  disabled={loading || !isExisting}
                  className="w-full py-4 rounded-xl font-bold text-white shadow-lg bg-amber-500 hover:bg-amber-600 shadow-amber-200 transform active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <>
                      <RefreshCw size={20} /> UPDATE & SYNC RECORD
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div>
        <Dashboard />
      </div>

      {lastSubmittedData && (
        <Receipt
          data={lastSubmittedData}
          onClose={() => setLastSubmittedData(null)}
        />
      )}
    </div>
  );
};

export default App;