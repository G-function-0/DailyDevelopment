const express = require("express");

const app = express();
const PORT = 8000;
app.use(express.json());
let users = [];
app.get("/users",(req,res)=>{
    res.json({"users" : users,
        "message" : "all the current users"
    })
})

app.post("/users",(req,res)=>{
    const payload = req.body;
    users = [payload , ...users];
    res.json({
        "success" : true,
        "message":"new user added"
    })
})

app.get("/users/:id",(req,res)=>{
    const id = req.params.id;
    res.json({
        "user": users[id],
        "message" : "user Found"
    });
})

app.delete("/users/:id",(req,res)=>{
    const id = req.params.id;

    const deluser =   users.splice(id,1);
    res.json({
        "message":"below user was deleted",
        "deleted user": deluser
    })
})


app.listen(PORT,()=>{
    console.log("message: server listening at PORT 8000")
})