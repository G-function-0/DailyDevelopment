

const express = require("express");

const app = express();
const PORT = 8000;
let id = 0;
app.use(express.json());
let users = [];

function sendError(res,code,message){
    return res.status(code).json({
        "success":false,
        message,
    })
}
function findUserById(id){
    return users.find(u => u.id === id);
}
function validateId(res,id){
    if(isNaN(id)){
        sendError(res,400,"Invalide id");
        return false;
    }
    return true;
}



app.get("/users",(req,res)=>{
    return res.status(200).json({
        "success" : true,
        "message" : "all the current users",
        "users" : users,
    })
})

app.post("/users",(req,res)=>{
    const payload = req.body;
    if(!payload.name){
        return sendError(res,400,"Nothing received in body");
    }
    users = [{
                "id":++id,
                ...payload 
            },
                ...users];
                
    return res.status(201).json({
        "success" : true,
        "message":"new user added"
    })
})

app.get("/users/:id",(req,res)=>{
    const id = Number(req.params.id);
    if(!validateId(res,id)){
        return;
    }
    const user = findUserById(id);
    if(!user){
        return sendError(res,404,"User not found")
    }
    return res.status(200).json({
        "success":true,
        "message" : "user Found",
        "user": user,
    });
})

app.delete("/users/:id",(req,res)=>{
    const id = Number(req.params.id);
    if(!validateId(res,id)){
        return;
    }
    const index = users.findIndex(u => u.id === id);
    if(index === -1){
        return sendError(res,404,"User not found");
    }
    users.splice(index,1);
    return res.status(200).json({
        "success":true,
        "message":"user was deleted",
        users
    })
})

app.patch("/users/:id",(req,res)=>{
    const id = Number(req.params.id);
    if(!validateId(res,id)){
        return;
    }
    const payload = req.body;
    if(!payload.name) {
        return sendError(res,400,"Invalid body");
    }

    const user = findUserById(id);
    if(!user){
        return sendError(res,404,"User doesnt exists.");
    }

    user.name = payload.name;

   
    return res.status(200).json({
        "success":true,
        "message":"Here is the new user array",
        users,
    });
})


app.listen(PORT,()=>{
    console.log("message: server listening at PORT 8000")
})