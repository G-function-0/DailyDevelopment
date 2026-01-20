import crypto from "crypto";

export const generateRefreshToken = ()=>  {
    const token = crypto.randomBytes(40).toString("hex");
    return token;
}