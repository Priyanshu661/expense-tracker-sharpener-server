const Sequelize = require("sequelize");
const sequelize = require("../database/db");

const Order = sequelize.define("Order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  orderid: {
    type: Sequelize.STRING,
  },
  paymentid: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
});

module.exports = Order;
