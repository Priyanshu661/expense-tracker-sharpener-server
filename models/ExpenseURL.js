const Sequelize = require("sequelize");
const sequelize = require("../database/db");

const ExpenseURL = sequelize.define("ExpenseURL", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  expense_url: {
    type: Sequelize.STRING,
  },
 
});

module.exports = ExpenseURL;
