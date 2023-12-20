const Razorpay = require("razorpay");
const Order = require("../models/Order");
const User = require("../models/User");
const sequilize = require("../database/db");

const purchase_premium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEYID,
      key_secret: process.env.RAZORPAY_KEYSECRET,
    });

    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        return res.status(400).json({ success: false, message: err });
      }
      req.user
        .createOrder({ orderid: order.id, status: "Pending" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((e) => {
          console.log(e);

          return res.status(400).json({ success: false, message: e });
        });
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, message: e });
  }
};

const update_order = async (req, res) => {
  const t = await sequilize.transaction();
  try {
    const { razorpay_order_id, razorpay_payment_id } = req.body;

    await Order.update(
      {
        paymentid: razorpay_payment_id,
        status: "Successfull",
      },
      {
        where: {
          orderid: razorpay_order_id,
        },
        transaction: t,
      }
    );

    await User.update(
      {
        isPremium: true,
      },
      {
        where: {
          id: req.user.id,
        },
        transaction: t,
      }
    );
    await t.commit();
    return res.status(200).json({ message: "order updated" });
  } catch (e) {
    console.log(e);
    await t.rollback();
    return res.status(400).json({ success: false, message: e });
  }
};

module.exports = {
  purchase_premium,
  update_order,
};
