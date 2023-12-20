const Sequelize = require("sequelize");
const sequelize = require("../database/db.js");

const ForgotPassword = sequelize.define("ForgotPassword", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
  },
});


module.exports=ForgotPassword
