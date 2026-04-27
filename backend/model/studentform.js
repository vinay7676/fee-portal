// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema({
//   amount: { type: Number, required: true },
//   date: { type: String, required: true },
//   note: { type: String, default: "" },
// });

// const studentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   fatherName: { type: String, required: true },
//   course: { type: String, required: true },
//   totalFee: { type: Number, required: true },
//   paidAmount: { type: Number, default: 0 },
//   pendingDues: { type: Number },
//   college: { type: String, required: true },
//   dateOfEnrollment: { type: String, required: true },
//   courseduration: { type: String, required: true },
//   rollno: { type: Number, required: true, unique: true },
//   paymentHistory: { type: [paymentSchema], default: [] },
// });

// studentSchema.pre("save", function (next) {
//   this.pendingDues = this.totalFee - this.paidAmount;
//   next();
// });

// const Student = mongoose.model("Student", studentSchema);
// export default Student;

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  note: { type: String, default: "" },
  paymentMethod: { type: String, enum: ["cash", "upi"], default: "cash" },
  transactionId: { type: String, default: "" }, // only for UPI
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  course: { type: String, required: true },
  totalFee: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  pendingDues: { type: Number },
  college: { type: String, required: true },
  dateOfEnrollment: { type: String, required: true },
  courseduration: { type: String, required: true },
  rollno: { type: Number, required: true, unique: true },
  paymentHistory: { type: [paymentSchema], default: [] },
});

studentSchema.pre("save", function (next) {
  this.pendingDues = this.totalFee - this.paidAmount;
  next();
});

const Student = mongoose.model("Student", studentSchema);
export default Student;