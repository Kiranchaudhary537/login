import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import { findEmailAndDelete, findUserByEmailForOto } from "../Database/user.js";
import env from "dotenv";
env.config();

// router
const verifyrouter = express.Router();
verifyrouter.route("/").get(verifyGet).post(verifyPost);

// get and post function

async function verifyGet(req, res) {
  res.status(200).sendFile(path.join(__dirname + "/../../public/verify.html"));
}

async function verifyPost(req, res) {
  const { otp } = req.body;
  const { email } = res.app.get("email");

  const user = await findUserByEmailForOto(email);

  if (!user) {
    console.log("user not found");
    res.status(404).json({
      result: "failed to  found user",
      message: "user not found on database",
    });
  } else if (user.expired <= Date.now()) {
    await findEmailAndDelete(email);
    res.status(403).json({
      result: "failed",
      message: "otp expired",
    });
  } else {
    await findEmailAndDelete(email);
    bcrypt
      .compare(otp, user.otp)
      .then(() => {
        const token = jwt.sign({ email: user }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        res.cookie("IsLogIn", token, {
          maxAge: 1000 * 24 * 60 * 60,
          httpOnly: true,
        });

        //server login form
        // res.status(200).redirect("/");
        // external api use
        res.status(200).send({
          ok: true,
          token: token,
          message: "USER_LOGIN_SUCCESS",
        });
        // res.redirect(307, "/");
      })
      .catch(() => {
        res.status(400).json({
          result: "failed",
          message: "not same otp",
        });
      });
  }
}

export default verifyrouter;
