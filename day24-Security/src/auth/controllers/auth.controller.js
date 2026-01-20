const config = require("../../config/index");
const { connectDB } = require("../../db");
const jwt = require("jsonwebtoken");
const { sendError } = require("../../utils/sendError");
const bcrypt = require("bcrypt");
const { recordFailure, resetAttempts, isBlocked } = require("../../security/attemptsTracker");
const { delay } = require("../../utils/delay");
const { generateRefreshToken } = require("../refreshToken.services");


const REFRESH_TOKEN_VALIDITY = 7 * (24 * 60 * 60 * 1000); //7 Days 

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
    const userId = user._id.toString();
    const token = jwt.sign(
        { userId , role : "user"},
        config.jwtSecret,
        { expiresIn : config.expiresIn}
    );
    const refreshToken = generateRefreshToken();

    const refresh_tokens = db.collection("refresh_tokens");
    await refresh_tokens.insertOne({
        userId,
        refreshToken,
        expiresAt : new Date(Date.now() + REFRESH_TOKEN_VALIDITY)
    })

    resetAttempts(email);
    res.status(200).json({
        success : true,
        message : "Logged In",
        token,
        refreshToken
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
    const result = await User.create({
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

const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if(!refreshToken){
        return sendError(res,400,"Not Authorized");
    }

    const db = await connectDB();
    const refresh_tokens = db.collection("refresh_tokens");
    const tokenDoc = await refresh_tokens.findOne(
        {refreshToken}
    );
    if(!tokenDoc) return sendError(res,400,"Not Authorized");

    if(Date.now() > tokenDoc.expiresAt){
        return sendError(res,400,"Not Authorized");
    }

    const newAccessToken = jwt.sign(
        {userId : tokenDoc.userId},
        config.jwtSecret,
        { expiresIn : config.expiresIn}
    );

    res.json({ accessToken: newAccessToken });
}

const logout = async (req, res) => {
    const {refreshToken} = req.body;
    if(!refreshToken){
        return sendError(res,400,"Invalid Request");
    }

    const db = await connectDB();
    const refresh_tokens = db.collection("refresh_tokens");
    const result = await refresh_tokens.deleteOne({ refreshToken });
    if(result.deletedCount === 0){
        return sendError(res,400,"Invalid Request");
    }

    res.status(200).json({
        success :true,
        message : "Logged Out"
    })
}
module.exports = { login, signup, refresh, logout }