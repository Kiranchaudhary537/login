const mongoose = require("mongoose");
const { model } = mongoose;
const { varify } = require("./../schemas/LogInSchema");
const LogInModal = mongoose.model("LogIn", loginSchema);
module.exports = { LogInModal };
