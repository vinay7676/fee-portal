// import Student from "../model/studentform.js";
// import { GoogleSpreadsheet } from "google-spreadsheet";
// import { JWT } from "google-auth-library";
// import dotenv from "dotenv";
// dotenv.config();

// // --- HELPER: Get today's date as DD/MM/YYYY ---
// const getTodayDate = () => {
//   const today = new Date();
//   return today.toLocaleDateString("en-GB"); // DD/MM/YYYY
// };

// // --- HELPER: Internal Sync Logic ---
// const performSheetSync = async () => {
//   const serviceAccountAuth = new JWT({
//     email: process.env.GOOGLE_CLIENT_EMAIL,
//     key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//   });

//   const doc = new GoogleSpreadsheet(
//     process.env.GOOGLE_SHEET_ID,
//     serviceAccountAuth,
//   );
//   await doc.loadInfo();
//   const sheet = doc.sheetsByIndex[0];

//   const students = await Student.find({});

//   // Find the max number of payments any student has made
//   const maxPayments = students.reduce((max, s) => {
//     return Math.max(max, s.paymentHistory.length);
//   }, 0);

//   // Build dynamic payment headers: Payment 1, Date 1, Payment 2, Date 2, ...
//   const paymentHeaders = [];
//   for (let i = 1; i <= maxPayments; i++) {
//     paymentHeaders.push(`Payment ${i}`, `Payment ${i} Date`);
//   }

//   const baseHeaders = [
//     "Roll No",
//     "Name",
//     "Father Name",
//     "Course",
//     "College",
//     "Date of Enrollment",
//     "Course Duration",
//     "Total Fee",
//     "Paid",
//     "Pending Dues",
//   ];

//   const allHeaders = [...baseHeaders, ...paymentHeaders];

//   // Build rows
//   const rows = students.map((s) => {
//     const base = {
//       "Roll No": s.rollno,
//       Name: s.name,
//       "Father Name": s.fatherName,
//       Course: s.course,
//       College: s.college,
//       "Date of Enrollment": s.dateOfEnrollment,
//       "Course Duration": s.courseduration,
//       "Total Fee": s.totalFee,
//       Paid: s.paidAmount,
//       "Pending Dues": s.pendingDues,
//     };

//     // Add each payment and its date as separate columns
//     s.paymentHistory.forEach((payment, index) => {
//       base[`Payment ${index + 1}`] = payment.amount;
//       base[`Payment ${index + 1} Date`] = payment.date;
//     });

//     return base;
//   });

//   await sheet.clear();
//   await sheet.setHeaderRow(allHeaders);
//   if (rows.length > 0) await sheet.addRows(rows);
// };

// // --- FIND STUDENT ---
// export const findStudent = async (req, res) => {
//   try {
//     const { name, rollno } = req.query;
//     const conditions = [];

//     if (name) conditions.push({ name: { $regex: `^${name}$`, $options: "i" } });
//     if (rollno) conditions.push({ rollno: Number(rollno) });

//     if (conditions.length === 0) {
//       return res.status(400).json({ message: "Please provide name or rollno" });
//     }

//     const student = await Student.findOne({ $or: conditions });

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     res.status(200).json(student);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // --- ADD STUDENT (with initial payment recording) ---
// export const addStudent = async (req, res) => {
//   try {
//     const {
//       name,
//       fatherName,
//       course,
//       college,
//       dateOfEnrollment,
//       totalFee,
//       paidAmount,
//       courseduration,
//       rollno,
//       paymentNote, // optional note for the initial payment
//     } = req.body;

//     const normalizedName = name.toLowerCase().trim();
//     const normalizedFatherName = fatherName.toLowerCase().trim();

//     const existingStudent = await Student.findOne({
//       name: normalizedName,
//       fatherName: normalizedFatherName,
//     });

//     if (existingStudent) {
//       return res.status(400).json({
//         message: "Student with same Name & Father Name already exists ❌",
//       });
//     }

