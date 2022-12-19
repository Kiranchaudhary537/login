import bcrypt from "bcrypt";
import UserModal from "../modal/LogInModal.js";
import VerifyModal from "../modal/VerifyModal.js";
import amqp from "amqplib/callback_api.js";
import env from "dotenv";
env.config();

export const findUserByUsername = async (username) => {
  const User = await UserModal.findOne({
    username,
  });
  return User;
};

export const findUserByEmailForOto = async (email) => {
  const User = await VerifyModal.findOne({
    email,
  });
  return User;
};

export const saveNewOtpForUser = async (email, otp) => {
  const newOTP = new VerifyModal({
    email: email,
    otp: bcrypt.hashSync(otp, 10),
    created: Date.now(),
    expired: Date.now() + 60000,
  });

  await newOTP
    .save()
    .then(() => {
      // producer for "LogIn_Queue";

      amqp.connect(process.env.AMQP_URI, function (error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function (error1, channel) {
          if (error1) {
            throw error1;
          }

          channel.assertQueue("LogIn_Queue", {
            durable: false,
          });

          channel.sendToQueue(
            "LogIn_Queue",
            Buffer.from(JSON.stringify({ to: email, OTP: otp }))
          );
        });
      });

      return "success";
    })
    .catch((e) => {
      return "failed" + e;
    });
};

export const findUserAndUpdate = async (email, otp) => {
  await VerifyModal.findOneAndUpdate(
    {
      email,
    },
    { expired: Date.now() + 60000, otp: bcrypt.hashSync(otp, 10) }
  )
    .then(() => {
      // producer for "LogIn_Queue";
      amqp.connect(process.env.AMQP_URI, function (error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function (error1, channel) {
          if (error1) {
            throw error1;
          }

          channel.assertQueue("LogIn_Queue", {
            durable: false,
          });

          // send the json-stringified data to the consumer
          // consumer will push the email sending process in a queue
          channel.sendToQueue(
            "LogIn_Queue",
            Buffer.from(JSON.stringify({ to: email, OTP: otp }))
          );
        });
      });
      return "sucess";
    })
    .catch((e) => {
      return "failed" + e;
    });
};

export const findEmailAndDelete = async (email) => {
  await VerifyModal.findOneAndDelete({
    email,
  })
    .then(() => {
      return "success";
    })
    .catch((e) => {
      return "failed" + e;
    });
};
