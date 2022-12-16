const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
var bodyParser = require("body-parser");
const { authrouter } = require("./v1/routes/auth");
const jwt = require("jsonwebtoken");
const { UserModal } = require("./v1/modal/LogInModal");

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

// middleware
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// routing
app.get("/", protectRoute, function (req, res) {
  res.sendFile("E:/Backend/public/index.html");
});
app.use("/login", authrouter);

function protectRoute(req, res, next) {
  console.log(req.cookies.IsLogIn);
  if (req.cookies.IsLogIn == "true") {
    console.log("working");
    next();
  } else {
    res.redirect("/login");
  }
}
app.listen(port, () => {
  console.log("port working");
});

app.post("/singup", async function (req, res) {
  const { email, password, username } = req.body;

  const newUser = new UserModal({
    email: email,
    username: username,
    password: bcrypt.hashSync(password, 10),
    lastActive: new Date().toISOString(),
  });

  const data = await newUser
    .save()
    .then(() => {
      console.log("successfully added");
      res.end("success fully added");
    })
    .catch((e) => {
      console.log(e);
      res.end("error while adding data" + e);
    });
});

// app.get("/singup", function (req, res) {
//   //console.log(req.cookies);
//   res.send(req.cookies);
// });
