const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/auth.controller")


authRouter.post("/login",authController.login);

module.exports = authRouter;