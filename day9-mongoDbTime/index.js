const express = require("express");
const connectDB = require("./db");
const { ObjectId } = require("mongodb");

const PORT = 8000;
const app = express();
const asyncHandler = (func) => {
    return function (req,res,next){
             Promise
                .resolve(func(req,res,next))
                .catch(next)
    }
}
const sendError = (res,code,message) => {
    return res.status(code).json({
        success :false,
        message
    })
}
let db;
let users;

// const connection = asyncHandler(async () => {
//     db = await connectDB();
//     users = db.collection("users");
// })



const requestLogger = (req,res,next)=>{
    console.log(`Method : ${req.method} and URL : ${req.url}`)
    next();
}



app.use(express.json())
app.use(requestLogger);



app.get("/users", asyncHandler(async (req,res)=>{
    const db = await connectDB();
    const users = db.collection("users");
    const allUser = await users.find({}).toArray();
    res.status(200).json({
        "success": true,
        "message":"these are all the users",
        allUser,
    })
}))

app.post("/users", asyncHandler(async (req,res)=>{
    const payload = req.body;
    //payload validation
    if(!payload.name || !payload.email){
        return sendError(res,400,"Invalid Body");
    }
    
    
    const db = await connectDB();
    // array is inmemory and collections is mongodb simple 
    const users = db.collection("users");
    
    await users.insertOne({
        "name" : payload.name,
        "email" : payload.email
    })
    res.status(201).json({
        success : true,
        message : "User Created"
    })
}))

app.get("/users/:id",asyncHandler(async (req,res)=>{
    const { id }= req.params;
    if(!ObjectId.isValid(id)){
        return sendError(res,400,"Invalid request");
    }
    const db = await connectDB();
    const users  = db.collection("users");

    const user = await users.findOne({_id : new ObjectId(id)});

    if(!user){
        return sendError(res,404,"User not Found");
    }

    res.status(200).json({
        success : true,
        message: "Here is your user",
        user,
    })
}))




app.use((err,req,res,next)=>{
    sendError(res,500,err.message);
})
app.listen(PORT, () => {
    console.log(`Listening on PORT : ${PORT}`);
} )