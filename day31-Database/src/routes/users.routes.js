import express from "express";
const userRouter = express.Router();
import * as userController from "../controllers/users.controller.js";
import { authMiddleware, requiredOwner, requireRole } from "../middleware/auth.middleware.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { UserModel } from "../models/User.js"

userRouter.get("/:id",authMiddleware,
    requiredOwner(async (req)=> {
        
       const user =await UserModel.findById(req.params.id);
       
       return user?._id;
    }),
    asyncHandler(userController.getUser));
userRouter.get("/",authMiddleware,asyncHandler(userController.getUser));
userRouter.delete("/:id",authMiddleware,requireRole("admin"),userController.deleteUser);

export { userRouter }