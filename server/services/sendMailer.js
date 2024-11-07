require("dotenv").config();
const nodemailer = require("nodemailer");

const sendFrom = "recordingauth@angelbroking.com";

//Local machine Nodemailer Function.
const sendNodeMail = async function (to, sub, html) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: sendFrom, // Your email address
      pass: "Angelbroking12453", // Your email password or app-specific password
    },
  });

  let info = await transporter.sendMail({
    from: sendFrom, // sender address
    to: to, // list of receivers
    subject: sub, // Subject line
    html: html, // html body,
  });
  console.log("Message sent: %s", info.messageId);
};

module.exports = { sendNodeMail };
