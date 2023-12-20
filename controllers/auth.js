const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const sequilize = require("../database/db");
const { emailSender } = require("../miscellaneous/email_sender");

const { v4: uuidv4 } = require("uuid");
const ForgotPassword = require("../models/ForgotPassword");

const signup = async (req, res) => {
  const t = await sequilize.transaction();
  try {
    const { name, email, phone, password } = req.body;

    const user = await User.findOne({
      where: {
        email: email,
      },
      transaction: t,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create(
      {
        name,
        email,
        phone,
        password: hashedPassword,
      },
      {
        transaction: t,
      }
    );

    t.commit();

    return res.status(200).json({ message: "Account Created" });
  } catch (e) {
    console.log(e);
    await t.rollback();
    return res.status(400).json({ message: "server error" });
  }
};

const login = async (req, res) => {
  const t = await sequilize.transaction();
  try {
    const { email, password } = req.body;

    console.log(req.headers.Authorization);

    const user = await User.findOne({
      where: {
        email: email,
      },
      transaction: t,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const token = await jwt.sign(
      { userId: user.id, isPremium: user.isPremium },
      "thisismysecretkey"
    );

    await t.commit();

    return res.status(200).json({
      message: "Login Successfull",
      token,
      isPremium: user.isPremium,
    });
  } catch (e) {
    console.log(e);
    await t.rollback();
    return res.status(400).json({ message: "Server Error" });
  }
};

const forgot_password = async (req, res) => {
  const t = await sequilize.transaction();
  try {
    const { email } = req.body;

    const subject = "Reset Password link";

    const id = uuidv4();

    const user = await User.findOne({
      where: {
        email: email,
      },
      transaction: t,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No User Found with this mail id" });
    }

    await ForgotPassword.create(
      {
        id: id,
        isActive: true,
        UserId: user.id,
      },
      {
        transaction: t,
      }
    );

    const content = `${process.env.CLIENT_URL}/resetPassword/${id}`;

    const msg = await emailSender(email, subject, content);

    console.log(msg);

    await t.commit();

    return res.status(200).json({
      message: "Email Sent",
    });
  } catch (e) {
    console.log(e);
    await t.rollback();
    return res.status(400).json({ message: "Server Error" });
  }
};

const reset_password = async (req, res) => {
  const t = await sequilize.transaction();
  try {
    const { id, password } = req.body;

    const forgotpassword = await ForgotPassword.findOne({
      where: {
        id: id,
      },
      transaction: t,
    });

    if (!forgotpassword.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "Your link is expired, try again" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          id: forgotpassword.UserId,
        },
        transaction: t,
      }
    );

    forgotpassword.isActive = false;

    await forgotpassword.save();

    await t.commit();

    return res.status(200).json({
      message: "Password  updated",
    });
  } catch (e) {
    console.log(e);
    await t.rollback();
    return res.status(400).json({ message: "Server Error" });
  }
};

module.exports = {
  signup,
  login,
  forgot_password,
  reset_password
};
