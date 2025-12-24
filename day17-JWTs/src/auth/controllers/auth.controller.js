const config = require("../../config/index");
const { connectDB } = require("../../db");
const jwt = require("jsonwebtoken");
const { sendError } = require("../../utils/sendError");





const login = async  (req , res ) =>{
    const { email } = req.body;
    if(!email) {
        return sendError(res,400, "Email is required");
    }
    const db = await connectDB();
    const users = db.collection("users");
    const user = await users.findOne({
        "email" : email
    })

    if(!user){
        return sendError(res,404,"User Not Found");
    }

    const token = jwt.sign(
        { userId : user._id.toString()},
        config.jwtSecret,
        { expiresIn : config.expiresIn}
    );
    res.status(200).json({
        success : true,
        message : "Logged In",
        token
    })
} 

module.exports = { login }