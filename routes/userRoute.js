import { Router } from "express";
import { middlewareToken } from "../controller/middlewareController.js";
import { asyncCatch } from "../utils/asynCatch.js";
import userController from "../controller/userController.js";

const userRoute = Router();

userRoute.get(
  "/",
  // asyncCatch(middlewareToken.verifyToken),
  asyncCatch(userController.getAllUser)
);
userRoute.get("/:id", asyncCatch(userController.getUser));

export default userRoute;
