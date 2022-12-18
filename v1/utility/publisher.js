var amqp = require("amqplib/callback_api");
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
  amqp.connect(process.env.AMQP_URI, async function (err, connection) {
    if (err) {
      console.log("connection error");
      throw err;
    }
    const channel = await connection.createChannel();
    if (channel == err) {
      console.log("channel error");
      throw err;
    }
    const exchange = "LogIn";
    await channel.assertExchange(exchange, "fanout", { durable: false });
    channel.publish(exchange, Buffer.from(JSON.stringify(msg)));
    setTimeout(() => {
      connection.close();
      process.exit();
    }, 1000);
  });
};
module.exports = { queue };
