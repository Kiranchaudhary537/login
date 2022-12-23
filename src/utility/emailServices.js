import nodemailer from "nodemailer";
import env from "dotenv";
env.config();
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendMail = async (params) => {
  console.log(process.env.EMAIL);
  transport.sendMail(
    {
      from: process.env.GMAIL_EMAIL,
      to: params.to,
      subject: "verification otp",
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Thanks for using 2 Factor authentication</h2>
          <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
     </div>
      `,
    },
    (err, response) => {
      if (err) {
        console.log("error ", err);
      } else {
        console.log("responss", response);
      }
    }
  );
};
export default sendMail;
