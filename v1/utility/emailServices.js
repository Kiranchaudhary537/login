import nodemailer from "nodemailer";
import env from "dotenv";
env.config();
const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b61749d59ad9a7",
    pass: "4301c205302aa8",
  },
});


const sendMail = async (params) => {
  transport.sendMail(
    {
      from: "noreply@loginproject.com",
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
