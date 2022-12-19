import express from "express";
const verifyrouter = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../utility/emailServices.js";
import { findUserAndUpdate, findUserByEmailForOto } from "../Database/user.js";

verifyrouter.route("/").get(verifyGet).post(verifyPost);
import env from "dotenv";
env.config();

async function verifyGet(req, res) {
  res.sendFile("E:/Backend/public/verify.html");
  const { email, otp } = res.app.get("data");
  res.app.set("data", { email: email, otp: otp });
  sendMail({ to: email, OTP: otp });
}

async function verifyPost(req, res) {
  //const { otp } = req.body;
  const { email, otp } = res.app.get("data");
  console.log(email);
  //   try {
  console.log("otp " + otp);
  const user = await findUserByEmailForOto(email);
  if (!user) {
    res.json({
      result: "failed to  found user",
      message: "user not found on database",
    });
  } else if (user.expired <= Date.now()) {
    res.json({
      result: "failed",
      message: "otp expired",
    });
  } else {
    const match = await bcrypt.compare(otp, user.otp);
    await findUserAndUpdate(email, otp);
    if (match) {
      const token = jwt.sign({ email: user }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      res.cookie("IsLogIn", token, {
        maxAge: 1000 * 24 * 60 * 60,
        httpOnly: true,
      });
      res.redirect("/");
    } else {
      res.send("not same otp");
    }
    // res.end();
  }
  //   } catch (error) {
  //     res.send(error.name);
  //   }
}

export default verifyrouter;
