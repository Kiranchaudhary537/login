const mongoose = require("mongoose");
const { model } = mongoose;
const { varifySchema } = require("./../schemas/VerifySchema");
const LogInModal = mongoose.model("LogIn", varifySchema);
module.exports = { LogInModal };
