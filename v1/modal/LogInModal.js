import mongoose from "mongoose";
import loginSchema from "./../schemas/LogInSchema.js";
const UserModal = mongoose.model("User", loginSchema);
export default UserModal;
