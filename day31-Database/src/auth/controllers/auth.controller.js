import config from "../../config/index.js";
import jwt from "jsonwebtoken";
import { sendError } from "../../utils/sendError.js";
import bcrypt from "bcrypt";
import { recordFailure, resetAttempts, isBlocked } from "../../security/attemptsTracker.js";
import { delay } from "../../utils/delay.js";
import { generateRefreshToken } from "../refreshToken.services.js";
import { UserModel } from "../../models/User.js";
import { RefreshTokenModel } from "../../models/Refresh.js";


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


    const user = await UserModel.findOne({
        email
    })

    if(!user){
        return sendError(res,404,"User Not Found");
    }
    const isMatched = await bcrypt.compare(password,user.hashedPassword);
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

    await RefreshTokenModel.insertOne({
        userId,
        refreshToken,
        expiresAt : new Date(Date.now() + REFRESH_TOKEN_VALIDITY)
    })

    resetAttempts(email);
    return res.status(200).json({
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

    const existingUser = await UserModel.findOne({ email });
    if(existingUser){
        return sendError(res,400, "User already exists");
    }

    const hashedPassword =await bcrypt.hash(password,10);
    const user = await UserModel.create({
        name,
        email,
        hashedPassword,
        role : "user"
    })
    const userId = user._id.toString();
    
    const token = jwt.sign({ userId , role: "user"},
     config.jwtSecret,
      {expiresIn : config.expiresIn})

    const refreshToken = generateRefreshToken();
    await RefreshTokenModel.insertOne({
        refreshToken,
        userId,
        expiresAt : new Date(Date.now() + REFRESH_TOKEN_VALIDITY)
    })
      return res.status(201).json({
        success : true,
        message : "User Registered and Logged In",
        token,
        refreshToken
      })
}

const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if(!refreshToken){
        return sendError(res,400,"Not Authorized");
    }

    const tokenDoc = await RefreshTokenModel.findOne(
        {
            refreshToken,
            expiresAt : { $gt : new Date()}
        }
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

    return res.json({ accessToken: newAccessToken });
}

const logout = async (req, res) => {
    const {refreshToken} = req.body;
    if(!refreshToken){
        return sendError(res,400,"Invalid Request");
    }

    const result = await RefreshTokenModel.deleteOne({ refreshToken });

    if(result.deletedCount === 0){
        return sendError(res,400,"Invalid Request");
    }

    res.status(200).json({
        success :true,
        message : "Logged Out"
    })
}

export { login, signup, refresh, logout };