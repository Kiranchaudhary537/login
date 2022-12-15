const mongoose = require("mongoose");
const { Schema } = mongoose;

const varifySchema = new Schema({
  code: {
    type: Number,
    required: true,
  },
});

module.exports = { varifySchema };
