// import React, { useRef, useMemo } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { Download, X, CheckCircle } from "lucide-react";
// // Import your logo from assets
// import signatureLogo from "../public/logo4.png";

// const Receipt = ({ data, onClose }) => {
//   const receiptRef = useRef(null);

//   if (!data) return null;

//   const receiptNumber = useMemo(
//     () => `REC-${Math.floor(100000 + Math.random() * 900000)}`,
//     [],
//   );

//   const today = new Date().toLocaleDateString("en-IN", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   const handleDownloadPdf = async () => {
//     const element = receiptRef.current;

//     const canvas = await html2canvas(element, {
//       scale: 3,
//       useCORS: true,
//       logging: false,
//       backgroundColor: "#ffffff",
//     });

//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();

//     const imgWidth = canvas.width;
//     const imgHeight = canvas.height;
//     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

//     const finalWidth = imgWidth * ratio;
//     const finalHeight = imgHeight * ratio;

//     const xOffset = (pdfWidth - finalWidth) / 2;

//     pdf.addImage(imgData, "PNG", xOffset, 0, finalWidth, finalHeight);
//     pdf.save(`Receipt_${data.name}.pdf`);
//   };

//   const theme = {
//     primary: "#4f46e5",
//     dark: "#111827",
//     text: "#374151",
//     lightText: "#6b7280",
//     border: "#e5e7eb",
//     bg: "#f9fafb",
//     white: "#ffffff",
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 overflow-y-auto">
//       <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col my-8">
//         <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
//           <div className="flex items-center gap-3">
//             <div className="bg-green-100 p-2 rounded-full">
//               <CheckCircle size={20} className="text-green-600" />
//             </div>
//             <div>
//               <h3 className="font-bold text-slate-800 leading-none">
//                 Receipt Ready
//               </h3>
//               <p className="text-xs text-slate-500 mt-1">
//                 Ready for download or print
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={handleDownloadPdf}
//               className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95"
//             >
//               <Download size={18} /> Download PDF
//             </button>
//             <button
//               onClick={onClose}
//               className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
//             >
//               <X size={24} />
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto bg-white p-2">
//           <div
//             ref={receiptRef}
//             style={{
//               width: "210mm",
//               minHeight: "290mm",
//               padding: "20mm",
//               backgroundColor: theme.white,
//               margin: "0 auto",
//               fontFamily: "'Helvetica', sans-serif",
//             }}
//           >
//             {/* Header */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "flex-start",
//                 marginBottom: "60px",
//               }}
//             >
//               <div>
//                 <h1
//                   style={{
//                     fontSize: "32px",
//                     fontWeight: "bold",
//                     color: theme.primary,
//                     letterSpacing: "-1px",
//                     margin: 0,
//                   }}
//                 >
//                   ANSH {" "}<span style={{ color: theme.dark }}>INFOTECH</span>
//                 </h1>
//                 <p
//                   style={{
//                     fontSize: "12px",
//                     color: theme.lightText,
//                     marginTop: "5px",
//                     textTransform: "uppercase",
//                     letterSpacing: "2px",
//                   }}
//                 >
//                   Educational Excellence Receipt
//                 </p>
//               </div>
//               <div style={{ textAlign: "right" }}>
//                 <h2
//                   style={{
//                     fontSize: "18px",
//                     fontWeight: "bold",
//                     color: theme.dark,
//                     margin: 0,
//                   }}
//                 >
//                   INVOICE
//                 </h2>
//                 <p
//                   style={{
//                     fontSize: "14px",
//                     color: theme.lightText,
//                     margin: "5px 0",
//                   }}
//                 >
//                   #{receiptNumber}
//                 </p>
//                 <p
//                   style={{
//                     fontSize: "14px",
//                     color: theme.lightText,
//                     margin: 0,
//                   }}
//                 >
//                   {today}
//                 </p>
//               </div>
//             </div>

//             {/* Info Grid */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "40px",
//                 marginBottom: "60px",
//                 paddingBottom: "30px",
//                 borderBottom: `1px solid ${theme.border}`,
//               }}
//             >
//               <div>
//                 <p
//                   style={{
//                     fontSize: "11px",
//                     fontWeight: "bold",
//                     color: theme.primary,
//                     textTransform: "uppercase",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   Student Details
//                 </p>
//                 <h3
//                   style={{
//                     fontSize: "20px",
//                     fontWeight: "bold",
//                     color: theme.dark,
//                     margin: 0,
//                   }}
//                 >
//                   {data.name}
//                 </h3>
//                 <p
//                   style={{
//                     fontSize: "15px",
//                     color: theme.text,
//                     marginTop: "5px",
//                   }}
//                 >
//                   Father's Name: {data.fatherName}
//                 </p>
//                 <p style={{ fontSize: "15px", color: theme.text }}>
//                   College: {data.college}
//                 </p>
//               </div>
//               <div style={{ textAlign: "right" }}>
//                 <p
//                   style={{
//                     fontSize: "11px",
//                     fontWeight: "bold",
//                     color: theme.primary,
//                     textTransform: "uppercase",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   Course Details
//                 </p>
//                 <h3
//                   style={{
//                     fontSize: "20px",
//                     fontWeight: "bold",
//                     color: theme.dark,
//                     margin: 0,
//                   }}
//                 >
//                   {data.course}
//                 </h3>
//                 <p
//                   style={{
//                     fontSize: "15px",
//                     color: theme.text,
//                     marginTop: "5px",
//                   }}
//                 >
//                   Enrollment: {data.dateOfEnrollment}
//                 </p>
//               </div>
//             </div>

