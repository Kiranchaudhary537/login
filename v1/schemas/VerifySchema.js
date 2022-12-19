import mongoose from "mongoose";
const { Schema } = mongoose;

const VerifySchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  created: {
    type: String,
    required: true,
  },
  expired: {
    type: String,
    required: true,
  },
});

export default VerifySchema;
