const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    type: "custom",
    user: "a09b30fcace66d",
    pass: "a42f7d7746afe6",
  },
});
// const transport = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.MAIL_EMAIL,
//     pass: process.env.MAIL_PASSWORD,
//   },
// });

module.exports.sendMail = async (params) => {
  try {
    let info = await transport.sendMail({
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
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};

