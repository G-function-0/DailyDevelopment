const connectDB = require("../db");
const sendError = require("../utils/sendError");
const { generateSession } = require("../utils/session");



const login  = async(req,res) => {
    const payload = req.body;
    if(!payload.email)  return sendError(res,400,"Email is Required");

    const db = await connectDB();
    const users = db.collection("users");
    
    const user  = await users.findOne({
        "email" : payload.email
    })
    
    if(!user){
        return sendError(res,404,"User not Found");
    }
    
    const sessionId = generateSession(user._id.toString());

    return res.status(201).json({
        success : true,
        message : "Logged In",
        sessionId
    })
}


module.exports = { login };