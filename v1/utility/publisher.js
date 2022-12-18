var amqp = require("amqplib/callback_api");
const { consume } = require("./consumer");
require("dotenv").config();

// const queue = amqp.connect(process.env.AMQP_URI, function (error0, connection) {
//   if (error0) {
//     throw error0;
//   }
//   connection.createChannel(function (error1, channel) {
//     if (error1) {
//       throw error1;
//     }
//     var exchange = "login";
//     var msg = process.argv.slice(2).join(" ") || "Hello World!";

//     channel.assertExchange(exchange, "fanout", {
//       durable: false,
//     });
//     channel.publish(exchange, "", Buffer.from(msg));
//     console.log(" [x] Sent %s", msg);
//   });

//   setTimeout(function () {
//     connection.close();
//     process.exit(0);
//   }, 500);
// });

const queue = async (msg) => {
  amqp.connect(process.env.AMQP_URI, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = "LogIn";

      channel.assertExchange(exchange, "fanout", {
        durable: false,
      });
      channel.publish(exchange, "", Buffer.from(JSON.stringify(msg)));
      console.log(" [x] Sent %s", msg);
    });

    setTimeout(function () {
      consume();
      connection.close();
      process.exit(0);
    }, 500);
  });
};
module.exports = { queue };
