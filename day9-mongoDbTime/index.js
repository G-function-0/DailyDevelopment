const express = require("express");
const connectDB = require("./db");

const PORT = 8000;
const app = express();





const requestLogger = (req,res,next)=>{
    console.log(`Method : ${req.method} and URL : ${req.url}`)
    next();
}



app.use(express.json())
app.use(requestLogger);


app.get("/users",(req,res)=>{
    res.status(200).json({
        "success": true,
        "message":"these are all the users",
    })
})

app.post("/users", async (req,res)=>{
    const payload = req.body;
    //payload validation
    if(!payload.name || !payload.email){
        return res.status(400).json({
            "success" :false,
            "message" : "Invalid body"
        })
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
})


app.listen(PORT, () => {
    console.log(`Listening on PORT : ${PORT}`);
} )