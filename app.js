require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequilize = require("./database/db");

const helmet=require("helmet")
const morgan = require("morgan");
const fs=require("fs")
const path = require("path");

// const compression=require("compression")
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet())
// app.use(compression());



const accessLogStream=fs.createWriteStream(
  path.join(__dirname,"access.log"),
  {flags:"a"}
)

morgan("combined", {
  skip: function (req, res) {
    return res.statusCode < 400;
  },
},{ stream: accessLogStream });
app.use(morgan("combined", { stream: accessLogStream }));




const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premium");

app.use("/auth", authRoutes);
app.use("/expense", expenseRoutes);
app.use("/order", purchaseRoutes);
app.use("/premium", premiumRoutes);

const Expense = require("./models/Expense");
const User = require("./models/User");
const Order = require("./models/Order");
const ForgotPassword = require("./models/ForgotPassword");
const ExpenseURL = require("./models/ExpenseURL");



User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword)

User.hasMany(ExpenseURL);


sequilize
  // .sync({ force: true })
  .sync()

  .then((res) => {
    app.listen(process.env.PORT, () => {
      console.log("port is running on 5000");
    });
    console.log("db connected");
  })
  .catch((e) => {
    console.log(e);
  });
