import mongoose, { Schema } from "mongoose";


const refreshTokenSchema =new mongoose.Schema({
        refreshToken : {
            type :  String,
            index : true,
            unique :  true,
        },
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        expiresAt : {
            type : Date,
            required :  true,
            index : { expires : 0}
        }
    },
    {
        timestamps :  true
    }
);

const RefreshTokenModel = mongoose.model("RefreshToken",refreshTokenSchema);

export {RefreshTokenModel};