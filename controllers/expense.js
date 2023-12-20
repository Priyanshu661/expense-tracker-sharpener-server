const  Sequelize  = require("sequelize");
const sequilize = require("../database/db");
const Expense = require("../models/Expense");
const User = require("../models/User");
const upload_to_s3 = require("../miscellaneous/aws_sdk");

const addExpense = async (req, res) => {
  const t = await sequilize.transaction();
  try {
    const { amount, description, category } = req.body;

    await Expense.create(
      {
        amount,
        description,
        category,
        UserId: req.user.id,
      },
      {
        transaction: t,
      }
    );

    let total_amount = 0;
    if (req.user.totalExpenseAmount) {
      total_amount = Number(req.user.totalExpenseAmount) + Number(amount);
    } else {
      total_amount = Number(amount);
    }

    await User.update(
      {
        totalExpenseAmount: total_amount,
      },
      {
        where: {
          id: req.user.id,
        },
        transaction: t,
      }
    );

    await t.commit();
    return res.status(200).json({ message: "Expense Added" });
  } catch (e) {
    console.log(e);
    await t.rollback();
    return res.status(400).json({ message: "Server Error" });
  }
};

const fecth_expenses = async (req, res) => {
  try {

    const page=req.query.page;



    const limit = parseInt(req.query.limit);

    const skip = limit * (page - 1);


    const expensesCount=await Expense.count({
      where:{
        UserId:req.user.id
      }
    })

    const lastYear=new Date();
    const lastMonth=new Date()

    lastYear.setFullYear(lastYear.getFullYear()-1)
    lastMonth.setMonth(lastMonth.getMonth() - 1);


    console.log(lastMonth,lastYear)

    const yearlyExpenseAmount = await req.user.getExpenses({
      where: {
        createdAt: {
          [Sequelize.Op.gte]: lastYear,
        },
      },
      attributes: [
        [sequilize.fn("sum", sequilize.col("amount")), "total_expense"],
      ],
    });


      const monthlyExpenseAmount = await req.user.getExpenses({
        where: {
          createdAt: {
            [Sequelize.Op.gte]: lastMonth,
          },
        },
        attributes:[[sequilize.fn("sum",sequilize.col("amount")),"total_expense"]]
      });


   

    const expenses = await req.user.getExpenses({
      limit: limit,
      offset: skip,
    });


    // const expenses = await Expense.findAll({
    //   where: {
    //     UserId: req.user.id,
    //   },
    // });

    return res.status(200).json({ data: expenses,expensesCount,monthlyExpenseAmount,yearlyExpenseAmount });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Server Error" });
  }
};

const delete_expense = async (req, res) => {
  const t = await sequilize.transaction();
  try {
    const id = req.params.id;

    const expense = await Expense.findOne({
      where: {
        id: id,
      },
    });

    const result = await Expense.destroy({
      where: {
        UserId: req.user.id,
        id: id,
      },
      transaction: t,
    });

    if (!result) {
      return res
        .status(400)
        .json({ message: "You are not allowed to delete this expense" });
    }

    let total_amount = 0;

    total_amount = Number(req.user.totalExpenseAmount) - Number(expense.amount);

    await User.update(
      {
        totalExpenseAmount: total_amount,
      },
      {
        where: {
          id: req.user.id,
        },
        transaction: t,
      }
    );

    await t.commit();

    return res.status(200).json({ message: "Expense Deleted" });
  } catch (e) {
    console.log(e);
    await t.rollback();

    return res.status(400).json({ message: "Server Error" });
  }
};

const download_expenses = async (req, res) => {
  try {
    const expenses = await req.user.getExpenses();

    const stringifiedData = JSON.stringify(expenses);

    const userId = req.user.id;
    const filename = `Expenses/${userId}/${new Date()}`;

    const fileUrl = await upload_to_s3(filename, stringifiedData);

    await req.user.createExpenseURL({
      expense_url: fileUrl?.Location,
    });

    return res.status(200).json({ data: fileUrl });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Server Error" });
  }
};

module.exports = {
  addExpense,
  fecth_expenses,
  delete_expense,
  download_expenses,
};
