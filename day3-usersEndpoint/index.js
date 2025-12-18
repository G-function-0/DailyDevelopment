

const express = require("express");

const app = express();
const PORT = 8000;
let id = 0;
app.use(express.json());
let users = [];
app.get("/users",(req,res)=>{
    return res.status(200).json({
        "success" : true,
        "message" : "all the current users",
        "users" : users,
    })
})

app.post("/users",(req,res)=>{
    const payload = req.body;
    if(Object.keys(payload).length === 0){
        return res.status(400).json({
            "success" : false,
            "message" : "Nothing received in body"
        });
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
    const user = users.find(u => u.id === id)
    if(!user){
        return res.status(404).json({
            "success":false,
            "message":"User Not Found"
        })
    }
    return res.status(200).json({
        "success":true,
        "message" : "user Found",
        "user": user,
    });
})

app.delete("/users/:id",(req,res)=>{
    const id = Number(req.params.id);
    const index = users.findIndex(u => u.id === id);
    if(index === -1){
        return res.status(404).status(404).json({
            "success":false,
            "message":"User not found"
        })
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
    const payload = req.body;
    if(Object.keys(payload).length === 0 || !payload.name) {
        return res.status(400).json({
            "success":false,
            "message":"Invalid body"
        })
    }

    const user = users.find(u => u.id === id)
    if(!user){
        return res.status(404).json({
            "success":false,
            "message":"User doesnt exists."
        });
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