//             {/* Fee Table */}
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 marginBottom: "40px",
//               }}
//             >
//               <thead>
//                 <tr style={{ backgroundColor: theme.bg }}>
//                   <th
//                     style={{
//                       padding: "15px",
//                       textAlign: "left",
//                       fontSize: "12px",
//                       color: theme.lightText,
//                       textTransform: "uppercase",
//                       borderBottom: `2px solid ${theme.dark}`,
//                     }}
//                   >
//                     Description
//                   </th>
//                   <th
//                     style={{
//                       padding: "15px",
//                       textAlign: "right",
//                       fontSize: "12px",
//                       color: theme.lightText,
//                       textTransform: "uppercase",
//                       borderBottom: `2px solid ${theme.dark}`,
//                     }}
//                   >
//                     Amount
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td
//                     style={{
//                       padding: "25px 15px",
//                       fontSize: "15px",
//                       color: theme.dark,
//                       borderBottom: `1px solid ${theme.border}`,
//                     }}
//                   >
//                     Course Tuition & Registration Fee
//                   </td>
//                   <td
//                     style={{
//                       padding: "25px 15px",
//                       textAlign: "right",
//                       fontSize: "15px",
//                       fontWeight: "bold",
//                       color: theme.dark,
//                       borderBottom: `1px solid ${theme.border}`,
//                     }}
//                   >
//                     ₹{Number(data.totalFee).toLocaleString("en-IN")}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td
//                     style={{
//                       padding: "25px 15px",
//                       fontSize: "15px",
//                       color: theme.primary,
//                       fontWeight: "600",
//                       borderBottom: `1px solid ${theme.border}`,
//                     }}
//                   >
//                     Total Paid (up to date)
//                   </td>
//                   <td
//                     style={{
//                       padding: "25px 15px",
//                       textAlign: "right",
//                       fontSize: "15px",
//                       fontWeight: "bold",
//                       color: theme.primary,
//                       borderBottom: `1px solid ${theme.border}`,
//                     }}
//                   >
//                     - ₹{Number(data.paidAmount).toLocaleString("en-IN")}
//                   </td>
//                 </tr>
//                 <tr style={{ backgroundColor: theme.bg }}>
//                   <td
//                     style={{
//                       padding: "25px 15px",
//                       fontSize: "18px",
//                       fontWeight: "bold",
//                       color: theme.dark,
//                     }}
//                   >
//                     Balance Amount
//                   </td>
//                   <td
//                     style={{
//                       padding: "25px 15px",
//                       textAlign: "right",
//                       fontSize: "24px",
//                       fontWeight: "900",
//                       color: theme.primary,
//                     }}
//                   >
//                     ₹{(data.totalFee - data.paidAmount).toLocaleString("en-IN")}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* Status Stamp and Authority Signature Section */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "flex-end",
//                 marginTop: "100px",
//               }}
//             >
//               <div
//                 style={{
//                   border: `3px solid ${theme.primary}`,
//                   padding: "10px 20px",
//                   borderRadius: "8px",
//                   transform: "rotate(-10deg)",
//                   opacity: 0.6,
//                 }}
//               >
//                 <p
//                   style={{
//                     color: theme.primary,
//                     fontWeight: "900",
//                     fontSize: "20px",
//                     margin: 0,
//                   }}
//                 >
//                   PAID & VERIFIED
//                 </p>
//               </div>

//               <div style={{ textAlign: "center" }}>
//                 {/* LOGO ADDED HERE */}
//                 <img
//                   src={signatureLogo}
//                   alt="Authority Logo"
//                   style={{
//                     width: "120px",
//                     height: "auto",
//                     marginBottom: "5px",
//                     display: "block",
//                     margin: "0 auto",
//                   }}
//                 />
//                 <div
//                   style={{
//                     width: "180px",
//                     height: "1px",
//                     backgroundColor: theme.dark,
//                     marginBottom: "10px",
//                   }}
//                 ></div>
//                 <p
//                   style={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     color: theme.dark,
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Authorized Signatory
//                 </p>
//               </div>
//             </div>