//     // Build initial payment history only if paidAmount > 0
//     const paymentHistory = [];
//     const paid = Number(paidAmount);

//     if (paid > 0) {
//       paymentHistory.push({
//         amount: paid,
//         date: getTodayDate(),
//         note: paymentNote || "Initial payment",
//       });
//     }

//     const newStudent = new Student({
//       name: normalizedName,
//       fatherName: normalizedFatherName,
//       course,
//       college,
//       dateOfEnrollment,
//       totalFee: Number(totalFee),
//       paidAmount: paid,
//       courseduration,
//       rollno: Number(rollno),
//       paymentHistory,
//     });

//     await newStudent.save();
//     await performSheetSync();

//     res.status(201).json({
//       message: "New Student Added & Synced! ✅",
//       data: newStudent,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // --- UPDATE FEES (records each payment with date) ---
// export const updateFees = async (req, res) => {
//   try {
//     const { name, fatherName, additionalPaid, paymentNote } = req.body;

//     const student = await Student.findOne({ name, fatherName });

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     const amount = Number(additionalPaid);

//     if (student.pendingDues === 0) {
//       return res.status(400).json({ message: "Pending fees is already 0" });
//     }

//     if (amount > student.pendingDues) {
//       return res.status(400).json({
//         message: `Amount ₹${amount} is greater than pending dues ₹${student.pendingDues}`,
//       });
//     }

//     // Update totals
//     student.paidAmount += amount;

//     // Record this payment in history
//     student.paymentHistory.push({
//       amount,
//       date: getTodayDate(),
//       note: paymentNote || "",
//     });

//     await student.save();
//     await performSheetSync();

//     res.status(200).json({
//       message: `Payment of ₹${amount} recorded & Synced! ✅`,
//       data: student,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // --- MANUAL SYNC ---
// export const syncToSheets = async (req, res) => {
//   try {
//     await performSheetSync();
//     res.status(200).json({ message: "Google Sheet Sync Complete!" });
//   } catch (error) {
//     res.status(500).json({ error: "Sync Failed" });
//   }
// };

// // studentcontroller.js
// export const getAllStudents = async (req, res) => {
//   try {
//     const students = await Student.find({});
//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // --- MONTHLY COLLECTION STATS ---
// export const getMonthlyStats = async (req, res) => {
//   try {
//     const { year } = req.query; // e.g. ?year=2026
//     const targetYear = year ? String(year) : String(new Date().getFullYear());

//     const students = await Student.find({});

//     const monthly = Array(12).fill(0); // index 0 = Jan, 11 = Dec

//     students.forEach((s) => {
//       (s.paymentHistory || []).forEach((p) => {
//         if (!p.date) return;

//         let month, yr;

//         if (p.date.includes("-")) {
//           // YYYY-MM-DD
//           [yr, month] = p.date.split("-").map(Number);
//         } else if (p.date.includes("/")) {
//           // DD/MM/YYYY
//           const parts = p.date.split("/").map(Number);
//           month = parts[1];
//           yr = parts[2];
//         } else return;

//         if (String(yr) === targetYear) {
//           monthly[month - 1] += p.amount; // month is 1-based
//         }
//       });
//     });

//     res.status(200).json({ year: targetYear, monthly });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// import Student from "../model/studentform.js";
// import { GoogleSpreadsheet } from "google-spreadsheet";
// import { JWT } from "google-auth-library";
// import dotenv from "dotenv";
// dotenv.config();

// const getTodayDate = () => {
//   const today = new Date();
//   return today.toLocaleDateString("en-GB");
// };

// // --- SINGLETON: Reuse the same auth + doc instance ---
// let cachedDoc = null;

// const getDoc = async () => {
//   if (cachedDoc) return cachedDoc;

//   const privateKey = process.env.GOOGLE_PRIVATE_KEY;

//   if (!privateKey) throw new Error("GOOGLE_PRIVATE_KEY is missing in .env");

