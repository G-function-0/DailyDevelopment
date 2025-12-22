const { ObjectId } = require("mongodb");
const connectDB = require("../db")
const asyncHandler = require("../utils/asyncHandler")
const sendError = require("../utils/sendError");


const getAllUsers = asyncHandler(async(req,res) => {
    const db = await connectDB();
    const users = db.collection("users");
    const allUsers = await users.find({}).toArray();
    return res.status(200).json({
        success:true,
        message: "all users",
        allUsers
    })
})

const postThisUser = asyncHandler(async(req,res)=>{
    const payload = req.body;
    if(!payload.name || !payload.email){
        return sendError(res,400,"name and email are required");
    }

    const db = await connectDB();
    const users = db.collection("users");

    await users.insertOne({
        "name" : payload.name,
        "email" : payload.email
    })

    return res.status(201).json({
        success : true,
        message : "New User added"
    })
})

const getThisUser = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    if(!ObjectId.isValid(id)){
        return sendError(res,400,"Invalid Request");
    }

    const db = await connectDB();
    const users = await db.collection("users");
    const user = await users.findOne({ _id : new ObjectId(id)});
    if(!user){
        return sendError(res,404,"UserNotFound");
    }

    return res.status(200).json({
        success : true,
        message : "User Found",
        user,
    })
})

const deleteThisUser = asyncHandler(async(req,res) => {
    const { id } = req.params;
    if(!ObjectId.isValid(id)){
        return sendError(res,400,"Invalid Request");
    }

    const db = await connectDB();
    const users = db.collection("users");

    const result = users.deleteOne({_id:new ObjectId(id)});
    if(result.deletedCount ===  0){
        return sendError(res,404,"UserNotFound");
    }

    return res.status(200).json({
        success:true,
        message:"user is deleted"
    })
})

const patchThisUser = asyncHandler(async(req,res) => {
    const { id } = req.params;
    const payload = req.body;
    if(!ObjectId.isValid(id) || (!payload.name && !payload.email)){
        return sendError(res,400,"Invalid Request");
    }

    const db = await connectDB();
    const users = db.collection("users");

    let updateFeilds = {};
    if(payload.name) updateFeilds.name = payload.name;
    if(payload.email) updateFeilds.email = payload.email;

    const result = await users.updateOne({_id : new ObjectId(id)},{$set: updateFeilds});
    if(result.matchedCount === 0){
        return sendError(res,404,"User not Found");
    }

    const user = await users.findOne({_id : new ObjectId(id)});
    return res.status(200).json({
        success :true,
        message : "User Updated",
        user
    })
})


module.exports ={ getAllUsers, postThisUser, getThisUser, deleteThisUser, patchThisUser };