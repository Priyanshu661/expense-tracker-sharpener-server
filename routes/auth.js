const express=require("express")
const { signup, login, forgot_password, reset_password } = require("../controllers/auth");
const { authenticate } = require("../middlewares/auth");
const { is_resetpassword_link_active } = require("../miscellaneous/email_sender");


const router=express.Router()




router.post("/signup", signup);
router.post("/login", login);


router.post("/password/forgotpassword", forgot_password);
router.get("/password/is-link-active/:id", is_resetpassword_link_active);

router.post("/password/resetPassword", reset_password);






module.exports=router