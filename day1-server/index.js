const express = require("express");
const PORT = 8000;

const app = express();
app.use(express.json());

app.get('/health',(req,res)=>{
    res.json({
        status:"success ok"
        ,message:"Server is running."
    })
});

app.post('/echo',(req,res)=>{
    const payload = req.body;
    res.json({
        "received" : true,
        "data" : payload
    })
})
app.listen(PORT, () => { console.log("Server is listening on port 8000")});