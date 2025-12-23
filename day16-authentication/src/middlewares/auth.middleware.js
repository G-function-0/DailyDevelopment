const sendError = require("../utils/sendError");
const { getSession } = require("../utils/session");

function authMiddleware(req,res,next){
    const sessionId = req.headers["x-sessionid"];
    if(!sessionId){
        return sendError(res,401,"Not Logged In");
    }

    const session = getSession(sessionId);
    
    if(!session){
        return sendError(res,401,"Not Logged In");
    }

    req.userId = session.userId;
    next();
}

module.exports  = authMiddleware
