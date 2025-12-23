
const express = require("express");
const config = require("./config/index");

const PORT = config.port;
const app = express();

const usersRoutes = require("./routes/users.routes")
const authRoutes = require("./routes/auth.routes")

app.use(express.json());
app.use("/auth",authRoutes);
app.use("/users",usersRoutes);

app.listen(PORT || 3000, ()=>{
    console.log(`Server is running on ${PORT}`);
})




