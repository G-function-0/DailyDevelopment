const crypto = require("crypto");


exports.generateRefreshToken = ()=>  {
    const token = crypto.randomBytes(40).toString("hex");
    return token;
}