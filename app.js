const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();
var bodyParser = require("body-parser");
const { authrouter } = require("./v1/routes/auth");

const options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.set("strictQuery", false);
const db = mongoose
  .connect(process.env.MONGO_URI, options)
  .then(() => {
    console.log("mangodb connected");
  })
  .catch(() => {
    console.log("error while connecting");
  });

app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile("E:/Backend/public/index.html");
});

app.use("/login", authrouter);

app.listen(port, () => {
  console.log("port working");
});
