import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true
        },
        hashedPassword : {
            type: String,
            required : true,
        },
        role : {
            type: String,
            enum : ["user","admin"],
            default : "user"
        },

    },
    {
        timestamps :true
    }
);
const UserModel =mongoose.model("User",userSchema);

export {UserModel};