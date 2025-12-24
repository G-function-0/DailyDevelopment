const config = require("../config");
const { sendError } = require("../utils/sendError");
const jwt = require("jsonwebtoken");


const authMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return sendError(res,401,"Missing token");
    }


    const token = authHeader.split(" ")[1];

    if(!token){
        return sendError(res,401,"Invalid token format");
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return sendError(res,401,"Invalid or expired Token");
    }


}

module.exports = authMiddleware;