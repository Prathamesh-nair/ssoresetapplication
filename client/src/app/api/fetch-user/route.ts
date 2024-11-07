import sequelize from "@/lib/sequelize";
// import { QueryTypes } from "sequelize";
import { NextApiRequest, NextApiResponse } from "next";

// API handler function
export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    // Parse the request body to get the domain
    const { domain } = req.body;

    // Ensure the domain is provided
    if (!domain) {
      return res
        .status(400)
        .json({ success: false, message: "Domain name is required" });
    }

    // Raw SQL query to check if the user with the given domain exists and is active
    const query = `select top 10 [DomainId], [Status] from [DarwinBoxMiddleware].[dbo].[tbl_EmployeeMaster]  where DomainId = :domain`;
    const [user] = await sequelize.query(query, {
      replacements: { domain },
      // type: sequelize.QueryTypes.SELECT,
    });

    console.log("User:", user);
    return;

    // If user is not found or inactive
    // if (!user || !user.active) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Invalid Domain name" });
    // }

    // // If the user is found and active, return their details
    // return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error checking user:", error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
}
