const express = require("express");
const { verify } = require("jsonwebtoken");
const path = require("path");
const app = express();
const authrouter = express.Router();
const { LogInModal } = require("./../modal/LogInModal");
authrouter.route("/").get(authGet).post(authPost);
authrouter.route("/verify").get(verifyGet).post(verfiyPost);
require("./../config/db");

function authGet(req, res) {
  res.sendFile("E:/Backend/public/login.html");
}

function authPost(req, res) {
  const { email, password } = req.body;
  const newUser = new LogInModal({
    email: email,
    password: password,
  });
  newUser
    .save()
    .then((result) => {
      res.json({
        result: "suceess",
        message: "saved",
      });
      res.redirect("/login/verify");
    })
    .catch((result) => console.log("not working"))
    .finally((result) => {});
}

function verifyGet(req, res) {
  res.sendFile("E:/Backend/public/verify.html");
}

function verfiyPost(req, res) {
  res.redirect("/");
}

module.exports = { authrouter };
