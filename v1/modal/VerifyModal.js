import mongoose from "mongoose";
import VerifySchema from "../schemas/VerifySchema.js";
const VerifyModal = mongoose.model("Verify", VerifySchema);

export default VerifyModal;
