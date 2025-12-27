const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const asyncHandler = require("../../utils/asyncHandler");

router.post("/login",asyncHandler(authController.login));
router.post("/signup",asyncHandler(authController.signup));
module.exports = router;