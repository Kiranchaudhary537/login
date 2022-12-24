import express from "express";
import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./src/config/db.js";
import env from "dotenv";
import authrouter from "./src/routes/auth.js";
import verifyrouter from "./src/routes/verify.js";
import UserModal from "./src/modal/LogInModal.js";
// import { Worker } from "worker_threads";
import consumer from "./src/utility/consumer.js";

// configuations
env.config();
const app = express();
const port = process.env.PORT || 3000;

// rabbitmq's consumer running
consumer();

// database connection
db();
//
app.listen(port, () => {
  console.log("port working");
});

// middleware
// app.all("*", createThread);
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(cors());

// function createThread() {
//   console.log("thread working");

//   const newThread = new Worker(__dirname + "./src/utility/consumer.js");
//   newThread.on("message", (result) => {
//     console.log("thread api" + result);
//   });
//   newThread.postMessage(1);
// }

// routing
app.get("/", function (req, res) {
  res.status(200).send("sever running");
});

app.post("/", function (req, res) {
  const { IsLogIn } = req.body;
  jwt.verify(IsLogIn, process.env.JWT_SECRET, (err, verifiedJwt) => {
    if (err) {
      res.status(400).send("no user login");
    } else {
      res.status(200).send("success");
    }
  });
});
app.use("/login", authrouter);
app.use("/login/verify", verifyrouter);

function protectRoute(req, res, next) {
  const { IsLogIn } = req.body;
  jwt.verify(IsLogIn, process.env.JWT_SECRET, (err, verifiedJwt) => {
    if (err) {
      res.status(400).send("no user login");
    } else {
      next();
    }
  });
  // jwt.verify(
  //   req.cookies.IsLogIn,
  //   process.env.JWT_SECRET,
  //   (err, verifiedJwt) => {
  //     if (err) {
  //       res.redirect("/login");
  //     } else {
  //       next();
  //     }
  //   }
  // );
}

app.post("/singup", async function (req, res) {
  const { email, password, username } = req.body;
  if (email.trim() == "" || password.trim() == "" || username.trim() == "") {
    res.status(400).send("no form data found");
    return;
  }
  const newUser = new UserModal({
    email: email,
    username: username,
    password: bcrypt.hashSync(password, 10),
    lastActive: new Date().toISOString(),
  });
  await newUser
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
