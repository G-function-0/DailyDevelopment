const { ObjectId } = require("mongodb");
const connectDB = require("../db/index")


exports.getAllUsers = async(req,res) => {
    console.log("hello")
    const db = await connectDB();
    const users = db.collection("users");
    const userId = req.userId;
    const user = await users.findOne({_id : new ObjectId(userId)});

    return res.status(200).json({
        success :true,
        message: "returning all users",
        user
    })
}