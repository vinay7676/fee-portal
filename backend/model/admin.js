import mongoose from "mongoose";

const loginSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    
  },
  {
    timestamps: true,
  },
);

export const Login = mongoose.model("Login", loginSchema);
