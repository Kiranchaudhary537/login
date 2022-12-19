import express from "express";
import path from "path";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import amqp from "amqplib/callback_api.js";

import sendMail from "./v1/utility/emailServices.js";
// consume();
import env from "dotenv";
import authrouter from "./v1/routes/auth.js";
import verifyrouter from "./v1/routes/verify.js";
import UserModal from "./v1/modal/LogInModal.js";
env.config();
const app = express();
const port = 3000;

// database connection
// db();
mongoose.set("strictQuery", false);
const options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(process.env.MONGO_URI, options)
  .then(() => {
    console.log("mangodb connected");
  })
  .catch(() => {
    console.log("error while connecting");
  });



// // server port
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
  res.status(200).sendFile("E:/Backend/public/index.html");
});
app.use("/login", authrouter);
app.use("/login/verify", verifyrouter);

function protectRoute(req, res, next) {
  jwt.verify(
    req.cookies.IsLogIn,
    process.env.JWT_SECRET,
    (err, verifiedJwt) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    }
  );
}

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
