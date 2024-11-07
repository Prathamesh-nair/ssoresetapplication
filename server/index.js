const express = require("express");
const cors = require("cors");
const app = express();
const port = 5001;

// Custom imports
const userSearchRoute = require("./routes/userSearch");
const { router: userSendOTP } = require("./routes/sendOTP");
const validateCredentials = require("./routes/validateCredentials");

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true, // Enable credentials (cookies)
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Custom Routes
app.use("/api", userSearchRoute);
app.use("/api", userSendOTP);
app.use("/api", validateCredentials);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
