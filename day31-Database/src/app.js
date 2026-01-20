import express from "express";
import config from "./config/index.js";
import { userRouter } from "./routes/users.routes.js";
import { authRouter } from "./auth/routes/auth.routes.js";
import { sendError } from "./utils/sendError.js";
import { connectDB } from "./db/index.js";

const PORT = config.port;
await connectDB();
export const app = express();
app.use(express.json());

app.use("/auth",authRouter)
app.use("/users",userRouter);


// app.use((err,req,res,next)=>{
//     return sendError(res,500,"internal server error (async Error)");
// })
app.listen(PORT || 5173, ()=> {
    console.log(`server is running on ${PORT}`);
})