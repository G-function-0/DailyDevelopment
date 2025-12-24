const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/",authMiddleware,userController.getUser);

module.exports = router;