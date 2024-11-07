require("dotenv").config();
const { Sequelize } = require("sequelize");

const darwinDBSequelize = new Sequelize(
  process.env.DARWINDBNAME,
  process.env.DARWINDBUSER,
  process.env.DARWINDBPASS,
  {
    host: process.env.DARWINDBHOST,
    dialect: process.env.DIALECT,
  }
);

const SSOLogDBSequelize = new Sequelize(
  process.env.SSOLOGDBNAME,
  process.env.SSOLOGDBUSER,
  process.env.SSOLOGDBPASS,
  {
    host: process.env.SSOLOGDBHOST,
    dialect: process.env.DIALECT,
  }
);

module.exports = { darwinDBSequelize, SSOLogDBSequelize };