//   // Handle both escaped \\n and real newlines
//   const formattedKey = privateKey.includes("\\n")
//     ? privateKey.replace(/\\n/g, "\n")
//     : privateKey;

//   const serviceAccountAuth = new JWT({
//     email: process.env.GOOGLE_CLIENT_EMAIL,
//     key: formattedKey,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//   });

//   const doc = new GoogleSpreadsheet(
//     process.env.GOOGLE_SHEET_ID,
//     serviceAccountAuth,
//   );

//   cachedDoc = doc;
//   return doc;
// };

// // --- HELPER: Sync with retry logic ---
// const performSheetSync = async (retries = 3) => {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       const doc = await getDoc();
//       await doc.loadInfo();
//       const sheet = doc.sheetsByIndex[0];

//       const students = await Student.find({});

//       const maxPayments = students.reduce((max, s) => {
//         return Math.max(max, s.paymentHistory.length);
//       }, 0);

//       const paymentHeaders = [];
//       for (let i = 1; i <= maxPayments; i++) {
//         paymentHeaders.push(`Payment ${i}`, `Payment ${i} Date`);
//       }

//       const baseHeaders = [
//         "Roll No",
//         "Name",
//         "Father Name",
//         "Course",
//         "College",
//         "Date of Enrollment",
//         "Course Duration",
//         "Total Fee",
//         "Paid",
//         "Pending Dues",
//       ];

//       const allHeaders = [...baseHeaders, ...paymentHeaders];

//       const rows = students.map((s) => {
//         const base = {
//           "Roll No": s.rollno,
//           Name: s.name,
//           "Father Name": s.fatherName,
//           Course: s.course,
//           College: s.college,
//           "Date of Enrollment": s.dateOfEnrollment,
//           "Course Duration": s.courseduration,
//           "Total Fee": s.totalFee,
//           Paid: s.paidAmount,
//           "Pending Dues": s.pendingDues,
//         };

//         s.paymentHistory.forEach((payment, index) => {
//           base[`Payment ${index + 1}`] = payment.amount;
//           base[`Payment ${index + 1} Date`] = payment.date;
//         });

//         return base;
//       });

//       await sheet.clear();
// await sheet.resize({
//   rowCount: Math.max(students.length + 10, 100),
//   columnCount: Math.max(allHeaders.length + 5, 26),
// });
// await sheet.setHeaderRow(allHeaders);

//       if (rows.length > 0) await sheet.addRows(rows);

//       console.log(`✅ Google Sheet synced successfully (attempt ${attempt})`);
//       return; // success, exit
//     } catch (error) {
//       console.error(`❌ Sync attempt ${attempt} failed:`, error.message);

//       // If it's an auth error, reset the cached doc so it rebuilds next time
//       if (
//         error.message.includes("invalid_grant") ||
//         error.message.includes("UNAUTHENTICATED") ||
//         error.message.includes("401")
//       ) {
//         console.warn("🔄 Auth error detected — resetting cached doc");
//         cachedDoc = null;
//       }

//       if (attempt === retries) {
//         console.error(
//           "🚨 All sync attempts failed. DB is updated but Sheet is out of sync.",
//         );
//         throw error; // bubble up after all retries exhausted
//       }

//       // Wait before retrying (exponential backoff: 1s, 2s, 4s)
//       await new Promise((res) => setTimeout(res, 1000 * attempt));
//     }
//   }
// };

// // --- FIND STUDENT ---
// export const findStudent = async (req, res) => {
//   try {
//     const { name, rollno } = req.query;
//     const conditions = [];

//     if (name) conditions.push({ name: { $regex: `^${name}$`, $options: "i" } });
//     if (rollno) conditions.push({ rollno: Number(rollno) });

//     if (conditions.length === 0) {
//       return res.status(400).json({ message: "Please provide name or rollno" });
//     }

