const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const cors = require("cors");
const { authrouter } = require("./v1/routes/auth");
const { UserModal } = require("./v1/modal/LogInModal");
const protectRoute = require("./v1/middleware/protectedRoute");
const { verifyrouter } = require("./v1/routes/verify");
const { consume } = require("./v1/utility/consumer");
const { queue } = require("./v1/utility/publisher");

// queue();
require("./v1/utility/consumer.js");
// import "./v1/utility/consumer.js";

require("dotenv").config();
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

app.listen(port, () => {
  console.log("port working");
});

// middleware
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000/",
    credentials: true,
  })
);
app.use("/login", authrouter);
app.use("/login/verify", verifyrouter);

// routing
app.get("/", function (req, res) {
  jwt.verify(
    req.cookies.IsLogIn,
    process.env.JWT_SECRET,
    (err, verifiedJwt) => {
      if (err) {
        console.log("working");
        res.redirect("/login");
      } else {
        res.sendFile("E:/Backend/public/index.html");
      }
    }
  );
});

// function protectRoute(req, res, next) {
//   console.log(req.cookies.IsLogIn);
//   jwt
//     .verify({ "username": "kiran" }, process.env.JWT_SECRET)
//     .then(() => {
//       console.log("jwt working");
//     })
//     .catch(() => {
//       console.log("jwt not working");
//     });
//   if (req.cookies.IsLogIn == "true") {
//     console.log("working");
//     next();
//   } else {
//     res.redirect("/login");
//   }
// }

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
