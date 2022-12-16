const express = require("express");
const otpGenerator = require("otp-generator");
const authrouter = express.Router();
const { UserModal } = require("./../modal/LogInModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

authrouter.route("/").get(authGet).post(authPost);
authrouter.route("/verify").get(verifyGet).post(verfiyPost);

const otp = otpGenerator.generate(6, {
  lowerCaseAlphabets: false,
  upperCaseAlphabets: false,
  specialChars: false,
});
var uname;

async function authGet(req, res) {
  res.sendFile("E:/Backend/public/login.html");
}

async function authPost(req, res) {
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
    uname = username;
    const match = await bcrypt.compare(password, user.password);
    console.log(match);
    if (match) {
      const token = jwt.sign({ otp: otp }, "kiran");
      res.cookie("OTP", token, {
        maxAge: 1000 * 60,
        secure: true,
        httpOnly: true,
      });
      res.json({
        result: "suceess",
        message: "user found",
      });
      //res.redirect("/login/verify");
    } else {
      res.send("password not matched");
    }
  }
}

async function verifyGet(req, res) {
  res.sendFile("E:/Backend/public/verify.html");
}

async function verfiyPost(req, res) {
  const { otp } = req.body;
  console.log(otp);
  try {
    jwt.verify(otp, "kiran", (err, verifiedJwt) => {
      if (err) {
        res.send(err.message);
      } else {
        res.send(verifiedJwt);
      }
    });
    const token = jwt.sign({ otp: otp }, "kiran");
    res.cookie("IsLogIn", token, {
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      httpOnly: true,
    });
    await UserModal.findOneAndUpdate(
      {
        uname,
      },
      { lastActive: new Date().toISOString() }
    );
    //res.redirect("/");
    res.send("done");
  } catch (error) {
    res.send(error.name);
  }
}

module.exports = { authrouter };