//     const student = await Student.findOne({ $or: conditions });

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     res.status(200).json(student);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // --- ADD STUDENT ---
// export const addStudent = async (req, res) => {
//   try {
//     const {
//       name,
//       fatherName,
//       course,
//       college,
//       dateOfEnrollment,
//       totalFee,
//       paidAmount,
//       courseduration,
//       rollno,
//       paymentNote,
//     } = req.body;

//     const normalizedName = name.toLowerCase().trim();
//     const normalizedFatherName = fatherName.toLowerCase().trim();

//     const existingStudent = await Student.findOne({
//       name: normalizedName,
//       fatherName: normalizedFatherName,
//     });

//     if (existingStudent) {
//       return res.status(400).json({
//         message: "Student with same Name & Father Name already exists ❌",
//       });
//     }

//     const paymentHistory = [];
//     const paid = Number(paidAmount);

//     if (paid > 0) {
//       paymentHistory.push({
//         amount: paid,
//         date: getTodayDate(),
//         note: paymentNote || "Initial payment",
//       });
//     }

//     const newStudent = new Student({
//       name: normalizedName,
//       fatherName: normalizedFatherName,
//       course,
//       college,
//       dateOfEnrollment,
//       totalFee: Number(totalFee),
//       paidAmount: paid,
//       courseduration,
//       rollno: Number(rollno),
//       paymentHistory,
//     });

//     await newStudent.save();

//     // Sync separately — don't let sheet failure break the response
//     try {
//       await performSheetSync();
//     } catch (syncErr) {
//       console.error("Sheet sync failed after addStudent:", syncErr.message);
//     }

//     res.status(201).json({
//       message: "New Student Added & Synced! ✅",
//       data: newStudent,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // --- UPDATE FEES ---
// export const updateFees = async (req, res) => {
//   try {
//     const { name, fatherName, additionalPaid, paymentNote } = req.body;

//     const student = await Student.findOne({ name, fatherName });

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     const amount = Number(additionalPaid);

//     if (student.pendingDues === 0) {
//       return res.status(400).json({ message: "Pending fees is already 0" });
//     }

//     if (amount > student.pendingDues) {
//       return res.status(400).json({
//         message: `Amount ₹${amount} is greater than pending dues ₹${student.pendingDues}`,
//       });
//     }

//     student.paidAmount += amount;
//     student.paymentHistory.push({
//       amount,
//       date: getTodayDate(),
//       note: paymentNote || "",
//     });

//     await student.save();

//     // Sync separately — don't let sheet failure break the response
//     try {
//       await performSheetSync();
//     } catch (syncErr) {
//       console.error("Sheet sync failed after updateFees:", syncErr.message);
//     }

//     res.status(200).json({
//       message: `Payment of ₹${amount} recorded & Synced! ✅`,
//       data: student,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // --- MANUAL SYNC ---
// export const syncToSheets = async (req, res) => {
//   try {
//     await performSheetSync();
//     res.status(200).json({ message: "Google Sheet Sync Complete!" });
//   } catch (error) {
//     res.status(500).json({ error: "Sync Failed: " + error.message });
//   }
// };

// // --- GET ALL STUDENTS ---
// export const getAllStudents = async (req, res) => {
//   try {
//     const students = await Student.find({});
//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // --- MONTHLY COLLECTION STATS ---
// export const getMonthlyStats = async (req, res) => {
//   try {
//     const { year } = req.query;
//     const targetYear = year ? String(year) : String(new Date().getFullYear());

//     const students = await Student.find({});
//     const monthly = Array(12).fill(0);

//     students.forEach((s) => {
//       (s.paymentHistory || []).forEach((p) => {
//         if (!p.date) return;

//         let month, yr;

//         if (p.date.includes("-")) {
//           [yr, month] = p.date.split("-").map(Number);
//         } else if (p.date.includes("/")) {
//           const parts = p.date.split("/").map(Number);
//           month = parts[1];
//           yr = parts[2];
//         } else return;

//         if (String(yr) === targetYear) {
//           monthly[month - 1] += p.amount;
//         }
//       });
//     });

//     res.status(200).json({ year: targetYear, monthly });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