//             {/* Footer */}
//             <div style={{ marginTop: "auto", paddingTop: "80px" }}>
//               <p
//                 style={{
//                   fontSize: "10px",
//                   color: theme.lightText,
//                   textAlign: "center",
//                   lineHeight: "1.6",
//                 }}
//               >
//                 1. This is a computer generated receipt and does not require a
//                 physical signature.
//                 <br />
//                 2. Fees once paid are non-refundable and non-transferable under
//                 any circumstances.
//                 <br />
//                 3. Please keep this receipt safe for future reference regarding
//                 your course enrollment.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
//           <button
//             onClick={handleDownloadPdf}
//             className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
//           >
//             <Download size={20} /> Save as PDF
//           </button>
//           <button
//             onClick={onClose}
//             className="flex-1 py-4 bg-white text-slate-600 font-bold border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"
//           >
//             Close Portal
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Receipt;



import React, { useRef, useMemo, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, X, CheckCircle } from "lucide-react";
import signatureLogo from "../public/logo4.png";

const Receipt = ({ data, onClose }) => {
  const receiptRef = useRef(null);

  if (!data) return null;

  const receiptNumber = useMemo(
    () => `REC-${Math.floor(100000 + Math.random() * 900000)}`,
    [],
  );

  const today = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownloadPdf = async () => {
    const element = receiptRef.current;

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;
    const xOffset = (pdfWidth - finalWidth) / 2;

    pdf.addImage(imgData, "PNG", xOffset, 0, finalWidth, finalHeight);
    pdf.save(`Receipt_${data.name}.pdf`);
  };

  // ── Auto-download on mount ──────────────────────────────────────
  useEffect(() => {
    // Small delay so the DOM is fully painted before capture
    const timer = setTimeout(() => {
      handleDownloadPdf();
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = {
    primary: "#4f46e5",
    dark: "#111827",
    text: "#374151",
    lightText: "#6b7280",
    border: "#e5e7eb",
    bg: "#f9fafb",
    white: "#ffffff",
    green: "#16a34a",
  };

  // ── Derived values ──────────────────────────────────────────────
  // currentPaid  = the amount paid in THIS transaction
  // paidAmount   = total paid so far (cumulative, from DB)
  const currentPaid = Number(data.lastPaid ?? data.currentPaid ?? 0);
  const totalPaid = Number(data.paidAmount ?? 0);
  const totalFee = Number(data.totalFee ?? 0);
  const balance = totalFee - totalPaid;

  const paymentMethod = data.paymentMethod ?? "cash";
  const transactionId = data.transactionId ?? null;

  const methodLabel =
    paymentMethod === "upi"
      ? `UPI${transactionId ? ` — TXN: ${transactionId}` : ""}`
      : "Cash";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col my-8">
        {/* ── Modal Header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-none">
                Receipt Ready
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Downloading automatically…
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95"
            >
              <Download size={18} /> Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* ── Receipt Body ──────────────────────────────────────── */}
        <div className="overflow-x-auto bg-white p-2">
          <div
            ref={receiptRef}
            style={{
              width: "210mm",
              minHeight: "290mm",
              padding: "20mm",
              backgroundColor: theme.white,
              margin: "0 auto",
              fontFamily: "'Helvetica', sans-serif",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "60px",
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: theme.primary,
                    letterSpacing: "-1px",
                    margin: 0,
                  }}
                >
                  ANSH <span style={{ color: theme.dark }}>INFOTECH</span>
                </h1>
                <p
                  style={{
                    fontSize: "12px",
                    color: theme.lightText,
                    marginTop: "5px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Educational Excellence Receipt
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: theme.dark,
                    margin: 0,
                  }}
                >
                  INVOICE
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: theme.lightText,
                    margin: "5px 0",
                  }}
                >
                  #{receiptNumber}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: theme.lightText,
                    margin: 0,
                  }}
                >
                  {today}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "40px",
                marginBottom: "60px",
                paddingBottom: "30px",
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: theme.primary,
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Student Details
                </p>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: theme.dark,
                    margin: 0,
                    textTransform: "capitalize",
                  }}
                >
                  {data.name}
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    color: theme.text,
                    marginTop: "5px",
                  }}
                >
                  Father's Name:{" "}
                  <span style={{ textTransform: "capitalize" }}>
                    {data.fatherName}
                  </span>
                </p>
                <p style={{ fontSize: "15px", color: theme.text }}>
                  College: {data.college}
                </p>
                {/* <p style={{ fontSize: "15px", color: theme.text }}>
                  Roll No: {data.rollno ?? "—"}
                </p> */}
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: theme.primary,
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Course Details
                </p>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: theme.dark,
                    margin: 0,
                  }}
                >
                  {data.course}
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    color: theme.text,
                    marginTop: "5px",
                  }}
                >
                  Duration: {data.courseduration ?? "—"}
                </p>
                <p style={{ fontSize: "15px", color: theme.text }}>
                  Enrollment: {data.dateOfEnrollment ?? "—"}
                </p>
              </div>
            </div>

            {/* Fee Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "40px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: theme.bg }}>
                  <th
                    style={{
                      padding: "15px",
                      textAlign: "left",
                      fontSize: "12px",
                      color: theme.lightText,
                      textTransform: "uppercase",
                      borderBottom: `2px solid ${theme.dark}`,
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      textAlign: "right",
                      fontSize: "12px",
                      color: theme.lightText,
                      textTransform: "uppercase",
                      borderBottom: `2px solid ${theme.dark}`,
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1 — Total course fee */}
                <tr>
                  <td
                    style={{
                      padding: "20px 15px",
                      fontSize: "15px",
                      color: theme.dark,
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    Course Tuition &amp; Registration Fee
                  </td>
                  <td
                    style={{
                      padding: "20px 15px",
                      textAlign: "right",
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: theme.dark,
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    ₹{totalFee.toLocaleString("en-IN")}
                  </td>
                </tr>

                {/* Row 2 — Current transaction (THIS payment) */}
                <tr style={{ backgroundColor: "#f0fdf4" }}>
                  <td
                    style={{
                      padding: "20px 15px",
                      fontSize: "15px",
                      color: theme.green,
                      fontWeight: "700",
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    <div>Amount Paid Now</div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        color: theme.lightText,
                        marginTop: "3px",
                      }}
                    >
                      Payment Mode: {methodLabel}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "20px 15px",
                      textAlign: "right",
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: theme.green,
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    ₹{currentPaid.toLocaleString("en-IN")}
                  </td>
                </tr>

                {/* Row 3 — Total paid so far (cumulative) */}
                <tr>
                  <td
                    style={{
                      padding: "20px 15px",
                      fontSize: "15px",
                      color: theme.primary,
                      fontWeight: "600",
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    Total Paid (cumulative)
                  </td>
                  <td
                    style={{
                      padding: "20px 15px",
                      textAlign: "right",
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: theme.primary,
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    ₹{totalPaid.toLocaleString("en-IN")}
                  </td>
                </tr>

                {/* Row 4 — Balance */}
                <tr style={{ backgroundColor: theme.bg }}>
                  <td
                    style={{
                      padding: "20px 15px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: theme.dark,
                    }}
                  >
                    Balance Due
                  </td>
                  <td
                    style={{
                      padding: "20px 15px",
                      textAlign: "right",
                      fontSize: "24px",
                      fontWeight: "900",
                      color: balance <= 0 ? theme.green : theme.primary,
                    }}
                  >
                    {balance <= 0
                      ? "FULLY PAID"
                      : `₹${balance.toLocaleString("en-IN")}`}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Status Stamp + Signature */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: "80px",
              }}
            >
              <div
                style={{
                  border: `3px solid ${theme.green}`,
                  padding: "10px 20px",
                  borderRadius: "8px",
                  transform: "rotate(-10deg)",
                  opacity: 0.65,
                }}
              >
                <p
                  style={{
                    color: theme.green,
                    fontWeight: "900",
                    fontSize: "20px",
                    margin: 0,
                  }}
                >
                  PAID & VERIFIED
                </p>
              </div>

              <div style={{ textAlign: "center" }}>
                <img
                  src={signatureLogo}
                  alt="Authority Logo"
                  style={{
                    width: "120px",
                    height: "auto",
                    display: "block",
                    margin: "0 auto 5px",
                  }}
                />
                <div
                  style={{
                    width: "180px",
                    height: "1px",
                    backgroundColor: theme.dark,
                    marginBottom: "10px",
                  }}
                />
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: theme.dark,
                    textTransform: "uppercase",
                  }}
                >
                  Authorized Signatory
                </p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ paddingTop: "60px" }}>
              <p
                style={{
                  fontSize: "10px",
                  color: theme.lightText,
                  textAlign: "center",
                  lineHeight: "1.6",
                }}
              >
                1. This is a computer generated receipt and does not require a
                physical signature.
                <br />
                2. Fees once paid are non-refundable and non-transferable under
                any circumstances.
                <br />
                3. Please keep this receipt safe for future reference regarding
                your course enrollment.
              </p>
            </div>
          </div>
        </div>

        {/* ── Modal Footer ─────────────────────────────────────── */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button
            onClick={handleDownloadPdf}
            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <Download size={20} /> Save as PDF
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-white text-slate-600 font-bold border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;