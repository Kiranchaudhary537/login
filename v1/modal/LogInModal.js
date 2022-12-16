const mongoose = require("mongoose");
const { model } = mongoose;
const { loginSchema } = require("./../schemas/LogInSchema");
const UserModal = mongoose.model("User", loginSchema);
module.exports = { UserModal };
