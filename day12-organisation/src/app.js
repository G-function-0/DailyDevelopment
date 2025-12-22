const express = require("express");

const PORT = 5173;
const app = express();
const userRoutes = require("../routes/user.routes");

app.use(express.json());

app.use("/users",userRoutes);

app.listen(PORT,()=>{
    console.log("Server is running on PORT 5173");
})