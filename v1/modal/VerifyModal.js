const mongoose = require("mongoose");
const { model } = mongoose;
const { VerifySchema } = require("./../schemas/VerifySchema");
const VerifyModal = mongoose.model("Verify", VerifySchema);
module.exports = { VerifyModal };
