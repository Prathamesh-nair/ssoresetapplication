require("dotenv").config();
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { SSOLogDBSequelize } = require("../services/dbConnect");
const LdapClient = require("ldapjs-client");
const router = Router();

const client = new LdapClient({
  url: process.env.ADURL,
  tlsOptions: { rejectUnauthorized: false, secureProtocol: "TLSv1_2_method" },
});

router.post("/validatecredentials", async (req, res) => {
  const { username, enteredOtp, password, confirmPassword } = req.body;
  const ADUsername = process.env.ADUSERNAME;
  const ADPassword = process.env.ADPASSWORD;

  if (!username || !enteredOtp || !password || !confirmPassword) {
    return res.status(400).json({ Message: "All fields are required." });
  }

  try {
    // Validate OTP and password
    const validationResults = await SSOLogDBSequelize.query(
      `SELECT TOP 1 username, OTP, CreatedOn FROM SSOLog_AngelOne WHERE username = :username ORDER BY CreatedOn DESC;`,
      {
        replacements: { username },
        type: SSOLogDBSequelize.QueryTypes.SELECT,
      }
    );

    if (validationResults.length === 0) {
      return res.status(404).json({ Message: "User not found" });
    }

    const savedOTP = validationResults[0].OTP;
    const isOTPMatched = await bcrypt.compare(enteredOtp, savedOTP);
    const isPasswordMatched = password === confirmPassword;

    if (isOTPMatched && isPasswordMatched) {
      console.log("OTP Matched");
      try {
        await client.bind(ADUsername, ADPassword);

        const options = {
          filter: `(sAMAccountName=${username})`,
          scope: "sub",
          attributes: ["displayName"],
        };
        const searchResults = await client.search("dc=angelone,dc=in", options);
        console.log(searchResults);
        // Prathamesh Nair
        if (!searchResults || searchResults.length === 0) {
          // await client.unbind();
          return res.status(404).json({ Message: "User not found in LDAP." });
        }

        const userDN = searchResults[0].dn;
        console.log(userDN);
        const encodedPassword = Buffer.from(`"${password}"`, "utf16le");
        // Modify user password in AD
        const response = await client.modify(userDN, [
          {
            operation: "replace",
            modification: {
              userPassword: encodedPassword,
            },
          },
        ]);
        console.log(response);
        // await client.unbind();
        return res
          .status(200)
          .json({ Message: "Password updated successfully." });
      } catch (error) {
        console.error("LDAP error:", error);
        // await client.unbind();
        return res
          .status(500)
          .json({ Message: "Failed to update password in LDAP" });
      } finally {
        await client.unbind();
      }
    } else {
      return res
        .status(403)
        .json({ Message: "OTP and/or password do not match" });
    }
  } catch (error) {
    console.error("Error while validating the credentials:", error);
    return res.status(500).json({ Message: "Server error. Please try again." });
  }
});

module.exports = router;
