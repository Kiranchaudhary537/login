const amqp = require("amqplib/callback_api");
const { sendMail } = require("./emailServices.js");
require("dotenv").config();
const consume = async () => {
  //   console.log("working");
  amqp.connect(process.env.AMQP_URI, async function (err, connection) {
    if (err) {
      throw err;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = "LogIn";

      channel.assertExchange(exchange, "fanout", {
        durable: false,
      });

      channel.assertQueue(
        "",
        {
          exclusive: true,
        },
        function (error2, q) {
          if (error2) {
            throw error2;
          }
          console.log(
            " [*] Waiting for messages in %s. To exit press CTRL+C",
            q.queue
          );
          channel.bindQueue(q.queue, exchange, "");

          channel.consume(
            q.queue,
            function (msg) {
              if (msg.content) {
                console.log(" re %s", JSON.parse(msg.content));
                // sendMail(JSON.parse(msg.content));
                sendMail({ to: "kiranchaudhary537@gmail.com", OTP: "01" });
              }
            },
            {
              noAck: true,
            }
          );
        }
      );
    });
  });
};
// consume();
module.exports = { consume };
