const axios = require("axios");
const { Router } = require("express");
const { sendNodeMail } = require("../services/sendMailer");
const logger = require("../services/logger");
const { SSOLogDBSequelize } = require("../services/dbConnect");
const router = Router();
const bcrypt = require("bcryptjs");

// Middleware to validate contact and email
const handleValidateUser = async (req, res, next) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  try {
    const response = await axios.post(
      "https://darwinboxmiddleware.angelbroking.com/api/DarwinBox/MobileEmailFromDomainId",
      { DomainId: username },
      { timeout: 5000 }
    );

    if (!response.data?.Mobile || !response.data?.Email) {
      return res.status(404).json({
        success: false,
        status: "User's contact information not found.",
      });
    }

    req.userContactInfo = {
      Mobile: response.data.Mobile,
      Email: response.data.Email,
    };

    next();
  } catch (error) {
    logger.error("Error fetching user contact information:", { error });
    return res.status(500).json({ message: "Error fetching user data." });
  }
};

router.post("/sendOTP", handleValidateUser, async (req, res) => {
  const { username, empName } = req.body;

  console.log("SendOTP Route:", empName);

  if (!req.userContactInfo) {
    return res.status(400).json({
      success: false,
      status: "User contact information is missing.",
    });
  }

  const { Mobile, Email } = req.userContactInfo;

  try {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const mobileNumber = `+91${Mobile}`;

    const saltRounds = 10;
    const hashedGeneratedOTP = await bcrypt.hash(generatedOTP, saltRounds);

    const otpResult = await SSOLogDBSequelize.query(
      `INSERT INTO SSOLog_AngelOne (username, OTP, CreatedOn) VALUES (:username, :hashedGeneratedOTP, :createdOn)`,
      {
        replacements: {
          username,
          hashedGeneratedOTP,
          createdOn: new Date().toISOString().slice(0, 19).replace("T", " "), // Format date as "YYYY-MM-DD HH:MM:SS"
        },
        type: SSOLogDBSequelize.QueryTypes.INSERT,
      }
    );

    if (!otpResult) {
      console.log("Error while inserting OTP in DB.");
    } else {
      console.log("OTP details added in DB.");
    }

    const smsUrl =
      "https://notification-prod.angelone.in/notifications/v2/otp/send";
    const token = process.env.SMSTOKEN;

    const smsRequestBody = {
      sms: {
        dlt_template_id: "1307162798837126439",
        destination_mobile: mobileNumber,
        body: `Your OTP verification code is ${generatedOTP}. Please enter the verification code and submit your details to proceed further. Regards - Angel One`,
        message_type: "TRANSACTIONAL",
      },
      reqid: "A17EDCD1BE4843EE8BA2",
      notification_type: "sso_otp",
    };

    const emailBody = `Dear ${empName},<br /><br />
      Your One-Time Password (OTP) for verification is: <b>${generatedOTP}</b><br /><br />
      Please enter the OTP to complete the password reset process.<br /><br />
      This is an automated message; please do not reply. If you have any questions or need further assistance, contact the IT support desk at ITSupportdesk@angelbroking.com.<br /><br />
      Best regards,<br />
      Technology Team`;

    const emailSubject = "OTP Verification for Password Reset";

    const smsSuccess = await sendSMS(smsUrl, smsRequestBody, token);
    const emailSuccess = await sendEmail(Email, emailSubject, emailBody);

    // Log the results of sending SMS and email
    logger.info("OTP sending results", {
      username,
      mobile: mobileNumber,
      email: Email,
      smsSent: smsSuccess,
      emailSent: emailSuccess,
    });

    if (smsSuccess && emailSuccess) {
      logger.info(`OTP has been sent successfully to ${username}.`);
      return res.status(200).json({
        success: true,
        status: "OTP sent successfully.",
        mobile: mobileNumber,
        otp: generatedOTP,
      });
    } else {
      return res.status(500).json({
        success: false,
        status: `OTP sending encountered issues. SMS sent: ${smsSuccess}, Email sent: ${emailSuccess}`,
      });
    }
  } catch (error) {
    logger.error("Error in handleSendOTP:", { error });
    console.log("Error in handleSendOTP:", error);
    return res.status(500).json({
      success: false,
      status: "An error occurred while processing the request.",
    });
  }
});

// Helper function to send SMS
const sendSMS = async (url, body, token) => {
  try {
    await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });
    return true;
  } catch (error) {
    logger.warn("Error sending SMS:", { error });
    return false;
  }
};

// Helper function to send Email
const sendEmail = async (to, subject, body) => {
  try {
    await sendNodeMail(to, subject, body);
    return true;
  } catch (error) {
    logger.warn("Error sending Email:", { error });
    return false;
  }
};

module.exports = { handleValidateUser, router };
