const { UserModal } = require("./../modal/LogInModal");
const bcrypt = require("bcrypt");
const { VerifyModal } = require("../modal/VerifyModal");

// require("./../config/db");

const findUserByUsername = async (username) => {
  const User = await UserModal.findOne({
    username,
  });
  return User;
};
const findUserByUsernameForOto = async (username) => {
  const User = await VerifyModal.findOne({
    username,
  });
  return User;
};
const saveNewOtpForUser = async (username, otp) => {
  const newOTP = new VerifyModal({
    username: username,
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

const findUserAndUpdate = async (username, otp) => {
  await VerifyModal.findOneAndUpdate(
    {
      username,
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
const findUsernameAndDelete = async (username) => {
  await VerifyModal.findOneAndDelete({
    username,
  })
    .then(() => {
      return "success";
    })
    .catch((e) => {
      return "failed" + e;
    });
};
module.exports = {
  findUserByUsername,
  findUsernameAndDelete,
  saveNewOtpForUser,
  findUserAndUpdate,
  findUserByUsernameForOto,
};
