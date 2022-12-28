import amqp from "amqplib/callback_api.js";
import env from "dotenv";
import sendMail from "./emailServices.js";
// import { parentPort } from "worker_threads";
env.config();
async function consumer() {
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

      // listen and grab the data send by publisher and send mail
      console.log("consumer started");
      channel.consume(
        "LogIn_Queue",
        function (msg) {
          let Msg = JSON.parse(msg.content.toString());
          sendMail(Msg);
        },
        {
          noAck: true,
        }
      );
    });
  });
}
export default consumer;

// parentPort.on("message", (message) => {
//   console.log("message: " + message);
//   consumer();
//   parentPort.postMessage("sub thread");
// });
