const User = require("../models/User");
const Expense = require("../models/Expense");
const sequilize = require("../database/db");

const fetch_leaderboard = async (req, res) => {
  try {
    // const data = await Expense.findAll({
    //     attributes:["UserId",[sequilize.fn("sum",sequilize.col("amount")),"total_cost"]],
    //     group:["UserId"]
    // });

    // const data = await User.findAll({
    //   attributes: [
    //     "id",
    //     "name",
    //     [sequilize.fn("sum", sequilize.col("amount")), "total_cost"],
    //   ],
    //   include: [
    //     {
    //       model: Expense,
    //       attributes: [],
    //     },
    //   ],
    //   group: ["user.id"],
    //   order: [["total_cost", "DESC"]],
    // });

    const data = await User.findAll({
      attributes: ["id", "name", "totalExpenseAmount"],

      order: [[ "totalExpenseAmount","DESC"]],
    });

    // const userIds = userData.map((item) => {
    //   return {
    //     id: item.id,
    //     name: item.name,
    //   };
    // });

    // const data = [];

    // for (let i = 0; i < userIds.length; i++) {
    //   let expense = 0;
    //   for (let j = 0; j < expenseData.length; j++) {
    //     if (userIds[i].id === expenseData[j].UserId) {
    //       expense += expenseData[j].amount;
    //     }
    //   }

    //   data.push({
    //     name: userIds[i].name,
    //     expense: expense,
    //   });
    // }

    return res.status(200).json({ data });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, message: "server error" });
  }
};

module.exports = {
  fetch_leaderboard,
};
