const mongoose = require("mongoose");
const { Schema } = mongoose;

const VerifySchema = new Schema({
  username: {
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

module.exports = { VerifySchema };
