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

function requiredOwner(getUserId){
    return async function (req,res,next) {
        const id = await getUserId(req);
        if(!id) return sendError(res,404,"Resource Not Found");

        if(id.toString() !== req.userId){
            return sendError(res,403,"Forbidden");
        }

        next();
    }
}
module.exports ={ authMiddleware, requiredOwner};