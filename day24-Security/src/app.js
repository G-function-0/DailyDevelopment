const express = require("express");
const config = require("../src/config/index");
const app = express();
const PORT = config.port;
const usersRoutes =  require("./routes/users.routes")
const authRoutes = require("./auth/routes/auth.routes");
const { sendError } = require("./utils/sendError");


app.use(express.json());

app.use("/auth",authRoutes)
app.use("/users",usersRoutes);


// app.use((err,req,res,next)=>{
//     return sendError(res,500,"internal server error (async Error)");
// })
app.listen(PORT || 5173, ()=> {
    console.log(`server is running on ${PORT}`);
})