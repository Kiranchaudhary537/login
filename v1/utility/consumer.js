var amqp = require("amqplib/callback_api");
const { sendMail } = require("./emailServices");
require("dotenv").config();
const consume = async () => {
  console.log("working");
  amqp.connect(process.env.AMQP_URI, async function (err, connection) {
    if (err) {
      throw err;
    }
    const channel = await connection.createChannel();
    if (channel == err) {
      throw err;
    }
    const exchange = "LogIn";
    await channel.assertExchange(exchange, "fanout", { durable: false });
    channel.consume(
      exchange,
      function (msg) {
        let values = JSON.parse(msg.content.toString());
        console.log(" [x] Received %s", msg.content.toString());
        sendMail(values);
      },
      {
        noAck: true,
      }
    );
  });
};
consume();
// module.exports = { consume };
