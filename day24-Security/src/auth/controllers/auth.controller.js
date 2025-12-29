const config = require("../../config/index");
const { connectDB } = require("../../db");
const jwt = require("jsonwebtoken");
const { sendError } = require("../../utils/sendError");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const { recordFailure, resetAttempts, isBlocked } = require("../../security/attemptsTracker");
const { delay } = require("../../utils/delay");




const login = async  (req , res ) =>{

    await delay(1000);
    if(!req.body.email || !req.body.password) {
        return sendError(res,400, "Email & Password are required");
    }
    const { email, password } = req.body;

    if(isBlocked(email)){
        return sendError(res,400, "Invalid Credentials");
    }


    const db = await connectDB();
    const users = db.collection("users");
    const user = await users.findOne({
        "email" : email
    })

    if(!user){
        return sendError(res,404,"User Not Found");
    }
    const isMatched = await bcrypt.compare(password,user.hashPassword);
    if(!isMatched){
        recordFailure(email);
        return sendError(res,400,"invalid credentials")
    }

    const token = jwt.sign(
        { userId : user._id.toString(), role : "user"},
        config.jwtSecret,
        { expiresIn : config.expiresIn}
    );
    resetAttempts(email);
    res.status(200).json({
        success : true,
        message : "Logged In",
        token
    })
} 

const signup = async (req, res) => {
    const {name, email ,password } = req.body;
    if(!name || !email  || !password){
        return sendError(res,400,"Both name , email and Password are required");
    }
    const db = await connectDB();
    const users = db.collection("users");
    const existingUser = await users.findOne({ email });
    if(existingUser){
        return sendError(res,400, "User already exists");
    }

    const hashPassword =await bcrypt.hash(password,10);
    const result = await users.insertOne({
        name,
        email,
        hashPassword,
        role : "user"
    })

    const token = jwt.sign({ userId : result.insertedId.toString(), role: "user"},
     config.jwtSecret,
      {expiresIn : config.expiresIn})
      return res.status(201).json({
        success : true,
        message : "User Registered and Logged In",
        token
      })
}

module.exports = { login, signup }