const mongoose = require("mongoose");
const { Schema } = mongoose;

const loginSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    minLength: 10,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: String,
    default: new Date().toISOString(),
  },
  lastActive: {
    type: String,
    required: false,
  },
});

module.exports = { loginSchema };
