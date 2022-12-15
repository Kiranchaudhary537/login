const express = require("express");
const app = express();
app.post("/auth", function (req, res) {
    console.log(req.body);
  });