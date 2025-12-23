const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware")
const userController = require("../controller/users.controller")

router.get("/",authMiddleware,userController.getAllUsers);


module.exports = router;