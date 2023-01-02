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

app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(cors());

// routing
app.get("/", function (req, res) {
  jwt.verify(
    req.cookies.IsLogIn,
    process.env.JWT_SECRET,
    (err, verifiedJwt) => {
      if (err) {
        res.status(300).redirect("/login");
      } else {
        res.status(200).sendFile(path.join(__dirname + "/public/index.html"));
      }
    }
  );
});

app.use("/login", authrouter);
app.use("/login/verify", verifyrouter);
