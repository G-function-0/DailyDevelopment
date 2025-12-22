const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const asyncHandler = require("../utils/asyncHandler");


router.get("/",userController.getAllUsers);
router.post("/",userController.postThisUser);
router.get("/:id",userController.getThisUser);
router.delete("/:id",userController.deleteThisUser);
router.patch("/:id",userController.patchThisUser);
module.exports = router;