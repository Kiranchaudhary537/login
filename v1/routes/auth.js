import express from "express";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  findUserAndUpdate,
  findUserByUsername,
  saveNewOtpForUser,
  findUserByEmailForOto,
} from "../Database/user.js";
// const { sendMail } = require("../utility/emailServices");

const authrouter = express.Router();
import env from "dotenv";
env.config();

authrouter.route("/").get(authGet).post(authPost);

async function authGet(req, res) {
  res.status(200).sendFile("E:/Backend/public/login.html");
}

// async function authPost(req, res) {
//   const { username, password } = req.body;
//   const otp = otpGenerator.generate(6, {
//     lowerCaseAlphabets: false,
//     upperCaseAlphabets: false,
//     specialChars: false,
//   });

//   const user = await UserModal.findOne({
//     username,
//   });

//   if (!user) {
//     res.json({
//       result: "failed to  found user",
//       message: "user not found on database",
//     });
//   } else {
//     console.log(user);
//     const match = await bcrypt.compare(password, user.password);
//     if (match) {
//       res.app.set("usernames", username);
//       const details = { to: "kiranchaudhary537@gmail.com", OTP: otp };
//       const OTP = await VerifyModal.findOne({
//         username,
//       });
//       try {
//         queue(details);
//         sendMail({ to: "kiranchaudhary537@gmail.com", OTP: otp });
//       } catch {
//         (e) => {
//           res.send(e.message);
//         };
//       }
//       if (!OTP) {
//         const newOTP = new VerifyModal({
//           username: username,
//           otp: bcrypt.hashSync(otp, 10),
//           created: Date.now(),
//           expired: Date.now() + 60000,
//         });

//         const data = await newOTP
//           .save()
//           .then(() => {
//             console.log("successfully added");
//             res.end("success fully added");
//           })
//           .catch((e) => {
//             console.log(e);
//             res.end("error while adding data" + e);
//           });
//       } else {
//         console.log("user existed");
//         await VerifyModal.findOneAndUpdate(
//           {
//             username,
//           },
//           { expired: Date.now() + 60000, otp: bcrypt.hashSync(otp, 10) }
//         );
//       }
//       res.redirect("/login/verify");
//     } else {
//       res.send("password not matched");
//     }
//   }
// }
async function authPost(req, res) {
  const { username, password } = req.body;
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const user = await findUserByUsername(username);

  if (!user) {
    res.status(400).json({
      result: "failed to  found user",
      message: "user not found on database",
    });
  } else {
    console.log(user);
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.app.set("data", { email: user.email, otp: otp });

      const details = { to: user.email, OTP: otp };

      console.log(otp);

      const User = await findUserByEmailForOto(user.email);

      if (!User) {
        saveNewOtpForUser(user.email, otp);
      } else {
        console.log("user existed");
        findUserAndUpdate(user.email, otp);
      }
      res.status(200).redirect("/login/verify");
    } else {
      res.status(400).send("password not matched");
    }
  }
}

export default authrouter;
