import express from "express";
const authRouter = express.Router();
import * as authController from "../controllers/auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

authRouter.post("/login",asyncHandler(authController.login));
authRouter.post("/signup",asyncHandler(authController.signup));
authRouter.post("/refresh",asyncHandler(authController.refresh));
authRouter.post("/logout", asyncHandler(authController.logout));

export { authRouter };