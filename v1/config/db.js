const mongoose = require("mongoose");
require("dotenv").config();

const options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.set("strictQuery", false);
const db = async () => {
  mongoose
    .connect(process.env.MONGO_URI, options)
    .then(() => {
      console.log("mangodb connected");
    })
    .catch(() => {
      console.log("error while connecting");
    });
};
module.exports = { db };
