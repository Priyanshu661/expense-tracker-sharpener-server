const Sib = require("sib-api-v3-sdk");
const ForgotPassword = require("../models/ForgotPassword");

const emailSender = async (email, subject, content) => {
  try {
    const client = Sib.ApiClient.instance;

    const apiKey = client.authentications["api-key"];

    apiKey.apiKey =
      "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";

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: "priyanshurathore0123@gmail.com",
    };

    const receivers = [
      {
        email: email,
      },
    ];

    console.log(receivers);

    const resp = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: subject,
      textContent: content,
    });


    return "email sent";
  } catch (e) {
    return e;
  }
};

const is_resetpassword_link_active = async (req, res) => {
  try {
    const id = req.params.id;

    const forgotpassword = await ForgotPassword.findOne({
      where: {
        id: id,
      },
    });


    if (!forgotpassword) {
      return res.status(404).json({ success: false, message: "Invalid link" });
    }

    if (!forgotpassword.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "Your link is expired, try again" });
    }
    return res
      .status(200)
      .json({ success: false, message: "Valid" });
  } catch (e) {
    return e;
  }
};

module.exports = {
  emailSender,
  is_resetpassword_link_active
};
