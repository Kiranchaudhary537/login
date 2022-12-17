const express = require("express");
const otpGenerator = require("otp-generator");
const authrouter = express.Router();
const { UserModal } = require("./../modal/LogInModal");
const bcrypt = require("bcrypt");
const { sendMail } = require("../utility/emailServices");
const { VerifyModal } = require("../modal/VerifyModal");
const sendVerificationEmail = require("../utility/emailServices");
require("dotenv").config();
sendVerificationEmail;
authrouter.route("/").get(authGet).post(authPost);

async function authGet(req, res) {
  res.sendFile("E:/Backend/public/login.html");
}

async function authPost(req, res) {
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const { username, password } = req.body;
  console.log("otp " + otp);
  const user = await UserModal.findOne({
    username,
  });
  if (!user) {
    res.json({
      result: "failed to  found user",
      message: "user not found on database",
    });
  } else {
    console.log(user);
    res.app.set("usernames", username);
    const match = await bcrypt.compare(password, user.password);
    console.log(match);
    if (match) {
      const OTP = await VerifyModal.findOne({
        username,
      });

      try {
        sendMail({ to: "kiranchaudhary537@gmail.com", OTP: otp });
      } catch {
        (e) => {
          res.send(e.message);
        };
      }
      if (!OTP) {
        const newOTP = new VerifyModal({
          username: username,
          otp: bcrypt.hashSync(otp, 10),
          created: Date.now(),
          expired: Date.now() + 60000,
        });

        const data = await newOTP
          .save()
          .then(() => {
            console.log("successfully added");
            res.end("success fully added");
          })
          .catch((e) => {
            console.log(e);
            res.end("error while adding data" + e);
          });
      } else {
        console.log("user existed");
        await VerifyModal.findOneAndUpdate(
          {
            username,
          },
          { expired: Date.now() + 60000, otp: bcrypt.hashSync(otp, 10) }
        );
      }
      res.redirect("/login/verify");
    } else {
      res.send("password not matched");
    }
  }
}

module.exports = { authrouter };
