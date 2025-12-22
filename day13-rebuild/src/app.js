const express = require("express");
require("dotenv").config();

const app = express();
const userRoutes = require("./routes/user.routes");

app.use(express.json());

app.use("/users",userRoutes);

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on PORT 5173");
})