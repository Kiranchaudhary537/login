import express from "express";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

import {
  findUserAndUpdate,
  findUserByUsername,
  saveNewOtpForUser,
  findUserByEmailForOto,
} from "../Database/user.js";

// router
const authrouter = express.Router();
authrouter.route("/").get(authGet).post(authPost);

// get and post functions
async function authGet(req, res) {
  res.status(200).sendFile(path.join(__dirname + "/../../public/login.html"));
}

async function authPost(req, res) {
  const { username, password } = req.body;
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const user = await findUserByUsername(username);
  if (!user) {
    res.status(404).json({
      result: "failed to  found user",
      message: "user not found on database",
    });
  } else {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.app.set("email", { email: user.email });

      const User = await findUserByEmailForOto(user.email);

      if (!User) {
        saveNewOtpForUser(user.email, otp);
      } else {
        findUserAndUpdate(user.email, otp);
      }
      res.status(300).redirect("/login/verify");
    } else {
      res.status(400).send("password not matched");
    }
  }
}

export default authrouter;
