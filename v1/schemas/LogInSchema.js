const mongoose = require("mongoose");
const { Schema } = mongoose;

const loginSchema = new Schema({
  email: {
    type: String,
    minLength: 10,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  logindate: {
    type: Date,
    required: true,
  },
  duedate: {
    type: Date,
    required: true,
  },
});

module.exports = { loginSchema };
