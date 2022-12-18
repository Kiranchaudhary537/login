const express = require("express");
const verifyrouter = express.Router();
const { UserModal } = require("./../modal/LogInModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { VerifyModal } = require("../modal/VerifyModal");

verifyrouter.route("/").get(verifyGet).post(verfiyPost);
require("dotenv").config();

async function verifyGet(req, res) {
  res.sendFile("E:/Backend/public/verify.html");
}

async function verfiyPost(req, res) {
  const { otp } = req.body;
  const username = res.app.get("usernames");
  //   try {
  console.log("otp " + otp);
  const user = await VerifyModal.findOne({
    username,
  });
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
    await VerifyModal.findOneAndDelete({
      username,
    });
    if (match) {
      const token = jwt.sign({ username: user }, process.env.JWT_SECRET, {
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

module.exports = { verifyrouter };
