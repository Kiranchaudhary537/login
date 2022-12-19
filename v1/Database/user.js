import bcrypt from "bcrypt";
import UserModal from "../modal/LogInModal.js";
import VerifyModal from "../modal/VerifyModal.js";

// require("./../config/db");

export const findUserByUsername = async (username) => {
  const User = await UserModal.findOne({
    username,
  });
  return User;
};
export const findUserByEmailForOto = async (email) => {
  const User = await VerifyModal.findOne({
    email,
  });
  return User;
};
export const saveNewOtpForUser = async (email, otp) => {
  const newOTP = new VerifyModal({
    email: email,
    otp: bcrypt.hashSync(otp, 10),
    created: Date.now(),
    expired: Date.now() + 60000,
  });
  await newOTP
    .save()
    .then(() => {
      return "success";
    })
    .catch((e) => {
      return "failed" + e;
    });
};

export const findUserAndUpdate = async (email, otp) => {
  await VerifyModal.findOneAndUpdate(
    {
      email,
    },
    { expired: Date.now() + 60000, otp: bcrypt.hashSync(otp, 10) }
  )
    .then(() => {
      return "sucess";
    })
    .catch((e) => {
      return "failed" + e;
    });
};
export const findEmailAndDelete = async (email) => {
  await VerifyModal.findOneAndDelete({
    email,
  })
    .then(() => {
      return "success";
    })
    .catch((e) => {
      return "failed" + e;
    });
};
