// server.js or routes/updatePassword.js
const express = require("express");
const ldap = require("ldapjs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const ldapClient = ldap.createClient({
  url: "ldap://10.253.34.21", // Replace with your AD server URL
});

// Middleware to authenticate the user if needed
// Example for updating password
app.post("/api/update-password", async (req, res) => {
  const { newPassword } = req.body;
  const userDN = "CN=Prathamesh Nair,OU=Users,DC=angelbroking,DC=COM"; // Replace with your user's DN

  // Bind as an admin user to allow password modifications
  ldapClient.bind("Passadmin", "OKVq#PvI2O83@3@$O", (err) => {
    if (err) {
      console.error("Bind error:", err);
      return res.status(500).json({ message: "Failed to authenticate" });
    }

    // Modify password
    const change = new ldap.Change({
      operation: "replace",
      modification: { userPassword: newPassword },
    });

    ldapClient.modify(userDN, change, (err) => {
      if (err) {
        console.error("Password update error:", err);
        return res.status(500).json({ message: "Password update failed" });
      }

      res.json({ message: "Password updated successfully" });
      ldapClient.unbind(); // Unbind from LDAP server after operation
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
