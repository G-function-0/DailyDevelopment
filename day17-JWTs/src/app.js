const express = require("express");
const config = require("../src/config/index");
const app = express();
const PORT = config.port;
const usersRoutes =  require("./routes/users.routes")
const authRoutes = require("./auth/routes/auth.routes")


app.use(express.json());

app.use("/auth",authRoutes)
app.use("/users",usersRoutes);

app.listen(PORT || 5173, ()=> {
    console.log(`server is running on ${PORT}`);
})