
const { ObjectId } = require("mongodb");
const { connectDB } = require("../db/index");
const { sendError } = require("../utils/sendError");


const getUser = async(req , res)  => {
    const userId  = req.userId;
    if(!userId) return sendError(res,400,"Unauthenticated")
    
    const db  = await connectDB();
    const users = db.collection("users");

    const user =  await users.findOne({_id : new ObjectId(userId)});
    if(!user){
        return sendError(res,404,"User Not Found");
    }
    
    return res.status(200).json({
        success : true,
        message : "user found",
        user
    })
}

const deleteUser = async (req,res) => {
    const userId = req.params.id;
    const db = await connectDB();
    const users = db.collection("users");

    const result =await users.deleteOne({_id : new ObjectId(userId)});
    if(result.deletedCount === 0) {
        return sendError(res, 404, "User not found");
    }
    res.status(200).json({
        success : true,
        message : "User Deleted"
    })
}
module.exports = { getUser,  deleteUser}

