import express from "express";
import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./v1/config/db.js";
import env from "dotenv";
import authrouter from "./v1/routes/auth.js";
import verifyrouter from "./v1/routes/verify.js";
import UserModal from "./v1/modal/LogInModal.js";

// configuations
env.config();
const app = express();
const port = 3000;

// rabbitmq's consumer running
import "./v1/utility/consumer.js";

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
  res.status(200).sendFile("./public/index.html", { root: __dirname });
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
