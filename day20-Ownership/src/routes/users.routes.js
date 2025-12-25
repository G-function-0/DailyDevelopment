const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
const { authMiddleware , requiredOwner } = require("../middleware/auth.middleware");
const { connectDB } = require("../db");
const { ObjectId } = require("mongodb");
const asyncHandler = require("../utils/asyncHandler");


router.get("/:id",authMiddleware,
    requiredOwner(async (req)=> {
       const db = await connectDB(); 
       const users = db.collection("users");

       const user =await users.findOne({_id : new ObjectId(req.params.id)});

       return user?._id;
    }),
    asyncHandler(userController.getUser));
router.get("/",authMiddleware,asyncHandler(userController.getUser));

module.exports = router;