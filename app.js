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
import { Worker } from "worker_threads";
// import consumer from "./src/utility/consumer.js";
// import consumer from "./src/utility/consumer.js";

// configuations
env.config();
const app = express();
const port = process.env.PORT || 3000;

// rabbitmq's consumer running using thread
// consumer();
async function createThread() {
  const newThread = new Worker(
    path.join(__dirname + "src/utility/consumer.js")
  );
  newThread.on("message", (result) => {
    console.log("main thread: " + result);
  });
  newThread.postMessage("parent thread");
}
createThread();

// database connection
db();
//
app.listen(port, () => {
  console.log("port working");
});

// middleware

app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(cors());

// routing 
app.get("/", protectRoute, function (req, res) {
  res.status(200).sendFile(path.join(__dirname + "/public/index.html"));
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
      res.status(300).redirect("/login");
    } else {
      next();
    }
  });
}

