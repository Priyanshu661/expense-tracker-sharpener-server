const jwt=require("jsonwebtoken");
const User = require("../models/User");

const authenticate=async(req,res,next)=>{
    try{
        const token = req.header("Authorization");


        if(!token){
             return res.status(400).json({ success: false, message: "No token found!" });
        }

        const checkToken = await jwt.verify(token, "thisismysecretkey");

        if(!checkToken){
           return res
             .status(400)
             .json({ success: false, message: "Invalid Token or Token Expired!" });
        }

        const userId=checkToken.userId

        const user=await User.findByPk(userId)

        if(!user){
              return res
                .status(400)
                .json({
                  success: false,
                  message: "No User Found",
                });
        }

        req.user=user;

        next();

        

    }
    catch(e){
        console.log(e)
        return res.status(400).json({success:false,message:e})
    }
}


module.exports={
    authenticate
}