import Student from "../model/studentform.js";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const getTodayDate = () => {
  const today = new Date();
  return today.toLocaleDateString("en-GB");
};

let cachedDoc = null;

const getDoc = async () => {
  if (cachedDoc) return cachedDoc;

  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!privateKey) throw new Error("GOOGLE_PRIVATE_KEY is missing in .env");

  const formattedKey = privateKey.includes("\\n")
    ? privateKey.replace(/\\n/g, "\n")
    : privateKey;

  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: formattedKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SHEET_ID,
    serviceAccountAuth,
  );

  cachedDoc = doc;
  return doc;
};

const performSheetSync = async (retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const doc = await getDoc();
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];

      const students = await Student.find({});

      const maxPayments = students.reduce((max, s) => {
        return Math.max(max, s.paymentHistory.length);
      }, 0);

      // Now each payment has 4 columns: Amount, Date, Method, Txn ID
      const paymentHeaders = [];
      for (let i = 1; i <= maxPayments; i++) {
        paymentHeaders.push(
          `Payment ${i}`,
          `Payment ${i} Date`,
          `Payment ${i} Method`,
          `Payment ${i} Txn ID`,
        );
      }

      const baseHeaders = [
        "Roll No",
        "Name",
        "Father Name",
        "Course",
        "College",
        "Date of Enrollment",
        "Course Duration",
        "Total Fee",
        "Paid",
        "Pending Dues",
      ];

      const allHeaders = [...baseHeaders, ...paymentHeaders];

      const rows = students.map((s) => {
        const base = {
          "Roll No": s.rollno,
          Name: s.name,
          "Father Name": s.fatherName,
          Course: s.course,
          College: s.college,
          "Date of Enrollment": s.dateOfEnrollment,
          "Course Duration": s.courseduration,
          "Total Fee": s.totalFee,
          Paid: s.paidAmount,
          "Pending Dues": s.pendingDues,
        };

        s.paymentHistory.forEach((payment, index) => {
          base[`Payment ${index + 1}`] = payment.amount;
          base[`Payment ${index + 1} Date`] = payment.date;
          base[`Payment ${index + 1} Method`] = payment.paymentMethod || "cash";
          base[`Payment ${index + 1} Txn ID`] = payment.transactionId || "-";
        });

        return base;
      });

      await sheet.clear();
      await sheet.resize({
        rowCount: Math.max(students.length + 10, 100),
        columnCount: Math.max(allHeaders.length + 5, 26),
      });
      await sheet.setHeaderRow(allHeaders);
      if (rows.length > 0) await sheet.addRows(rows);

      console.log(`✅ Google Sheet synced successfully (attempt ${attempt})`);
      return;
    } catch (error) {
      console.error(`❌ Sync attempt ${attempt} failed:`, error.message);

      if (
        error.message.includes("invalid_grant") ||
        error.message.includes("UNAUTHENTICATED") ||
        error.message.includes("401")
      ) {
        console.warn("🔄 Auth error detected — resetting cached doc");
        cachedDoc = null;
      }

      if (attempt === retries) {
        console.error(
          "🚨 All sync attempts failed. DB is updated but Sheet is out of sync.",
        );
        throw error;
      }

      await new Promise((res) => setTimeout(res, 1000 * attempt));
    }
  }
};

