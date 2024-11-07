import { Sequelize } from "sequelize";

// Initialize Sequelize (adjust connection settings based on your setup)
const sequelize = new Sequelize(
  process.env.MSSQL_DB!,
  process.env.MSSQL_USER!,
  process.env.MSSQL_PASSWORD!,
  {
    host: process.env.MSSQL_HOST!,
    dialect: "mssql",
  }
);

export default sequelize;
