// Updated code for routes/userSearch.js
const { Router } = require("express");
const router = Router();
const { darwinDBSequelize } = require("../services/dbConnect");

// Middleware to validate request body
const validateRequest = (req, res, next) => {
  const { username } = req.body;
  if (!username) {
    return res
      .status(400)
      .json({ message: "Username not found. Kindly enter a valid username." });
  }
  next();
};

// Search user route
router.post("/searchUser", validateRequest, async (req, res, next) => {
  const { username } = req.body;

  try {
    const [results] = await darwinDBSequelize.query(
      `SELECT Emp_no, Emp_Name, [Status], DomainId FROM [DarwinBoxMiddleware].[dbo].[tbl_EmployeeMaster] WHERE DomainId = :username`,
      {
        replacements: { username },
        type: darwinDBSequelize.QueryTypes.SELECT,
      }
    );

    if (!results || results.Status !== "Active") {
      return res.status(404).json({
        message:
          "Username not found or is inactive. Kindly enter a valid username.",
      });
    }
    // Proceed to the next middleware or route handler
    return res
      .status(200)
      .json({ username: results.DomainId, empName: results.Emp_Name });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