// --- FIND STUDENT ---
export const findStudent = async (req, res) => {
  try {
    const { name, rollno } = req.query;
    const conditions = [];

    if (name) conditions.push({ name: { $regex: `^${name}$`, $options: "i" } });
    if (rollno) conditions.push({ rollno: Number(rollno) });

    if (conditions.length === 0) {
      return res.status(400).json({ message: "Please provide name or rollno" });
    }

    const student = await Student.findOne({ $or: conditions });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- ADD STUDENT ---
export const addStudent = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      course,
      college,
      dateOfEnrollment,
      totalFee,
      paidAmount,
      courseduration,
      rollno,
      paymentNote,
      paymentMethod, // "cash" or "upi"
      transactionId, // only if upi
    } = req.body;

    const normalizedName = name.toLowerCase().trim();
    const normalizedFatherName = fatherName.toLowerCase().trim();

    const existingStudent = await Student.findOne({
      name: normalizedName,
      fatherName: normalizedFatherName,
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student with same Name & Father Name already exists ❌",
      });
    }

    const paymentHistory = [];
    const paid = Number(paidAmount);
    const method = paymentMethod || "cash";

    // Validate: UPI must have transactionId
    if (method === "upi" && paid > 0 && !transactionId?.trim()) {
      return res.status(400).json({
        message: "Transaction ID is required for UPI payment ❌",
      });
    }

    if (paid > 0) {
      paymentHistory.push({
        amount: paid,
        date: getTodayDate(),
        note: paymentNote || "Initial payment",
        paymentMethod: method,
        transactionId: method === "upi" ? transactionId.trim() : "",
      });
    }

    const newStudent = new Student({
      name: normalizedName,
      fatherName: normalizedFatherName,
      course,
      college,
      dateOfEnrollment,
      totalFee: Number(totalFee),
      paidAmount: paid,
      courseduration,
      rollno: Number(rollno),
      paymentHistory,
    });

    await newStudent.save();

    try {
      await performSheetSync();
    } catch (syncErr) {
      console.error("Sheet sync failed after addStudent:", syncErr.message);
    }

    res.status(201).json({
      message: "New Student Added & Synced! ✅",
      data: newStudent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- UPDATE FEES ---
export const updateFees = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      additionalPaid,
      paymentNote,
      paymentMethod, // "cash" or "upi"
      transactionId, // only if upi
    } = req.body;

    const student = await Student.findOne({ name, fatherName });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const amount = Number(additionalPaid);
    const method = paymentMethod || "cash";

    if (student.pendingDues === 0) {
      return res.status(400).json({ message: "Pending fees is already 0" });
    }

    if (amount > student.pendingDues) {
      return res.status(400).json({
        message: `Amount ₹${amount} is greater than pending dues ₹${student.pendingDues}`,
      });
    }

    // Validate: UPI must have transactionId
    if (method === "upi" && !transactionId?.trim()) {
      return res.status(400).json({
        message: "Transaction ID is required for UPI payment ❌",
      });
    }

    student.paidAmount += amount;
    student.paymentHistory.push({
      amount,
      date: getTodayDate(),
      note: paymentNote || "",
      paymentMethod: method,
      transactionId: method === "upi" ? transactionId.trim() : "",
    });

    await student.save();

    try {
      await performSheetSync();
    } catch (syncErr) {
      console.error("Sheet sync failed after updateFees:", syncErr.message);
    }

    res.status(200).json({
      message: `Payment of ₹${amount} via ${method.toUpperCase()} recorded & Synced! ✅`,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- MANUAL SYNC ---
export const syncToSheets = async (req, res) => {
  try {
    await performSheetSync();
    res.status(200).json({ message: "Google Sheet Sync Complete!" });
  } catch (error) {
    res.status(500).json({ error: "Sync Failed: " + error.message });
  }
};

// --- GET ALL STUDENTS ---
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- MONTHLY COLLECTION STATS ---
export const getMonthlyStats = async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year ? String(year) : String(new Date().getFullYear());

    const students = await Student.find({});
    const monthly = Array(12).fill(0);

    students.forEach((s) => {
      (s.paymentHistory || []).forEach((p) => {
        if (!p.date) return;

        let month, yr;

        if (p.date.includes("-")) {
          [yr, month] = p.date.split("-").map(Number);
        } else if (p.date.includes("/")) {
          const parts = p.date.split("/").map(Number);
          month = parts[1];
          yr = parts[2];
        } else return;

        if (String(yr) === targetYear) {
          monthly[month - 1] += p.amount;
        }
      });
    });

    res.status(200).json({ year: targetYear, monthly });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};